import run from './run.js';

async function main(file) {
	const tests = await import('./' + file + '.js');
	const result = await run(tests.default);
	console.log(JSON.stringify(result));
}

main(Deno.args[0]).catch((error) => {
	console.error(error);
});
