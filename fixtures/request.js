/* eslint-disable no-new */
const tests = {
	request: {
		async unexpectedPercent() {
			try {
				new Request('http://example.com%');
				return null;
			} catch (error) {
				return error.toString();
			}
		},
		async rejectCredentials() {
			try {
				new Request('http://user:pass@example.com');
				return null;
			} catch (error) {
				return error.toString();
			}
		},
		async rejectBodyInGET() {
			try {
				new Request('http://example.com', {body: 'a'});
				return null;
			} catch (error) {
				return error.toString();
			}
		},
		async rejectEmptyBodyInGET() {
			try {
				new Request('http://example.com', {body: ''});
				return null;
			} catch (error) {
				return error.toString();
			}
		},
		async acceptContentLength() {
			try {
				new Request('http://example.com', {
					headers: {
						'Content-Length': 0,
					},
				});
				return null;
			} catch (error) {
				return error.toString();
			}
		},
	},
};
export default tests;
/* eslint-enable no-new */
