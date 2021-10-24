import { CommandInteraction, GuildManager, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioController } from "../voiceHandler";
import { Embed } from "../embedHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the queue for the bot"),
    async execute(interaction:CommandInteraction):Promise<void> {
        AudioController.readOutQueue(interaction);
    }
}   

