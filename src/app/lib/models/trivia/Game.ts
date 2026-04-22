import ListedGame from "@/lib/models/trivia/ListedGame";
import Round from "@/lib/models/trivia/Round";

interface Game extends ListedGame {
	rounds: Round[];
}

export default Game;
