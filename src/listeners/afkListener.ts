import { Client, GuildMember, VoiceState } from "discord.js";
import { secondsToMinutes, secondsToMilliseconds } from "../util/timeConverter";

export default function (client: Client) {
	client.on("voiceStateUpdate", voiceStateUpdate);
}

const afk: Map<string, void> = new Map<string, void>();

function voiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
	// Check if the guild has an afkChannel
	if (!newState.guild.afkChannel) {
		if (afk.has(String(newState.member?.id))) afk.delete(String(newState.member?.id));
		return;
	}

	// Check if the user is still afk and remove the user from the map map if don't
	if (
		afk.has(String(newState.member?.id)) === true &&
		newState.selfDeaf === false &&
		newState.selfMute === false
	) {
		afk.delete(String(newState.member?.id));
	}

	// Check if the user is afk and create a
	if (
		afk.has(String(newState.member?.id)) === false &&
		newState.selfDeaf === true &&
		newState.selfMute === true
	) {
		newState.member?.send(
			"You will be moved to the afk channel in " +
				secondsToMinutes(newState.guild.afkTimeout) +
				" Minutes unless you unmute your self"
		);

		setTimeout(async () => {
			const member: GuildMember | undefined = await newState.member?.fetch(true);

			// Check if the guild still has an afk channel and if the member is connected to a voice channel
			if (!member?.guild.afkChannel || !member.voice.channel) return;

			// Check if the member is still afk and if yes adds the user to the afk map, sends the user a message and moves the user to the afk channel
			if (member?.voice.selfDeaf === true && member.voice.selfMute === true) {
				afk.set(String(newState.member?.id));
				member.voice.setChannel(member.guild.afkChannel);
				member.send("You where moved into the afk channel because you where muted to long");
			}
		}, secondsToMilliseconds(newState.guild.afkTimeout));
	}

	// Move the user back to the afk channel if the user is afk and leaves it
	if (afk.has(String(newState.member?.id)) && newState.channelId !== newState.guild.afkChannelId) {
		newState.setChannel(newState.guild.afkChannel, "User is still afk");
		newState.member?.send("You're not allowed to leave the afk channel as long as you're muted");
	}
}
