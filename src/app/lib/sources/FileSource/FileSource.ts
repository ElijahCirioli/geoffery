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
		const jsonFilePaths = allFilePaths.filter((path) => path.endsWith(".json")).toSorted();

		// Extract a single page out of the total list of files
		const paginationIndex = paginationToken ? jsonFilePaths.indexOf(paginationToken) : 0;
		if (paginationIndex === -1) {
			return { games: [] };
		}
		const pageFilePaths = jsonFilePaths.slice(paginationIndex + 1, paginationIndex + this.MAX_RESULTS + 1);
		const nextPaginationToken =
			paginationIndex + this.MAX_RESULTS < jsonFilePaths.length ? pageFilePaths.at(-1) : undefined;

		// Read in the files and parse as JSON
		const filePromises = pageFilePaths.map((path) => fs.readFile(path, "utf8"));
		const files = await Promise.all(filePromises);
		const games = files.map((file, i) => {
			const game = JSON.parse(file) as ListedGame;
			const gameFilePath = pageFilePaths[i];
			// Replace the Game's ID with its file path so we can load it more easily
			return { ...game, id: gameFilePath };
		});

		return {
			games,
			paginationToken: nextPaginationToken,
		};
	}

	async loadGame(id: string): Promise<Game> {
		const file = await fs.readFile(id, "utf8");
		const game = JSON.parse(file) as Game;
		return { ...game, id };
	}

	async saveGame(game: Game): Promise<void> {
		const filePath = path.parse(game.id);
		await fs.mkdir(filePath.dir, { recursive: true });
		await fs.writeFile(game.id, JSON.stringify(game));
	}
}

export default FileSource;
