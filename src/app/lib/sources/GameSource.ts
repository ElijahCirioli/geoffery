import Game from "@/lib/models/trivia/Game";
import ListedGame from "@/lib/models/trivia/ListedGame";

export interface ListGamesResponse {
	games: ListedGame[];
	paginationToken?: string;
}

interface GameSource {
	listGames(paginationToken?: string): Promise<ListGamesResponse>;
	loadGame(id: string): Promise<Game>;
}

export default GameSource;
