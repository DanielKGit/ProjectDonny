import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface Command {
    readonly name: string;
    readonly description: string;
    readonly data: SlashCommandBuilder;

    execute(interaction: CommandInteraction): Promise<void>;
}