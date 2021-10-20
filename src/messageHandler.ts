import config = require("./config/config.json");
import { CommandInteraction, GuildMember, Snowflake } from "discord.js";
import embedHandler = require("./embedHandler");
import fs = require("fs");
import path = require("path");


export enum userRank {
    user = 0,
    moderator = 1,
    owner = 2
}

//This is the base class (This in now potentially obsolute. This might be removed later)
export class flagHandler {
    flags:string[];
    message:CommandInteraction;
    protected configObj:any = config;
    updatedSettingList:string[] = [];
    updateSetting = (setting:string, updateTo:string)=> "The " + setting + " has been updated to " + updateTo;
    readonly rank:number;

    constructor(flags:string[], message:CommandInteraction) {
        this.flags = flags;
        this.message = message;
        this.rank = this.checkPrivllages(message.member as GuildMember, message.guild.ownerId);
    }

    public start():void {
        for (let index = 0; index < this.flags.length; index++) {
            const currentFlag:string[] = this.filterFlag(this.flags[index]);
            this.setFlags(currentFlag);
        }

        if(this.finalChecks() == true) {
            let embed = new embedHandler.Embed("update", this.updatedSettingList.join("\n"), this.message);
            embed.printEmbed();
        }
    }

    //Overload this function in any command that deals with flags
    setFlags(currentFlag:string[]):void {
        switch (currentFlag[0]) {
            default: {
                let embed = new embedHandler.Embed("error", ("The flag \'" + currentFlag[0] + "\' does not exist"), this.message);
                embed.printEmbed();
                break;
            }
        }
    }

    checkPrivllages(member:GuildMember, ownerid:Snowflake):number {
        if(member.id == ownerid) {
            return userRank.owner;
        }
        else if(member.permissions.has("MANAGE_CHANNELS") == true){
            return userRank.moderator;
        }
        return userRank.user;
    }

    filterFlag(flag:string): string[] {
        return flag.slice(config.FlagPrefix.length).toLowerCase().split(':');
    }

    compareRanks(userRank:number, flagRank:number): boolean {
        if(userRank >= flagRank) {
            return true;
        }
        return false;
    }

    writeToConfig(obj:object, message:CommandInteraction):boolean {
        return dataHandler.writeToConfig(obj, message, "config.json");
    }

    //Final checks is where the final step in a flags execution is done. If any of them fail it will stop the embed update from being sent 
    finalChecks():boolean {
        if (this.updatedSettingList.length <= 0) return false;
        return true;
    }
}

//$alias (keyword) $reply -tts:true & $reply hello )
export class keywordExtractor {
    public static findKeyword(content:string, message:CommandInteraction): string {
        let keypharse:string[] = content.match(/([(]([a-zA-Z\d]{1}[\s]{0,}){0,32}[)])/g);
        if (keypharse == null) return null;
        if (keypharse.length > 1) new embedHandler.Embed("warning", "multipleKeypharse", message).printEmbed();
        return keypharse[0];
    }

}

export class dataHandler {
    public static writeToConfig(obj:object, message:CommandInteraction, configFile:string):boolean {
        try {
            let data:string = JSON.stringify(obj);

            fs.writeFileSync(path.resolve(__dirname, "config/" + configFile), data, "utf-8");
            console.log("The file has been written succesfully");
            return true;
        }
        catch (err) {
            new embedHandler.Embed("error", "updateFail", message).printEmbed();
            console.log(err);
        }
        return false;
    }
}