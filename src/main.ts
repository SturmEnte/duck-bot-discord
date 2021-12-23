import "dotenv/config";
import "colors";
import { Client } from "discord.js";

import "./util/initEnv";

const client: Client = new Client({ intents: ["GUILDS"] });

client
	.login(process.env.TOKEN)
	.then(() => {
		console.log(`Logged in as ${client.user?.tag.cyan}`.green);
	})
	.catch((err) => {
		console.log(err);
		console.log("\nThe given bot token was invalid".red);
		process.exit(1);
	});
