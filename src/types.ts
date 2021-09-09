export type ResultObject = Record<string, string | number | null>;
export type Result = Record<string, Record<string, ResultObject>>;

export interface Context {
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
