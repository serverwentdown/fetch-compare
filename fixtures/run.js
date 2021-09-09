export default async function run(tests) {
	const results = {};
	/* eslint-disable guard-for-in, no-await-in-loop */
	for (const sectionKey in tests) {
		results[sectionKey] = {};
		for (const fnKey in tests[sectionKey]) {
			results[sectionKey][fnKey] = await tests[sectionKey][fnKey]();
		}
	}
	/* eslint-enable guard-for-in, no-await-in-loop */

	return results;
}
