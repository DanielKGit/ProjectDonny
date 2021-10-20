import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection, AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, GuildManager, GuildMember, Interaction } from "discord.js";
import { EventEmitter } from "events";
import { Timeout } from "./Utils/timeout";
import ytsr from "ytsr";
import { url } from "inspector";
import ytdl from "ytdl-core";

export namespace AudioController {
    export const eventEmitter = new EventEmitter();
    let audioPlayer:AudioPlayer;
    let voiceConnection:VoiceConnection;
    const timer = new Timeout(1000, 360);
    let queue:string[] = [];
    let currentChannel:string = " ";

    eventEmitter.on("play", async (interaction:CommandInteraction) => {
        const tempMember = interaction.member as GuildMember;
        if(tempMember.voice.channelId != null) {
            //Always stop the timer when a new command begins 
            timer.stop();
            //When the bot is started for the first time the voiceConnection state is undefined
            if (voiceConnection != undefined) {
                /*The whole point of this is to stop the bot from restarting it self every time the user enters a song request.
                 *If the bot and the user is in serprate channel, then the bot will switch over to the channel the user is in.
                 *If the user enter to play a song while the bot is still in the same channel then the bot will just add a song to the queue
                 *If the bot is destoyed then it will be able to join the same channel as before
                 */ 
                if (voiceConnection.state.status == "destroyed" || tempMember.voice.channel.id != currentChannel) {
                    createPlayer(tempMember, interaction);
                    console.log("Created a new player");
                }
            }
            else {
                createPlayer(tempMember, interaction);
                console.log("Created a new player");
            }

            await checkVaildURL(interaction.options.getString("song"));
            await playSong();

            audioPlayer.removeAllListeners(AudioPlayerStatus.Idle);
            audioPlayer.on(AudioPlayerStatus.Idle, () => {
                playSong();
            });
            
            audioPlayer.removeAllListeners('error');
            audioPlayer.on('error', error => {
                console.error(error);
            });

            voiceConnection.removeAllListeners(VoiceConnectionStatus.Disconnected);
            voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
                audioPlayer.stop();
                voiceConnection.destroy();
            });

        }
        else {
            interaction.reply({content:"You must join a voice channel to summon the bot", ephemeral:true});
        }
    });

    eventEmitter.on("stop", (interaction:CommandInteraction) => {
        const tempMember = interaction.member as GuildMember;
        if(tempMember.voice.channelId != null) {
            if(voiceConnection.joinConfig.channelId == tempMember.voice.channel.id) {
                if(timer.timerStatus || audioPlayer.state.status == "playing") {
                    console.log(audioPlayer.state, voiceConnection.state);
                    voiceConnection.destroy();
                    console.log(audioPlayer.state, voiceConnection.state);
                    timer.stop();
                    interaction.reply("The bot has left the voice channel");
                }
                else {
                    interaction.reply("The bot is not in channel");
                }
            }
            else {
                interaction.reply({content:"You must join the same voice channel to stop the bot", ephemeral:true});
            }
        }
        else {
            interaction.reply({content:"You must join the same voice channel to stop the bot", ephemeral:true});
        }
    })

    //Check if the request the user placed is a url or a search title
    async function checkVaildURL(url:string):Promise<void> {
        if (url.search(/http[s]{0,}:\/\/www.youtube.com\/watch/g) != -1) {
            await addToQueue(url);
        }
        else {
            await searchForVideo(url);
        }
    }

    async function searchForVideo(request:string):Promise<void> {
        const searchResult:ytsr.Item = await ytsr(request).then((result) => {
            return result.items[0];  
        } );
        console.log(searchResult);
        await addToQueue(searchResult["url"]);
    }

    async function addToQueue(item:string):Promise<void> {
        await queue.push(item);
    }

    function createPlayer(tempMember:GuildMember, interaction:CommandInteraction):void {
        voiceConnection = joinVoiceChannel( {
            channelId: tempMember.voice.channel.id,
            guildId: tempMember.voice.channel.guild.id,
            selfDeaf: true,
            adapterCreator: tempMember.voice.channel.guild.voiceAdapterCreator
        })
        interaction.reply("Joined the " + tempMember.voice.channel.name + " channel");
        audioPlayer = createAudioPlayer();
        currentChannel = tempMember.voice.channel.id;
        voiceConnection.subscribe(audioPlayer);
    }

    function readOutQueue(tempQueue:string, interaction:CommandInteraction):void {
        console.log(tempQueue);
        interaction.reply(tempQueue);
    }

    async function playSong():Promise<void> {
        console.log(audioPlayer.state.status);
        if (audioPlayer.state.status == AudioPlayerStatus.Idle) {
            const audioResource:AudioResource = (queue.length > 0) ? createAudioResource(await ytdl(queue.shift(), {filter: format => format.audioBitrate === 48 })) : null;
            
            console.log(audioResource);
            if (audioResource != null) {
                audioPlayer.play(audioResource);
                setTimeout(() => console.log("Finished song"), audioResource.playbackDuration);
            }
            else {
                //Removes all the listeners to prevent a memory leak
                timer.eventEmitter.removeAllListeners("finished");
                timer.start();
                timer.eventEmitter.on("finished", () => {
                    audioPlayer.stop();
                    voiceConnection.destroy();
                });
            }
        }
    }


}