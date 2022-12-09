/*
 * streamer: Creates a .mjpeg stream by capturing a still image over http(s).
 *
 * Written by Aaron Blakely <aaron@ephasic.org>
 * Copyright 2022 (C) Ephasic Software
*/

import {readFileSync} from 'fs';
import {createServer} from 'http';
import {EventEmitter} from 'events';
import fetch from "node-fetch";


const streams = JSON.parse(readFileSync("./streams.json"));

async function fetchStill(url) {
	const response = await fetch(url);
	return await response.buffer();
}

const emitter = new EventEmitter();
const server = createServer((req, res) => {

	if (streams[req.url]) {
		res.writeHead(200, {
			'Cache-Control': 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0',
			Pragma: 'no-cache',
			Connection: 'close',
			'Content-Type': 'multipart/x-mixed-replace; boundary=--totalmjpeg'
		});

		const writeFrame = () => {
			const buffer = fetchStill(streams[req.url]); 

			buffer.then(function(bin) {
				console.log(`sending frame of stream ${streams[req.url]} to ${req.connection.remoteAddress}/${req.url}`)

				res.write(`--totalmjpeg\nContent-Type: image/jpeg\nContent-length: ${bin.length}\n\n`);
				res.write(bin, 'binary');
			});
		};

		writeFrame();
		emitter.addListener('frame', writeFrame);
		res.addListener('close', () => {
			emitter.removeListener('frame', writeFrame);
		});
	} else {
		res.end("HTTP/1.1 404 file not found\r\n\r\n");
	}
});
server.listen(typeof streams?._listen_port_ !== "undefined" ? streams._listen_port_ : 8000);


setInterval(() => {
	emitter.emit('frame');
}, typeof streams?._pol_interval_ !== "undefined" ? streams._pol_interval_ : 500);
