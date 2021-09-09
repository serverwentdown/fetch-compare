import process from 'process';
import cp from 'child_process';
import path from 'path';

import {Platform, Result} from './types.js';

export default class PlatformNode implements Platform {
	async run(ctx: Record<string, any>, file: string): Promise<Result> {
		const child = cp.fork(
			path.join(process.cwd(), 'fixtures', 'index-node.js'),
			[file],
		);
		const result: Result = await new Promise((resolve, reject) => {
			child.once('error', reject);
			child.once('exit', reject);
			child.once('message', resolve);
		});
		child.kill();

		return result;
	}
}
