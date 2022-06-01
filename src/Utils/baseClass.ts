import { Entry } from "./queue";

export abstract class PlatformBase {
    public abstract processData(userInput:string):Entry;

    public abstract playSong(nextSong:Entry);
}