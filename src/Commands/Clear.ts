import { CommandInteraction, GuildManager, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioController } from "../voiceHandler";
import { Embed } from "../embedHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears the queue for the bot"),
    async execute(interaction:CommandInteraction):Promise<void> {
        AudioController.clearOutQueue();
        interaction.reply("The queue has been cleared");
    }
}   

