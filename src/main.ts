import { Client, Intents, Collection, CommandInteraction, GuildMember, Interaction } from "discord.js";
import dotenv = require("dotenv");
import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v9'; 
import fs = require("fs");
import path = require("path");

import { generateDependencyReport } from '@discordjs/voice';

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const clientCommands = new Collection() as Collection<string,any>;

const clientID: string = process.env.CLIENTID;
const testGuildID: string = process.env.TESTGUILDID;

console.log(clientID);
console.log(process.env.TEST);

namespace CommandSetup {
    export const commands: object[] = [];
    const commandFiles: string[] = fs.readdirSync(path.resolve(__dirname, "Commands")).filter(file => file.endsWith("js"));
    
    for (const file of commandFiles) {
        const command: any = require(`./Commands/${file}`);
        commands.push(command.data.toJSON());
    
        clientCommands.set(command.data.name, command);
    }
}

namespace CommandRegistration {
    const rest: REST = new REST({ version: '9' }).setToken(process.env.DISCORDTOKEN);
    
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            console.log(CommandSetup.commands);
            await rest.put(
                Routes.applicationCommands(clientID),
                { body: CommandSetup.commands },
            );
            // await rest.put(
            //     Routes.applicationGuildCommands(clientID, testGuildID),
            //     { body: CommandSetup.commands },
            // );
    
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}


namespace DiscordEvents {
    client.once('ready', () => {
        let guildsPresent:number = client["guilds"].cache.size;
        console.log("Logged in as " + client.user.tag);
        console.log(client.user.tag + " is currently in " + guildsPresent + " out of 100 servers");
    });
    
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isSelectMenu()) console.log(interaction);
        
        if (!interaction.isCommand()) return;
        let tempMember:GuildMember = interaction.member as GuildMember;
        console.log("!." + tempMember.voice.channelId);
        const { commandName }: CommandInteraction = interaction;
 
        if (!clientCommands.has(commandName)) return;

        try {
            await clientCommands.get(commandName).execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });
    
    client.on("messageCreate", (message) => {
        console.log(message.guild.id);
    });
    
    client.login(process.env.DISCORDTOKEN);
}   