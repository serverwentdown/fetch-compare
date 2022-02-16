/* eslint-disable @typescript-eslint/ban-types */
export type ResultObject =
	| string
	| number
	| null
	| undefined
	| Record<string, unknown>;
export type Result = Record<string, Record<string, ResultObject>>;

export interface Context {
	fixturesPath: string;
	fixturesURL: string;
}

export interface Platform {
	run(ctx: Context, file: string): Promise<Result>;
}

export interface BrowserDriver {
	path: string;
	args: (port: number) => string[];
}

export interface ServerAddress {
	address: string;
	port: number;
	base: string;
}
