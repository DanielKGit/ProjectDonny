import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface Command {
    readonly name: string;
    readonly description: string;
    readonly data: SlashCommandBuilder;

    execute(interaction: CommandInteraction): Promise<void>;
}

// export abstract class Command {
//     private readonly name: string;
//     private readonly description: string;
//     protected readonly data: SlashCommandBuilder;


//     constructor(name: string, description: string, data?: SlashCommandBuilder) {
//         this.name = name;
//         this.description = description;
//         this.data = new SlashCommandBuilder()
//             .setName(this.name)
//             .setDescription(this.description);
//     }

//     public abstract execute(interaction: CommandInteraction);

//     public getName(): string { 
//         return this.name; 
//     }

//     public getData(): SlashCommandBuilder {
//         return this.data;
//     }

//     public getDescription(): string { 
//         return this.description;
//     }
// }

// export const command: Command = null;