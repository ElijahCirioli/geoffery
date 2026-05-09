interface BaseQuestion {
	isDouble: boolean;
	answer: string;
	notes?: string[];
}

export interface TextQuestion extends BaseQuestion {
	type: "text";
	question: string;
}

export interface ImageQuestion extends BaseQuestion {
	type: "image";
	imageUris: string[];
	question?: string;
	altText?: string;
}

type Question = TextQuestion | ImageQuestion;

export default Question;
