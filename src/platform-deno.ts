import {spawn} from 'child_process';
import logger from '@wdio/logger';
// @ts-expect-error: Missing types
import {binary} from 'deno-prebuilt';

import {Platform, Result} from './types.js';

const log = logger('fetch-compare');

export default class PlatformDeno implements Platform {
	async run(ctx: Record<string, any>, file: string): Promise<Result> {
		const child = spawn(
			binary,
			['run', '--allow-read', '--allow-net=httpbin.org', 'index-deno.js', file],
			{cwd: ctx.fixturesPath},
		);
		const stdout = await new Promise((resolve, reject) => {
			child.once('error', reject);
			child.once('exit', reject);
			let stdout = '';
			child.stdout.on('data', (data) => {
				stdout += data;
			});
			child.once('exit', () => {
				resolve(stdout);
			});
		});
		child.kill();

		return JSON.parse(stdout);
	}
}
