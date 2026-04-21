import Category from "@/lib/models/trivia/Category";
import Question from "@/lib/models/trivia/Question";

export interface StandardRound {
	numQuestionsPerCategory: number;
	categories: Category[];
	pointValues: number[];
}

export interface QuestionWagerRound {
	question: Question;
}

type Round = StandardRound | QuestionWagerRound;

export default Round;
