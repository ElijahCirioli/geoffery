import Category from "@/lib/models/trivia/Category";
import Game from "@/lib/models/trivia/Game";
import { ImageQuestion, TextQuestion } from "@/lib/models/trivia/Question";
import { QuestionWagerRound, StandardRound } from "@/lib/models/trivia/Round";

const textQuestion1: TextQuestion = {
	type: "text",
	question: "What is 3 times 5?",
	answer: "15",
	isDouble: false,
};

const textQuestion2: TextQuestion = {
	type: "text",
	question: "How many sides are on a standard American triangle?",
	answer: "3",
	isDouble: false,
};

const textQuestion3: TextQuestion = {
	type: "text",
	question: "Who was the second president of the United States?",
	answer: "John Adams",
	isDouble: true,
};

const textQuestion4: TextQuestion = {
	type: "text",
	question: "Where are my keys?",
	answer: "In the pocket of your other pants",
	isDouble: false,
	notes: ["Also accept: in your hand"],
};

const textQuestion5: TextQuestion = {
	type: "text",
	question: "What is the world's largest ocean?",
	answer: "The Pacific Ocean",
	isDouble: false,
};

const textQuestion6: TextQuestion = {
	type: "text",
	question: "Who invented the safety elevator?",
	answer: "Elijah Otis",
	isDouble: false,
};

const textQuestion7: TextQuestion = {
	type: "text",
	question: "Which planet is closest to the sun?",
	answer: "Mercury",
	isDouble: true,
};

const textQuestion8: TextQuestion = {
	type: "text",
	question: "In what year did the Titanic sink?",
	answer: "1912",
	isDouble: false,
};

const textQuestion9: TextQuestion = {
	type: "text",
	question: "Which researcher is credited with developing the first polio vaccine?",
	answer: "Jonas Salk",
	isDouble: false,
};

const textQuestion10: TextQuestion = {
	type: "text",
	question: "What is the most populous city in the United States?",
	answer: "New York City",
	isDouble: false,
};

const imageQuestion1: ImageQuestion = {
	type: "image",
	imageUris: ["/src/test/resources/images/dino.jpeg"],
	question: "What color is the dinosaur?",
	answer: "Blue",
	isDouble: false,
	altText: "a blue dinosaur ornament wearing a Christmas hat",
	notes: ["Spikes are red"],
};

const imageQuestion2: ImageQuestion = {
	type: "image",
	imageUris: ["/src/test/resources/images/dog.jpeg"],
	answer: "Woof",
	isDouble: false,
	altText: "Close up dog",
};

const imageQuestion3: ImageQuestion = {
	type: "image",
	imageUris: ["/src/test/resources/images/snowman.jpeg"],
	question: "Why is he so sad?",
	answer: "Parents are getting divorced",
	isDouble: true,
	notes: ["And it's his fault"],
};

const imageQuestion4: ImageQuestion = {
	type: "image",
	imageUris: ["/src/test/resources/images/rocks.jpeg"],
	question: "Which prehistoric monument is pictured here?",
	answer: "Stonehenge",
	isDouble: false,
};

const category1: Category = {
	title: "Numeric Answers",
	description: "The answers to all questions will be numbers.",
	questions: [textQuestion1, textQuestion2, textQuestion8],
};

const category2: Category = {
	title: "People",
	description: "People of some significance.",
	questions: [textQuestion3, textQuestion6, textQuestion9],
};

const category3: Category = {
	title: "Geography",
	questions: [textQuestion5, textQuestion7, textQuestion10],
};

const category4: Category = {
	title: 'Say "cheese"!',
	description: "Questions with pictures.",
	questions: [imageQuestion1, imageQuestion2, imageQuestion3],
};

const standardRound1: StandardRound = {
	type: "standard",
	categories: [category1, category2],
	pointValues: [100, 200],
};

const standardRound2: StandardRound = {
	type: "standard",
	categories: [category3, category4],
	pointValues: [200, 400],
};

const questionWagerRound1: QuestionWagerRound = {
	type: "questionWager",
	categoryTitle: "Forgetfulness",
	question: textQuestion4,
};

const questionWagerRound2: QuestionWagerRound = {
	type: "questionWager",
	categoryTitle: "Famous Landmarks",
	question: imageQuestion4,
};

const game1: Game = {
	id: "game1",
	title: "Test Game 1",
	description: "A simple game for testing purposes",
	rounds: [standardRound1, standardRound2, questionWagerRound2],
};

const game2: Game = {
	id: "game2",
	title: "Test Game 2",
	description: "An extra short game for testing purposes",
	rounds: [standardRound1, questionWagerRound1],
};

const TestGames = {
	game1,
	game2,
};

export default TestGames;
