/* eslint-disable no-new */
const tests = {
	request: {
		async invalidURL() {
			try {
				new Request('http://example.com%');
				return {error: null};
			} catch (error) {
				return {error: error.toString()};
			}
		},
		async rejectCredentials() {
			try {
				new Request('http://user:pass@example.com');
				return {error: null};
			} catch (error) {
				return {error: error.toString()};
			}
		},
	},
};
export default tests;
/* eslint-enable no-new */
