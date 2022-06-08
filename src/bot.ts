import { Client, Intents, Interaction } from 'discord.js';
import { CommandBuilder, CommandRegistrationOptions } from './commandBuilder'
import config from './config.json';
import { AudioPlayer } from './audioPlayer';

export class Bot {
    private readonly token: string;
    private readonly intents: number[];
    private readonly client: Client;
    private readonly commmandBuilder: CommandBuilder;
    private readonly clientID: string;
    private readonly guildID: string;
    private readonly audioPlayer: AudioPlayer;

    constructor() {
        this.intents = [Intents.FLAGS.GUILDS, 
                        Intents.FLAGS.GUILD_MESSAGES, 
                        Intents.FLAGS.DIRECT_MESSAGES, 
                        Intents.FLAGS.GUILD_VOICE_STATES];
        this.token = config.token;
        this.clientID = config.clientID;
        this.guildID = config.guildID;

        this.client = new Client({intents: this.intents});
        this.commmandBuilder = new CommandBuilder();

        let options: CommandRegistrationOptions = {global: true, token: this.token, guildID: this.guildID, clientID: this.clientID};
        this.commmandBuilder.registerCommands(this.client, options);

        this.audioPlayer = new AudioPlayer();

        this.discordEvents();
    }

    private discordEvents(): void {
        this.client.once('ready', () => {
            let guildsPresent:number = this.client["guilds"].cache.size;
            console.log("Logged in as " + this.client.user.tag);
            console.log(this.client.user.tag + " is currently in " + guildsPresent + " out of 100 servers");
        });

        this.client.on('interactionCreate', async (interaction: Interaction) => {
            this.executeCommand(interaction);
        });

        this.client.on("messageCreate", (message) => {
            console.log(message.guild.id);
        });

        this.client.login(this.token);
    }

    private async executeCommand(interaction: Interaction): Promise<void> {
        if (interaction.isCommand()) {
            const commandName: string = interaction.commandName;
            if (this.commmandBuilder.findCommand(commandName)) {
                await this.commmandBuilder.executeCommand(commandName, interaction);
            }

        }
    }

    public getAudioPlayer() {
        return this.audioPlayer;
    }
}