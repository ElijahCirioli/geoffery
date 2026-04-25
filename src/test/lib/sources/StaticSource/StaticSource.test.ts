import { fc, it } from "@fast-check/vitest";
import { game } from "@test/gen/gameGen";
import { describe, expect } from "vitest";
import StaticSource from "@/lib/sources/StaticSource/StaticSource";

describe("listGames", () => {
	it.prop([fc.array(game)])("returns all of the games in a single page", async (games) => {
		const source = new StaticSource(games);
		const listGamesResponse = await source.listGames();

		expect(listGamesResponse.paginationToken).toBeUndefined();
		expect(listGamesResponse.games.length).toBe(games.length);
		listGamesResponse.games.forEach((listedGame, i) => expect(games[i]).toMatchObject(listedGame));
	});
});

describe("loadGame", () => {
	it.prop([fc.array(game)])("returns the game with the given ID", async (games) => {
		const source = new StaticSource(games);

		const tests = games.map(async (game) => {
			const loadGameResponse = await source.loadGame(game.id);
			expect(loadGameResponse).toMatchObject(game);
		});
		await Promise.all(tests);
	});

	it.prop([fc.array(game), fc.uuid()])("returns an error when the ID is not found", async (games, id) => {
		const source = new StaticSource(games);
		const loadGameResponse = source.loadGame(id);

		await expect(loadGameResponse).rejects.toThrow(`No game found with id: ${id}`);
	});
});
