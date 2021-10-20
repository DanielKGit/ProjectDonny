import { CommandInteraction, Message, Options } from "discord.js";
import messages = require("./../config/messages.json");
import fs = require("fs");
import path = require("path");
import embedHandler = require("./../embedHandler");
import { dataHandler } from "./../messageHandler";
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Adds new responses for the bot to say")
        .addStringOption(option => option
            .setName("keyword")
            .setDescription("The keyphrase to trigger the response")
            .setRequired(true))
        .addStringOption(option => option
            .setName("response")
            .setDescription("This is what the bot will say in response to the keypharse")
            .setRequired(true)),

    async execute(interaction: CommandInteraction, options?:object): Promise<void> {
        const option:options = await configureCommand(interaction, options);
        let responses:object = messages.responses;
        responses[option.keyword] = option.response;
        if(dataHandler.writeToConfig(responses, interaction, "messages.json") == true) {
            const embed = new embedHandler.Embed("update", "The reponse list has been updated",  interaction).printEmbed();
        }
    }
}

export type options = {
    keyword:string;
    response:string;
}

function configureCommand(interaction:CommandInteraction, options?:object):options {
    let optionsTmp:options;
    if(options != undefined) {
        //Get options from the user defined object
        optionsTmp.keyword = options["keyword"];
        optionsTmp.response = options["response"];
    }
    else {
        //Get options from the interaction
        optionsTmp.keyword = interaction.options.getString("keyword");
        optionsTmp.response = interaction.options.getString("response");
    }

    return optionsTmp;
}