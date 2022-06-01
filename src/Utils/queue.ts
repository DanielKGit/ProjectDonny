import fs = require('fs');
import path = require("path");
import { hardSearch } from "./../config/config.json";
import { PlatformBase } from "./baseClass";

export type Entry = {
    platfrom: string,
    url: string, 
    songName: string,
    artistName: string,
    avatarTumbnail: string
    duration: number,
    isLive: boolean
}

export class queue {
    private queueArr: Array<Entry> = [];
    public readonly maxEntries: number = 1000;
    private availablePlatforms: Map<String, object>;
    private static readonly platformFilesLocation: string = "Platforms";
    private perferredPlatfrom:string = "local";

    constructor(maxEntries: number = null) {
        //Stop the queue from being less than 1 
        if (maxEntries != null || maxEntries < 1) {
            this.maxEntries = maxEntries
        }
        //Finds all available platforms in the Platforms folders
        this.availablePlatforms = this.getAllPlatforms();
    
        //If there is no file in the plaform folder then the bot will throw an error 
        if (this.availablePlatforms.size < 1) {
            this.throwError();
        }

        //Sets the defualt perferredPlatform to the first entry if local is not present
        if (!this.availablePlatforms.has("local")) {
            this.perferredPlatfrom = this.availablePlatforms.keys().next().value;
        }
    }

    
    private getAllPlatforms():Map<String, object> {
        let tempAvailablePlatforms: Map<String, object>;
        const paltfromFiles = fs.readdirSync(path.resolve(__dirname, queue.platformFilesLocation)).filter(file => file.endsWith("js"));
        
        for(const platfromFile of paltfromFiles) {
            const platformCode = require(`./${queue.platformFilesLocation}/${platfromFile}`);
            tempAvailablePlatforms.set(platformCode.platformName, platformCode);
        }   
        
        return tempAvailablePlatforms;
    }
    
    //The input can be anything must figure out a way to sort search requests and urls
    public add(userInput:string, usersPerferredPlatform:string=this.perferredPlatfrom, hardSearchSetting:boolean = hardSearch): boolean {
        const platformClass:object = this.availablePlatforms.get(usersPerferredPlatform)
        // @ts-ignore Typescript will throw an error saying platform does not exist on platformClass yet it does exists (Assuming module.exports.platform does exist). 
        const platformObject:PlatformBase = new platformClass.platform()
        const tempEntry: Entry = platformObject.processData(userInput);
        let newEntry: Entry;

        if(tempEntry == null && hardSearchSetting) {
            newEntry = this.checkAllOther(userInput, usersPerferredPlatform);
        }
        
        if (newEntry != null) {
            this.addNewEntry(newEntry);
        }
        return false;
    }
    
    private checkAllOther(userInput:string, usersPerferredPlatform:string): Entry {
        // platform[0] : platform name | platform[1] : platform object
        for (const platform of this.availablePlatforms.entries()) {
            if (platform[0] == usersPerferredPlatform) {
                //@ts-ignore
                const platformObject:PlatformBase = new platform[1].platform();
                const tempEntry: Entry = platformObject.processData(userInput);
                if (tempEntry != null) {
                    return tempEntry;
                }
            }
        }
        return null;
    }
    
    private addNewEntry(newEntry:Entry) {
        this.queueArr.concat(newEntry);
    }
    
    private throwError(): never {
        throw new Error("There are no available platforms in the plaforms folder\n" +
                        `Current platform folder is located at: ${__dirname}/${queue.platformFilesLocation}/`);
    }
    
    public set perfferredPlatform(platfrom:String) {
        
    }
}
