import { CommandInteraction } from "discord.js";
import { Command } from "./command";

export class Hello extends Command {
    constructor(name: string, description: string) {
        super(name, description);
    }

    public async execute(interaction: CommandInteraction) {
        return await interaction.reply("Hello world");
    }
}

const name: string = "hello";
const description: string = "This is a command that sends out a hello";
export const command: Hello = new Hello(name, description);