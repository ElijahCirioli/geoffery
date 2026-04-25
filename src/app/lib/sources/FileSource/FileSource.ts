import fs from "node:fs/promises";
import path from "node:path";
import Game from "@/lib/models/trivia/Game";
import ListedGame from "@/lib/models/trivia/ListedGame";
import GameSource, { ListGamesResponse } from "@/lib/sources/GameSource";

// loads json game files from a directory without validating them
class FileSource implements GameSource {
	private MAX_RESULTS = 10;

	private directory: string;

	constructor(directory: string) {
		this.directory = directory;
	}

	async listGames(paginationToken?: string): Promise<ListGamesResponse> {
		// List all JSON files recursively in the configured directory
		const allFilePaths = await fs.readdir(this.directory, { recursive: true });
		const jsonFilePaths = allFilePaths
			.filter((relativePath) => relativePath.endsWith(".json"))
			.toSorted()
			.map((relativePath) => relativePath.replaceAll(path.win32.sep, path.posix.sep));

		// Extract a single page out of the total list of files
		const paginationIndex = paginationToken ? jsonFilePaths.indexOf(paginationToken) : 0;
		if (paginationIndex === -1) {
			return { games: [] };
		}
		const pageFilePaths = jsonFilePaths.slice(paginationIndex, paginationIndex + this.MAX_RESULTS);
		const nextPaginationToken = jsonFilePaths.at(paginationIndex + this.MAX_RESULTS);

		// Read in the files and parse as JSON
		const filePromises = pageFilePaths.map((relativePath) => {
			const filePath = this.resolvePath(relativePath);
			return fs.readFile(filePath, "utf8");
		});
		const files = await Promise.all(filePromises);
		const games = files.map((file, i) => {
			const game = JSON.parse(file) as ListedGame;
			// Replace the Game's ID with its relative file path so we can load it more easily
			return { ...game, id: pageFilePaths[i] };
		});

		return {
			games,
			paginationToken: nextPaginationToken,
		};
	}

	async loadGame(id: string): Promise<Game> {
		const filePath = this.resolvePath(id);
		const file = await fs.readFile(filePath, "utf8");
		const game = JSON.parse(file) as Game;
		return { ...game, id };
	}

	async saveGame(game: Game): Promise<void> {
		let filePath = this.resolvePath(game.id);
		if (!filePath.endsWith(".json")) {
			filePath = `${filePath}.json`;
		}
		await fs.mkdir(path.dirname(filePath), { recursive: true });
		await fs.writeFile(filePath, JSON.stringify(game, null, 4));
	}

	resolvePath(relativePath: string): string {
		return path.join(this.directory, relativePath);
	}
}

export default FileSource;
