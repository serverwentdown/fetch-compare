import cp from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import getPort from 'get-port';
// @ts-expect-error: Missing types
import tcpPortUsed from 'tcp-port-used';
import WebDriver from 'webdriver';

import {Platform, Result, BrowserDriver, Context} from './types.js';

async function start(
	driver: BrowserDriver,
	silent = false,
): Promise<{child: cp.ChildProcess; port: number}> {
	const port = await getPort();
	let command = driver.path;
	try {
		await fs.access(command);
	} catch {
		command = path.basename(command);
	}

	const stdout = silent ? 'ignore' : 'inherit';
	const child = cp.spawn(command, driver.args(port), {
		stdio: ['ignore', stdout, stdout],
	});
	await new Promise((resolve, reject) => {
		child.once('error', reject);
		child.once('spawn', resolve);
	});
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	await tcpPortUsed.waitUntilUsed(port, 100, 10_000);
	return {child, port};
}

async function stop(child: cp.ChildProcess): Promise<void> {
	if (child.exitCode === null) {
		child.kill();
	}
}

export default class PlatformBrowser implements Platform {
	private readonly driver: BrowserDriver;
	private readonly name: string;
	private readonly silent: boolean;

	constructor(driver: BrowserDriver, name: string, silent = false) {
		this.driver = driver;
		this.name = name;
		this.silent = silent;
	}

	async run(ctx: Context, file: string): Promise<Result> {
		const {child, port} = await start(this.driver, this.silent);
		const client = await WebDriver.newSession({
			logLevel: 'warn',
			port,
			capabilities: {browserName: this.name},
		});

		await client.navigateTo(`${ctx.fixturesURL}/index.html`);
		const result: Result = (await client.executeScript(
			`
			async function main(file) {
				document.body.style.backgroundColor = '#f00';
				const run = await import('./run.js');
				const tests = await import('./' + file + '.js');
				const result = await run.default(tests.default);
				document.body.style.backgroundColor = '#0f0';
				return result;
			}
			return main(arguments[0]);
			`,
			[file],
		)) as Result;

		await client.deleteSession();
		await stop(child);
		return result;
	}
}
