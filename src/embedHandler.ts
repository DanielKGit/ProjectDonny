/*
 *Description: This script handles the creation and usage of embeds in servers. Also handles the main part of help which scraps the 
 all the commands for information.
 */

import { Collection, CommandInteraction } from "discord.js";
import embedss = require("./config/embeds.json");
import messages = require("./config/messages.json");
import fs = require("fs");
import path = require("path");

export class Embed {
    embedType:object;
    description:string;
    message:CommandInteraction;

    constructor(typeName:string, description:string, message:CommandInteraction) {
        this.embedType = embedss[typeName];
        this.description = (messages.error[description] == undefined) ?  description : messages.error[description];
        this.message = message;
        this.embedType["description"] = this.description;
    }

    public printEmbed():void {
        if(this.message.replied != true) {
            this.message.reply( { embeds: [this.embedType], ephemeral:true } )
                .catch( (err) => console.log(err));
        }
        else {
            this.message.followUp( { embeds: [this.embedType]} )
            .catch( (err) => console.log(err));
        }
    }

    public static createCustomEmbed(embedObj:object, message:CommandInteraction, ephemeralVal:boolean=true):void {
        if(message.replied != true) {
            message.reply( {embeds: [embedObj], ephemeral:ephemeralVal })
              .catch ( (err) => console.log(err)); 
        }
        else {
            message.followUp( {embeds: [embedObj] })
               .catch ( (err) => console.log(err)); 
        }
    }

}

export class InfoScraper {
    commands:Collection<string, any> = new Collection();
    description:string;
    name:string;

    constructor() {
        this.getCommands();
    }

    getCommands():void {
        const commandFiles = fs.readdirSync(path.resolve(__dirname, "commands")).filter(file => file.endsWith("js"));
    
        console.log(commandFiles);
        for(const file of commandFiles){
            const command = require(`./commands/${file}`);
            console.log(command);
            this.commands.set(command.name, command);
        }
    }

    explainCommand(nameOfCommand:string):string {
        let howTo:string;
        
        if(this.commands.has(nameOfCommand)) {    
            return this.commands.get(nameOfCommand).howTo;
        }
        else {
            return null;
        }


    }
}
