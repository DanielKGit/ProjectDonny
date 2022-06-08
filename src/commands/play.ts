import { CommandInteraction } from "discord.js";
import { Command } from "./command";
import { donnyBot } from "./../main";

export class Hello extends Command {
    constructor(name: string, description: string) {
        super(name, description);
    }

    public async execute(interaction: CommandInteraction) {
        const player = donnyBot.getAudioPlayer();
        player.play(interaction);
    }
}

const name: string = "play";
const description: string = "Play sounds with this command";
export const command: Hello = new Hello(name, description);