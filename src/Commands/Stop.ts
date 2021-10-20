import { CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioController } from "../voiceHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("searches r music and plays it"),
    async execute(interaction:CommandInteraction):Promise<void> {
        AudioController.eventEmitter.emit("stop", interaction);
    }
}   

