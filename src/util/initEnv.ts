import "colors";

// Checks all environment variables and reacts to their values or replaces them with their default values
export default function () {
	// Bot Token
	if (typeof process.env.TOKEN !== "string") {
		console.log(
			"No bot token was specified. You can see the environment variable for the bot token inside the README.md in the section 'Environment Variables'"
				.red
		);
		process.exit(1);
	}
}
