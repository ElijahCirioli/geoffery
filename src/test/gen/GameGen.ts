import { fc } from "@fast-check/vitest";
import Category from "@/lib/models/trivia/Category";
import Game from "@/lib/models/trivia/Game";
import ListedGame from "@/lib/models/trivia/ListedGame";
import Question, { ImageQuestion, TextQuestion } from "@/lib/models/trivia/Question";
import Round, { QuestionWagerRound, StandardRound } from "@/lib/models/trivia/Round";

export const textQuestion: fc.Arbitrary<TextQuestion> = fc.record({
	type: fc.constant("text"),
	question: fc.string(),
	answer: fc.string(),
	isDouble: fc.boolean(),
	notes: fc.option(fc.array(fc.string(), { minLength: 0, maxLength: 10 })),
});

export const imageQuestion: fc.Arbitrary<ImageQuestion> = fc.record({
	type: fc.constant("image"),
	imageUris: fc.array(fc.string(), { minLength: 1, maxLength: 4 }),
	question: fc.option(fc.string()),
	altText: fc.option(fc.string()),
	answer: fc.string(),
	isDouble: fc.boolean(),
	notes: fc.option(fc.array(fc.string(), { minLength: 0, maxLength: 10 })),
});

export const question: fc.Arbitrary<Question> = fc.oneof(textQuestion, imageQuestion);

export const category: fc.Arbitrary<Category> = fc.record({
	title: fc.string(),
	questions: fc.array(question, { minLength: 1, maxLength: 100 }),
});

export const standardRound: fc.Arbitrary<StandardRound> = fc.record({
	type: fc.constant("standard"),
	categories: fc.array(category, { minLength: 1, maxLength: 100 }),
	pointValues: fc.array(fc.integer({ min: 0 }), { minLength: 1, maxLength: 100 }),
});

export const questionWagerRound: fc.Arbitrary<QuestionWagerRound> = fc.record({
	type: fc.constant("questionWager"),
	categoryTitle: fc.string(),
	categoryDescription: fc.option(fc.string()),
	question: question,
});

export const round: fc.Arbitrary<Round> = fc.oneof(standardRound, questionWagerRound);

export const game: fc.Arbitrary<Game> = fc.record({
	id: fc.uuid(),
	title: fc.string(),
	description: fc.option(fc.string()),
	rounds: fc.array(round, { minLength: 1, maxLength: 100 }),
});

export const listedGame: fc.Arbitrary<ListedGame> = fc.record({
	id: fc.uuid(),
	title: fc.string(),
	description: fc.option(fc.string()),
});
