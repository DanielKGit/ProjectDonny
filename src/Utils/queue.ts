import ytsr from "ytsr";

export type Entry = {
    platfrom: string,
    url: string, 
    songName: string,
    artistName: string,
    avatarTumbnail: string
    duration: number,
    isLive: boolean
}

export enum SupportedPlatfroms {
    youtube,
}

export class queue {
    private queueArr: Array<Entry> = [];
    public readonly maxEntries: number = 1000;
    private perferredPlatform: SupportedPlatfroms = SupportedPlatfroms.youtube;

    constructor(maxEntries: number = null) {
        //Stop the queue from being less than 1 
        if (maxEntries != null || maxEntries < 1) {
            this.maxEntries = maxEntries
        }
    }

    //The input can be anything must figure out a way to sort search requests and urls
    public add(userInput:string): boolean {
        let newEntry: Entry  = this.checkIfYoutubeWatchLink(userInput);
        if (newEntry == null) newEntry = this.checkIfYoutubePlaylistLink(userInput);
        if (newEntry == null) newEntry = this.findSong(userInput);

        return false;
    }

    private addNewEntry(params:void) {
        
    }

    private checkIfYoutubeWatchLink(input:string): Entry  {
        return null;
    }

    private checkIfYoutubePlaylistLink(input:string): Entry {
        return null;
    }

    protected findSong(input:string, perferredPlatfrom: SupportedPlatfroms = SupportedPlatfroms.youtube): Entry {
        let newEntry: Entry  = null;
        switch (perferredPlatfrom) {
            case SupportedPlatfroms.youtube: {
                newEntry = this.findYoutubeSong(input);
                break;
            }
            default: {
                newEntry = null;
                break;
            }
        }            
    
        //This will go through the remaining support platfroms and search throught them
        if (newEntry == null) {
            if (perferredPlatfrom != SupportedPlatfroms.youtube) {
                newEntry = this.findYoutubeSong(input);
                if (newEntry != null) return newEntry;
            }
        }

        return newEntry;
    }

    private findYoutubeSong(input:string): Entry {
        return null;
    }

    private checkURL(params:void) {
        
    }

    public set perfferredPlatform(platfrom:String) {
        
    }
}
