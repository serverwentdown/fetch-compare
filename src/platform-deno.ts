import {platform} from 'os';
import {spawn} from 'child_process';

import {Platform, Context, Result} from './types.js';

export default class PlatformDeno implements Platform {
	async run(ctx: Context, file: string): Promise<Result> {
		const child = spawn(
			platform() === 'win32' ? 'deno.exe' : 'deno',
			['run', '--allow-read', '--allow-net=httpbin.org', 'index-deno.js', file],
			{cwd: ctx.fixturesPath, stdio: ['pipe', 'pipe', 'inherit']},
		);
		const stdout = await new Promise<string>((resolve, reject) => {
			let stdout = '';
			child.stdout.on('data', (data) => {
				stdout += data as string;
			});
			child.once('error', reject);
			child.once('exit', (code) => {
				if (code !== 0) {
					reject(code);
				}

				resolve(stdout);
			});
		});
		child.kill();

		return JSON.parse(stdout) as Result;
	}
}
