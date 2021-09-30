import net from 'net';

import Koa from 'koa';
import files from 'koa-files';

import {ServerAddress} from './types.js';

export class FixturesServer {
	private readonly koa: Koa;

	private server: net.Server | null = null;

	constructor(path: string) {
		this.koa = new Koa();
		this.koa.use(files(path));
	}

	async start(): Promise<ServerAddress> {
		return new Promise((resolve, reject) => {
			this.server = this.koa.listen(0, 'localhost', () => {
				const addr = this.server?.address();
				if (typeof addr === 'string' || !addr) {
					reject(new Error('invalid address'));
					return;
				}

				resolve({
					address: addr.address,
					port: addr.port,
					base: `http://localhost:${addr.port}`,
				});
			});
		});
	}

	async stop(): Promise<void> {
		return new Promise((resolve) => {
			this.server?.close(() => {
				resolve();
			});
		});
	}
}
