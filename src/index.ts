import path from 'path';
import logger from '@wdio/logger';
import Table from 'cli-table3';

import {Platform, Result, ResultObject, Context} from './types';
import PlatformBrowser from './platform-browser';
import PlatformNode from './platform-node';
import PlatformDeno from './platform-deno';
import {chrome, firefox, safari} from './browser-drivers';
import {FixturesServer} from './server';

const log = logger('fetch-compare');
logger.setLevel('fetch-compare', 'warn');

const silent = true;
const platforms: Record<string, Platform> = {
	chrome: new PlatformBrowser(chrome, 'chrome', silent),
	firefox: new PlatformBrowser(firefox, 'firefox', silent),
	safari: new PlatformBrowser(safari, 'safari', silent),
	node: new PlatformNode(),
	deno: new PlatformDeno(),
};

function formatValue(v: ResultObject): string {
	if (v === null) {
		return 'null';
	}

	if (v === undefined) {
		return 'undefined';
	}

	if (typeof v === 'string' || typeof v === 'number') {
		return v.toString();
	}

	return JSON.stringify(v);
}

function* tabularNames(reference: Result): Iterable<[string, string]> {
	/* eslint-disable guard-for-in */
	for (const groupName in reference) {
		const results = reference[groupName];
		for (const resultName in results) {
			yield [groupName, resultName];
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
	for (const [group, result] of tabularNames(ref)) {
		for (const n of names) {
			yield [`${group}:${result}`, n, formatValue(results[n][group][result])];
		}
	}
}

async function run() {
	const fixturesPath = path.join(process.cwd(), 'fixtures');

	// Set up fixtures server
	const fixturesServer = new FixturesServer(fixturesPath);
	const addr = await fixturesServer.start();

	// Shared data among platforms
	const ctx: Context = {
		fixturesPath,
		fixturesURL: addr.base,
	};

	const results: Record<string, Result> = {};

	// Call each platform
	/* eslint-disable guard-for-in, no-await-in-loop */
	for (const name in platforms) {
		try {
			log.debug(name, 'starting');
			results[name] = await platforms[name].run(ctx, 'all');
			log.debug(name, results[name]);
		} catch (error: unknown) {
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
