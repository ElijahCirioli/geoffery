import TestGames from "@test/objects/TestGames";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { it as baseIt, describe, expect } from "vitest";
import Game from "@/lib/models/trivia/Game";
import FileSource from "@/lib/sources/FileSource/FileSource";

const it = baseIt.extend("sourceWithTempDir", async ({}, { onCleanup }) => {
	// It would be cooler to use mkdtempDisposable(), but it is still very new so I will wait for wider support
	const tempDirPath = await mkdtemp(path.join(tmpdir(), "FileSourceTest"));
	const source = new FileSource(tempDirPath);

	onCleanup(async () => {
		await rm(tempDirPath, { recursive: true, force: true });
	});

	return source;
});

describe("listGames", () => {
	it("returns fewer than 10 games in a single page", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/games/group"));
		const listGamesResponse = await source.listGames();

		const expectedGames = [
			{ ...TestGames.game1, id: "game1.json" },
			{ ...TestGames.game2, id: "game2.json" },
		];
		expect(listGamesResponse.paginationToken).toBeUndefined();
		expect(listGamesResponse.games.length).toBe(expectedGames.length);
		listGamesResponse.games.forEach((listedGame, i) => expect(expectedGames[i]).toMatchObject(listedGame));
	});

	it("paginates greater than 10 games", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/games"));

		const emptyGames: Game[] = [];
		for (let i = 1; i <= 7; i++) {
			emptyGames.push({ id: `empty/game${i}.json`, title: `Empty game ${i}`, rounds: [] });
		}
		const expectedGames = [
			...emptyGames,
			{ ...TestGames.game1, id: "game1.json" },
			{ ...TestGames.game2, id: "game2.json" },
			{ ...TestGames.game1, id: "group/game1.json" },
			{ ...TestGames.game2, id: "group/game2.json" },
		];

		const listGamesResponse1 = await source.listGames();
		expect(listGamesResponse1.games.length).toBe(10);
		listGamesResponse1.games.forEach((listedGame, i) => expect(expectedGames[i]).toMatchObject(listedGame));
		expect(listGamesResponse1.paginationToken).toBe(expectedGames[10].id);

		const listGamesResponse2 = await source.listGames(listGamesResponse1.paginationToken);
		expect(listGamesResponse2.games.length).toBe(expectedGames.length - 10);
		listGamesResponse2.games.forEach((listedGame, i) => expect(expectedGames[i + 10]).toMatchObject(listedGame));
		expect(listGamesResponse2.paginationToken).toBeUndefined();
	});

	it("returns no results for an invalid pagination token", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/games"));
		const listGamesResponse = await source.listGames("random");

		expect(listGamesResponse.games).toStrictEqual([]);
		expect(listGamesResponse.paginationToken).toBeUndefined();
	});

	it("returns an error when files are not valid json", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/junk"));
		const listGamesResponse = source.listGames();

		await expect(listGamesResponse).rejects.toThrow();
	});
});

describe("loadGame", () => {
	it("loads game from file", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/games"));
		const loadGameResponse = await source.loadGame("game1.json");

		const expectedGame = { ...TestGames.game1, id: "game1.json" };
		expect(expectedGame).toMatchObject(loadGameResponse);
	});

	it("loads game from file in nested directory", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/games"));
		const loadGameResponse = await source.loadGame("group/game1.json");

		const expectedGame = { ...TestGames.game1, id: "group/game1.json" };
		expect(expectedGame).toMatchObject(loadGameResponse);
	});

	it("returns an error when loading non-existent file", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/games"));
		const loadGameResponse = source.loadGame("fake.json");

		await expect(loadGameResponse).rejects.toThrow();
	});

	it("returns an error when loading file that is not valid json", async () => {
		const source = new FileSource(path.join(__dirname, "../../../resources/junk"));
		const loadGameResponse = source.loadGame("invalid.json");

		await expect(loadGameResponse).rejects.toThrow();
	});
});

describe("saveGame", () => {
	it("saves a game to a file and allows reading it again", async ({ sourceWithTempDir }) => {
		const game = { ...TestGames.game1, id: "game1.json" };

		await sourceWithTempDir.saveGame(game);
		const loadGameResponse = await sourceWithTempDir.loadGame(game.id);

		expect(loadGameResponse).toMatchObject(game);
	});

	it("appends json file extension to game ID when saving it", async ({ sourceWithTempDir }) => {
		const game = { ...TestGames.game1 };
		const expectedGame = { ...game, id: "game1.json" };

		await sourceWithTempDir.saveGame(game);
		const loadGameResponse = await sourceWithTempDir.loadGame(expectedGame.id);

		expect(loadGameResponse).toMatchObject(expectedGame);
	});

	it("creates nested directories to place file in", async ({ sourceWithTempDir }) => {
		const game = { ...TestGames.game1, id: "nested/group/game1.json" };

		await sourceWithTempDir.saveGame(game);
		const loadGameResponse = await sourceWithTempDir.loadGame(game.id);

		expect(loadGameResponse).toMatchObject(game);
	});

	it("overwrites an existing file with new data", async ({ sourceWithTempDir }) => {
		const game1 = { ...TestGames.game1, id: "game1.json" };
		const game2 = { ...TestGames.game2, id: "game1.json" };

		await sourceWithTempDir.saveGame(game1);
		const loadGameResponse1 = await sourceWithTempDir.loadGame(game1.id);

		expect(loadGameResponse1).toMatchObject(game1);

		await sourceWithTempDir.saveGame(game2);
		const loadGameResponse2 = await sourceWithTempDir.loadGame(game2.id);

		expect(loadGameResponse2).toMatchObject(game2);
	});
});
