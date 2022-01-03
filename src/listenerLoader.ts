import "colors";
import fs from "fs";
import { join } from "path";
import { Client } from "discord.js";

const PREFIX = "[".grey + "Listener Loader".blue + "] ".grey;

export default async function (path: string, client: Client) {
	const files = fs.readdirSync(path);
	for (let i = 0; i < files.length; i++) {
		try {
			let listener = require(join(path, files[i]));
			listener.default(client);
			console.log(PREFIX, "Successfully loaded listener with file name ", files[i]);
		} catch (err) {
			console.error(err);
			console.log(PREFIX, "Error while loading listener with file name ", files[i]);
		}
	}
}
