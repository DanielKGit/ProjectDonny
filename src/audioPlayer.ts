import { AudioResource, createAudioResource, createAudioPlayer, joinVoiceChannel, VoiceConnection, AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
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
        this.audioPlayer = createAudioPlayer();
        this.timeout = new Timeout(1000, 360);
        this.timerEventHandler();
        this.audioPlayerEventHandler();
    }

    public async play(interaction: CommandInteraction): Promise<void> {
        this.createPlayer(interaction);
    }

    private createPlayer(interaction: CommandInteraction): void {
        // Have to cast member as Guildmember since it can also be APIGuildmember
        const guildMember: GuildMember = interaction.member as GuildMember;

        if(this.userIsInVoiceChannel(guildMember)) {
            this.voiceConnection = joinVoiceChannel( {
                channelId: guildMember.voice.channel.id,
                guildId: guildMember.voice.channel.guild.id,
                selfDeaf: true,
                adapterCreator: guildMember.voice.channel.guild.voiceAdapterCreator
            })
            this.voiceConnection.subscribe(this.audioPlayer);
            this.playSong(interaction);
        }
    }

    private async playSong(interaction: CommandInteraction) {
        if (this.audioPlayer.state.status == AudioPlayerStatus.Idle) {
            const nextSong = interaction.options.getString("song");
            const audioResource:AudioResource = createAudioResource(await ytdl(nextSong, {filter: format => format.audioBitrate === 48, liveBuffer: 20000 }));

            this.audioPlayer.play(audioResource);
        }
    }

    private userIsInVoiceChannel(user: GuildMember): boolean {
        //Check if the user who called the command is in a voice channel
        return (user.voice.channelId != null) ? true : false;
    }

    private timerEventHandler() {
        this.timeout.eventEmitter.on("finished", () => {
            this.endConnection();
        });
    }

    private audioPlayerEventHandler() {
        this.audioPlayer.on("stateChange", (oldState: { status: any; resource: any; }, newState: { status: any; resource: any; }) => {
            if(oldState.status == AudioPlayerStatus.Playing && newState.status == AudioPlayerStatus.Idle) {
                this.startTimout();
            }
        })
    }

    private endConnection() {
        this.audioPlayer.stop();
        this.voiceConnection.destroy();
    }

    private startTimout(): void {
        this.timeout.start();
    }
}