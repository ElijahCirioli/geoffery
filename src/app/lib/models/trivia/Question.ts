interface BaseQuestion {
	isDouble: boolean;
	answer: string;
	notes?: string[];
}

export interface TextQuestion extends BaseQuestion {
	question: string;
}

export interface ImageQuestion extends BaseQuestion {
	imageUri: string;
	question?: string;
}

type Question = TextQuestion | ImageQuestion;

export default Question;
