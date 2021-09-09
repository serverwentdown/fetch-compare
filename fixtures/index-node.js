import process from 'node:process';
import fetch, {Request, Response, Headers} from 'node-fetch';

import run from './run.js';

global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.fetch = fetch;

async function main(file) {
	const tests = await import('./' + file + '.js');
	const result = await run(tests.default);
	process.send(result);
}

main(process.argv[2]).catch((error) => {
	console.error(error);
});
