import { CommandInteraction } from "discord.js";
import lyricsHandler = require("./../lyricHandler");
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Finds lyrics for a song")
        .addStringOption(option => option
            .setName("song_name")
            .setDescription("This will search for the lyrics of the song")
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("tts")
            .setDescription("This will use text to speech for the lyrics")),
    async execute(interaction: CommandInteraction, options?:object) {
        const search:string = await interaction.options.getString("song_name");
        const tts:boolean = await interaction.options.getBoolean("tts");

        const lyrics = new lyricsHandler.LyricsHandler(search, interaction, tts);
        lyrics.search(); 
    }
}
