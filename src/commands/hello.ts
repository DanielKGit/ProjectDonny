import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "./command";

export class Hello implements Command {
    readonly name: string;
    readonly description: string;
    readonly data;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description);
    }   

    public async execute(interaction: CommandInteraction) {
        return await interaction.reply("Hello world");
    }
}

const name: string = "hello";
const description: string = "This is a command that sends out a hello";
export const command: Hello = new Hello(name, description);