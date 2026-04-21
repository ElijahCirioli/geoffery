import Question from "@/lib/models/trivia/Question";

interface Category {
	title: string;
	questions: Question[];
}

export default Category;
