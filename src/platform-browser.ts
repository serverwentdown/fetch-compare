import cp from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import getPort from 'get-port';
// @ts-expect-error: Missing types
import tcpPortUsed from 'tcp-port-used';
import WebDriver from 'webdriver';

import {Platform, Context, Result, BrowserDriver} from './types.js';

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

	async interact(ctx: Context, file: string, port: number): Promise<Result> {
		const client = await WebDriver.newSession({
			logLevel: 'warn',
			port,
			capabilities: {
				browserName: this.name,
				'goog:chromeOptions': {
					args: [
						'--disable-infobars',
						'--headless',
						'--disable-gpu',
						'--window-size=1440,735',
					],
				},
				'moz:firefoxOptions': {
					args: ['-headless'],
				},
			},
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
		return result;
	}

	async run(ctx: Context, file: string): Promise<Result> {
		const {child, port} = await start(this.driver, this.silent);
		try {
			const result = await this.interact(ctx, file, port);
			await stop(child);
			return result;
		} finally {
			await stop(child);
		}
	}
}
