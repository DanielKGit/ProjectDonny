import { AudioResource, createAudioResource, joinVoiceChannel, VoiceConnection, AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, GuildManager, GuildMember, Interaction, MessageEmbed } from "discord.js";
import dsVoice from "@discordjs/voice";
import ytsr from "ytsr";
import ytdl from "ytdl-core";
import { Timeout } from "./Utils/timeout";

export class AudioPlayer {
    private readonly audioPlayer: dsVoice.AudioPlayer;
    private voiceConnection: VoiceConnection;
    private readonly timeout: Timeout;

    constructor() {
        this.timeout = new Timeout(1000, 360);
        this.audioPlayer = dsVoice.createAudioPlayer();
        this.setupTimerEvents();
    }

    public async play(interaction: CommandInteraction): Promise<void> {
        this.createPlayer(interaction);
    }

    private createPlayer(interaction: CommandInteraction): void {
        // Have to cast member as Guildmember since it can also be APIGuildmember
        const guildMember: GuildMember = interaction.member as GuildMember;

        if(!this.userIsInVoiceChannel(guildMember)) {
            this.voiceConnection = joinVoiceChannel( {
                channelId: guildMember.voice.channel.id,
                guildId: guildMember.voice.channel.guild.id,
                selfDeaf: true,
                adapterCreator: guildMember.voice.channel.guild.voiceAdapterCreator
            })
            this.voiceConnection.subscribe(this.audioPlayer);

            this.startTimout();
        }
    }

    private userIsInVoiceChannel(user: GuildMember): boolean {
        //Check if the user who called the command is in a voice channel
        return (user.voice.channelId != null) ? true : false;
    }

    private setupTimerEvents() {
        this.timeout.eventEmitter.on("finished", () => {
            this.endConnection();
        });
    }

    private endConnection() {
        this.audioPlayer.stop();
        this.voiceConnection.destroy();
    }

    private startTimout(): void {
        this.timeout.start();
    }
}