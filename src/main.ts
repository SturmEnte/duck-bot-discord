import "dotenv/config";
import "colors";
import { Client } from "discord.js";
import { join } from "path";

import "./util/initEnv";
import listenerLoader from "./listenerLoader";

const client: Client = new Client({ intents: ["GUILDS", "GUILD_VOICE_STATES"] });
listenerLoader(join(__dirname, "listeners"), client);

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
