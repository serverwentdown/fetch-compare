import logger from '@wdio/logger';
import Table from 'cli-table3';

import {Platform, Result, Context} from './types';
import PlatformBrowser from './platform-browser';
import PlatformNode from './platform-node';
import PlatformDeno from './platform-deno';
import {chrome, firefox, safari} from './browser-drivers';
import {FixturesServer} from './server';

const log = logger('fetch-compare');
logger.setLevel('fetch-compare', 'info');

const silent = true;
const platforms: Record<string, Platform> = {
	chrome: new PlatformBrowser(chrome, 'chrome', silent),
	firefox: new PlatformBrowser(firefox, 'firefox', silent),
	safari: new PlatformBrowser(safari, 'safari', silent),
	node: new PlatformNode(),
	deno: new PlatformDeno(),
};

function* tabularNames(reference: Result): Iterable<[string, string, string]> {
	/* eslint-disable guard-for-in */
	for (const groupName in reference) {
		const results = reference[groupName];
		for (const resultName in results) {
			const resultObject = results[resultName];
			for (const key in resultObject) {
				yield [groupName, resultName, key];
			}
		}
	}
	/* eslint-enable guard-for-in */
}

function* tabularResults(results: Record<string, Result>): Iterable<string[]> {
	const ref = Object.values(results)[0];
	if (!ref) {
		return;
	}

	const names = Object.keys(results);
	for (const [group, result, key] of tabularNames(ref)) {
		for (const n of names) {
			yield [
				`${group}:${result}:${key}`,
				n,
				results[n][group][result][key].toString(),
			];
		}
	}
}

async function run() {
	// Set up fixtures server
	const fixturesServer = new FixturesServer();
	const addr = await fixturesServer.start();

	// Shared data among platforms
	const ctx: Context = {
		fixturesURL: addr.base,
	};

	const results: Record<string, Result> = {};

	// Call each platform
	/* eslint-disable guard-for-in, no-await-in-loop */
	for (const name in platforms) {
		try {
			results[name] = await platforms[name].run(ctx, 'all');
			log.debug(name, results[name]);
		} catch (error: Error) {
			log.error(name, error);
		}
	}
	/* eslint-enable guard-for-in, no-await-in-loop */

	const table = new Table({
		head: ['Test', 'Platform', 'Value'],
		chars: {mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
	});
	for (const row of tabularResults(results)) {
		table.push(row);
	}

	console.log(table.toString());

	// Tear down fixtures server
	await fixturesServer.stop();
}

run().catch((error) => {
	log.error(error);
});
