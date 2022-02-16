// @ts-expect-error: Missing types
import {path as chromepath} from 'chromedriver';
import {path as firefoxpath} from 'geckodriver';

import {BrowserDriver} from './types.js';

export const chrome: BrowserDriver = {
	path: chromepath as string,
	args(port: number, logLevel = 'warn') {
		const logLevelArg = {
			trace: 'ALL',
			debug: 'DEBUG',
			info: 'INFO',
			warn: 'WARNING',
			error: 'SEVERE',
			silent: 'OFF',
		}[logLevel];
		if (!logLevelArg) {
			throw new Error('invalid log level');
		}

		return [`--port=${port}`, `--log-level=${logLevelArg}`];
	},
};
export const firefox: BrowserDriver = {
	path: firefoxpath,
	args(port: number, logLevel = 'warn') {
		const logLevelArg = {
			trace: 'trace',
			debug: 'debug',
			info: 'info',
			warn: 'warn',
			error: 'error',
			silent: 'fatal',
		}[logLevel];
		if (!logLevelArg) {
			throw new Error('invalid log level');
		}

		return ['--port', `${port}`, '--log', `${logLevelArg}`];
	},
};
export const safari: BrowserDriver = {
	path: '/usr/bin/safaridriver',
	args: (port: number, _logLevel = 'none') => ['-p', `${port}`],
};
