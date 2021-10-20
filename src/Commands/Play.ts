import { CommandInteraction, GuildManager, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { AudioController } from "../voiceHandler";
import { Embed } from "../embedHandler";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Searches for music and plays it")
        .addStringOption(option => option
            .setName("song")
            .setDescription("Pass a URL for the song")
            .setRequired(true)),
    async execute(interaction:CommandInteraction):Promise<void> {
        const wait = require('util').promisify(setTimeout);
        const songRequest:string = await interaction.options.getString("song");
        const tempMember = interaction.member as GuildMember

        AudioController.eventEmitter.emit("play", interaction);
    }
}   

