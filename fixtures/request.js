/* eslint-disable no-new */
const tests = {
	request: {
		async invalidURL() {
			try {
				new Request('http://example.com%');
			} catch ({name, message}) {
				return {name, message};
			}
		},
	},
};
export default tests;
/* eslint-enable no-new */
