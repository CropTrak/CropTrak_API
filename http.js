import fetch from 'node-fetch';
import cryptoJS from 'crypto-js';
import { inspect } from 'util';

export default async function http(options) {
	if (!options) {
		throw Error('http options must be defined');
    }
	let sendTime = new Date().toISOString()
	let bodySig;
	options.method = options.method ? options.method : 'GET';
	if (options.method == 'GET') {
		bodySig = sendTime + options.path;
	} else {
		bodySig = sendTime + options.body;
	}
	let hash = cryptoJS.HmacSHA256(bodySig, options.secret);
	let base64 = hash.toString(cryptoJS.enc.Base64);
	let authHeader = "CropTrak " + options.clientId + ":" + base64;

	if (options.debug) {
		console.log(`${options.method} ${options.base_url}${options.path}`);
		console.log(`${authHeader}`);
		console.log(`${hash} ${base64}`);
	}
	let params = {
		method: options.method,
		headers: {
			'Authorization': authHeader,
			'Content-Type': 'application/json',
			'x-api-timestamp': sendTime
		}
	}
	if (options.method == 'POST') {
		params.body = options.body;
	}
	if (options.debug == true) {
		console.log(params);
	}
	if (options.debug == true && options.body) {
		console.log(inspect(options.body, { compact: false, depth: 5, breakLength: 80 }));
	}
	let response = await fetch(`${options.base_url}${options.path}`, params);
	let status = response.status;
	let statusTest = response.statusText;

	if (status == 200) {
		response = await response.json();
	} else {
		response = await response.text();
		if (options.debug) {
			console.log(status, statusTest);
        }
	}
	return response;
}