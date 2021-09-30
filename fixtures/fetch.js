const tests = {
	fetch: {
		async acceptCookie() {
			try {
				const ctrl = new AbortController();
				setTimeout(() => ctrl.abort(), 5000);
				const response = await fetch('https://httpbin.org/get', {
					headers: {'Cookie': 'overwrote-cookie'},
					signal: ctrl.signal,
				});
				const o = await response.json();
				return `Cookie: ${o.headers['Cookie']}`;
			} catch (error) {
				return error.toString();
			}
		},
		async acceptReferer() {
			try {
				const ctrl = new AbortController();
				setTimeout(() => ctrl.abort(), 5000);
				const response = await fetch('https://httpbin.org/get', {
					headers: {'Referer': 'overwrote-referer'},
					signal: ctrl.signal,
				});
				const o = await response.json();
				return `Referer: ${o.headers['Referer']}`;
			} catch (error) {
				return error.toString();
			}
		},
		async acceptKeepAlive() {
			try {
				const ctrl = new AbortController();
				setTimeout(() => ctrl.abort(), 5000);
				const response = await fetch('https://httpbin.org/get', {
					headers: {'Keep-Alive': 'timeout=5, max=1000'},
					signal: ctrl.signal,
				});
				const o = await response.json();
				return `Keep-Alive: ${o.headers['Keep-Alive']}`;
			} catch (error) {
				return error.toString();
			}
		},
		async acceptDate() {
			try {
				const ctrl = new AbortController();
				setTimeout(() => ctrl.abort(), 5000);
				const response = await fetch('https://httpbin.org/get', {
					headers: {'Date': 'overwrote-date'},
					signal: ctrl.signal,
				});
				const o = await response.json();
				return `Date: ${o.headers['Date']}`;
			} catch (error) {
				return error.toString();
			}
		},
		async acceptHost() {
			try {
				const ctrl = new AbortController();
				setTimeout(() => ctrl.abort(), 5000);
				const response = await fetch('https://httpbin.org/get', {
					headers: {'Host': 'overwrote-host.example.com'},
					signal: ctrl.signal,
				});
				const o = await response.json();
				return `Host: ${o.headers['Host']}`;
			} catch (error) {
				return error.toString();
			}
		},
		async acceptContentLength() {
			try {
				const ctrl = new AbortController();
				setTimeout(() => ctrl.abort(), 5000);
				const response = await fetch('https://httpbin.org/get', {
					headers: {'Content-Length': '2'},
					signal: ctrl.signal,
				});
				const o = await response.json();
				return `Content-Length: ${o.headers['Content-Length']}`;
			} catch (error) {
				return error.toString();
			}
		},
	},
};
export default tests;
