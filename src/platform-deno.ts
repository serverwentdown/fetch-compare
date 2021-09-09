import cp from 'child_process';
// @ts-expect-error: Missing types
import {binary} from 'deno-prebuilt';

import {Platform, Result} from './types.js';

export default class PlatformDeno implements Platform {
	async run(): Promise<Result> {
		throw new Error('not implemented');
		/* eslint-disable no-unreachable */
		const child = cp.spawn(binary, []);
		await new Promise((resolve, reject) => {
			child.once('error', reject);
			child.once('exit', reject);
			child.once('spawn', resolve);
		});
		child.kill();
		/* eslint-enable no-unreachable */
	}
}
