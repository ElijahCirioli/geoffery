import Category from "@/lib/models/trivia/Category";
import Question from "@/lib/models/trivia/Question";

export interface StandardRound {
	type: "standard";
	categories: Category[];
	pointValues: number[];
}

export interface QuestionWagerRound {
	type: "questionWager";
	categoryTitle: string;
	categoryDescription?: string;
	question: Question;
}

type Round = StandardRound | QuestionWagerRound;

export default Round;
