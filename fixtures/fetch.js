const tests = {
	fetch: {
		async acceptContentLength() {
			try {
				const ctrl = new AbortController();
				setTimeout(() => ctrl.abort(), 5000);
				const response = await fetch('https://httpbin.org/get', {
					headers: {'Content-Length': 2},
					signal: ctrl.signal,
				});
				const o = await response.json();
				const length = o.headers['Content-Length'];
				return `Content-Length: ${length}`;
			} catch (error) {
				return error.toString();
			}
		},
	},
};
export default tests;
