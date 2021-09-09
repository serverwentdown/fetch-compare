// @ts-expect-error: Missing types
import {binary} from 'deno-prebuilt';

import {Platform, Result} from './types.js';

export default class PlatformDeno implements Platform {
	async run(): Promise<Result> {
		throw new Error('not implemented');
	}
}
