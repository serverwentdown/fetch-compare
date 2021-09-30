import {fork} from 'child_process';
import path from 'path';

import {Platform, Context, Result} from './types.js';

export default class PlatformNode implements Platform {
	async run(ctx: Context, file: string): Promise<Result> {
		const child = fork(path.join(ctx.fixturesPath, 'index-node.js'), [file], {
			cwd: ctx.fixturesPath,
		});
		const result: Result = await new Promise((resolve, reject) => {
			child.once('error', reject);
			child.once('exit', reject);
			child.once('message', resolve);
		});
		child.kill();

		return result;
	}
}
