import Question from "@/lib/models/trivia/Question";

interface Category {
	title: string;
	description?: string;
	questions: Question[];
}

export default Category;
