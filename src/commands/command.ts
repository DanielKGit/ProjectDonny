import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export abstract class Command {
    private readonly data: SlashCommandBuilder;
    private readonly name: string;
    private readonly description: string;


    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
    }

    public abstract execute(interaction: CommandInteraction);

    public getName(): string { 
        return this.name; 
    }

    public getData(): SlashCommandBuilder {
        return this.data;
    }

    public getDescription(): string { 
        return this.description;
    }
}

export const command: Command = null;