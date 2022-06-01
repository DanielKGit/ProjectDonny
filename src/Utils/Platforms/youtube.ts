

import { Entry } from "../queue";
import {PlatformBase} from "../baseClass";
import config from "./../../config/config.json";

export class Youtube extends PlatformBase {
    public readonly musicFolderLoc = config.SoundFolderLoc;

    constructor() {
        super();
    }

    processData(userInput:string): Entry {
        return;
    }
    
    private checkIfYoutubeWatchLink(input:string): Entry  {
        return null;
    }
    
    private checkIfYoutubePlaylistLink(input:string): Entry {
        return null;
    }
    
    // protected findSong(input:string, perferredPlatfrom: SupportedPlatfroms = SupportedPlatfroms.youtube): Entry {
    //     let newEntry: Entry  = null;
    //     switch (perferredPlatfrom) {
    //         case SupportedPlatfroms.youtube: {
    //             newEntry = this.findYoutubeSong(input);
    //             break;
    //         }
    //         default: {
    //             newEntry = null;
    //             break;
    //         }
    //     }            
    
    //     //This will go through the remaining support platfroms but skip the perferred platform and search throught them
    //     if (newEntry == null) {
    //         if (perferredPlatfrom != SupportedPlatfroms.youtube) {
    //             newEntry = this.findYoutubeSong(input);
    //             if (newEntry != null) return newEntry;
    //         }
    //     }
    
    //     return newEntry;
    // }
    
    private findYoutubeSong(input:string): Entry {
        return null;
    }
    
    private checkURL(params:void) {
        
    }

    playSong() {

    }
}

module.exports.platformName = "youtube"
module.exports.platform = Youtube;