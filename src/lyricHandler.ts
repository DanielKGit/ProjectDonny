import { CommandInteraction, Interaction } from "discord.js";
import Genius = require("genius-lyrics");
import { ApiKey } from "./config/config.json";
import embedHandler = require("./embedHandler")
import { MessageOptions } from "./config/config.json";

export class LyricsHandler {
    readonly searchRequest: string;
    readonly client = new Genius.Client(process.env.GENUISTOKEN);
    readonly tts:boolean;
    results: Genius.Song[] | void;
    message: CommandInteraction;
    sizeOfBlock: number = 190;
    private songTitle: object = {
        color: [29,166,229],
        title:""
    };

    constructor(searchRequest: string, message: CommandInteraction, tts:boolean) {
        this.searchRequest = searchRequest;
        this.message = message;
        this.tts = tts;
        this.sizeOfBlock = (tts == true) ? 190 : 1990;
    }

    public async search(): Promise<void> {
        let error:boolean = false;
        this.results = await this.client.songs.search(this.searchRequest).then( (results) => { 
            let temp:Genius.Song[] = results;
            return temp;
        }).catch( (err) => {
            let embed = new embedHandler.Embed("warning", "proccessingError", this.message);
            embed.printEmbed();
            console.log(err);
            error = true;
        });
        

        if(error == false) {
            this.songTitle["title"] = this.results[0].fullTitle;
            this.searchLyrics(this.results as Genius.Song[]);
        } 
    }

    async searchLyrics(results: Genius.Song[]) {
        let error:boolean = false;
        let lyrics:string | void = await results[0].lyrics().then( (results) => {
            let temp:string = results;
            return temp;
        }).catch( (err) => {
            let embed = new embedHandler.Embed("warning", "proccessingError", this.message);
            console.log(err);
            embed.printEmbed();
            error = true;
        });
        if(error == false) this.cleanLyrics(lyrics as string);
    }

    cleanLyrics(lyrics:string): void {
        let cleanLyrics:string;

        //This removes all the [Verse 1], [Chorus], [Bridge], etc from the string
        cleanLyrics = lyrics.replace(/[[][a-zA-Z]{1,}[ ]{0,}[-]{0,}[a-zA-Z]{0,}[0-9]{0,}(])/gm, ' ');

        this.splitUpResult(cleanLyrics);
    }

    splitUpResult(cleanLyrics: string): void {
        let splitLyrics:string[] = [];
        let splitPoint:number;
        let remainderLyrics:string = cleanLyrics;

        while(remainderLyrics.length > this.sizeOfBlock) {
            splitPoint = remainderLyrics.lastIndexOf(' ', this.sizeOfBlock);
            splitLyrics.push(remainderLyrics.slice(0, splitPoint));
            remainderLyrics = remainderLyrics.substr(splitPoint);
        }

        splitLyrics.push(remainderLyrics);
        this.sendLyrics(splitLyrics);
    }

    sendLyrics(splitLyrics: string[]): void {
        embedHandler.Embed.createCustomEmbed(this.songTitle, this.message, false);
        for (let index = 0; index < splitLyrics.length; index++) {
            const lyric = splitLyrics[index].replace(/(\\n\\n)/gm, ' ').trim();
            MessageOptions.content = lyric;
            MessageOptions.tts = this.tts; 
            this.message.followUp(MessageOptions).catch ( (err) => console.log(err));
        }
    }
}