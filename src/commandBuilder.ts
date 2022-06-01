import { Command } from "./commands/command";
import fs from "fs";
import path from "path";
import { Client, Collection, CommandInteraction, Interaction } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v9'; 

export type CommandRegistrationOptions = {
    global: boolean;
    token: string;
    clientID: string;
    guildID: string;
}

export class CommandBuilder {
    private readonly commands: Collection<string, Command>;
    private readonly slashCommands: object[];

    constructor() {
        this.commands = new Collection<string, Command>();
        this.slashCommands = [];
        this.createCommands();
    }

    public createCommands(): void {
        for(const file of this.gatherCommandFiles()) {
            let commandObject: any = require(`./commands/${file}`)
            let tempCommand: Command = commandObject.command;
            console.log(commandObject);
            if (file != "command.js") {
                this.commands.set(tempCommand.getName(), tempCommand);
                this.slashCommands.push(tempCommand.getData().toJSON());
            }
        }
    }

    private gatherCommandFiles(): string[] {
        return fs.readdirSync(path.resolve(__dirname, "commands")).filter(file => file.endsWith("js"));
    }

    public registerCommands(client: Client, options: CommandRegistrationOptions): void {
        const rest: REST = new REST({ version: '9' }).setToken(options.token);

        (async () => {
            try {
                console.log("Started refreshing application (/) commands");

                if(options.global) {
                    await rest.put(
                        Routes.applicationCommands(options.clientID),
                        { body: this.slashCommands },
                    );
                }
                else {
                    await rest.put(
                        Routes.applicationGuildCommands(options.clientID, options.guildID),
                        { body: this.slashCommands },
                    );
                }

                console.log("Finished refreshing application (/) commands");
                console.log("The following commands are available");
                for(const command of this.commands) {
                    console.log(command[0]);
                }
            }
            catch (err) {
                console.log(err);
            }
        })();
    }

    public findCommand(commandName: string): boolean {
        return this.commands.has(commandName)
    }

    public async executeCommand(commandName: string, interaction: CommandInteraction): Promise<void> {
        try {
            await this.commands.get(commandName).execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}