import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "./command";
import { donnyBot } from "./../main";

export class Hello implements Command {
    readonly name: string;
    readonly description: string;
    readonly data;


    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
            .addStringOption(option => option
                .setName("song")
                .setDescription("Pass a url for the song")
                .setRequired(true));
    }

    public async execute(interaction: CommandInteraction) {
        const player = donnyBot.getAudioPlayer();
        player.play(interaction);
        await interaction.reply("Joined");
    }
}

const name: string = "play";
const description: string = "Play sounds with this command";
export const command: Hello = new Hello(name, description);