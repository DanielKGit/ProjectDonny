import { Entry } from "../queue";
import {PlatformBase} from "../baseClass";
import config from "./../../config/config.json";
import fs = require('fs');
import path = require("path");

class Local extends PlatformBase {
    public readonly musicFolderLoc = config.SoundFolderLoc;

    constructor() {
        super();
    }

    processData(userInput:string): Entry {
        const musicFiles = fs.readdirSync(path.resolve(__dirname, config.SoundFolderLoc)).filter(file => file.endsWith("js"));
        const newEntry: Entry = null;

        for (const musicFile of musicFiles) {
            const parsedFile = path.parse(path.resolve(__dirname,musicFile))
            if (parsedFile.name = userInput) {
                newEntry.platfrom = "local";
                newEntry.url = parsedFile.base;
                newEntry.isLive = false;
                newEntry.songName = parsedFile.name;
            }
        }

        return newEntry;
    }
    
    playSong() {

    }
}


module.exports.platformName = "local"
module.exports.platform = Local;