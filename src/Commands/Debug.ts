import { CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Embed } from "../embedHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("debug")
        .setDescription("Searches for music and plays it"),
    async execute(interaction:CommandInteraction):Promise<void> {
    }
}   

