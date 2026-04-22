import Game from "@/lib/models/trivia/Game";
import GameSource, { ListGamesResponse } from "@/lib/sources/GameSource";

class StaticSource implements GameSource {
	private games: Game[];

	constructor(games: Game[]) {
		this.games = games;
	}

	async listGames(_paginationToken?: string): Promise<ListGamesResponse> {
		return { games: this.games };
	}

	async loadGame(id: string): Promise<Game> {
		const game = this.games.find((game) => game.id === id);
		if (!game) {
			throw new Error(`No game found with id: ${id}`);
		}
		return game;
	}
}

export default StaticSource;
