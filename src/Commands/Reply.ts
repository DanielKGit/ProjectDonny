import { CommandInteraction, InteractionReplyOptions } from "discord.js";
import messages = require("./../config/messages.json");
import embedHandler = require("./../embedHandler");
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reply")
        .setDescription("Replies to messages with a predefined response")
        .addStringOption(option => option
            .setName("response")
            .setDescription("This will return a response to the user from the database")
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("tts")
            .setDescription("This will use text to speech for the reply")),
    async execute(interaction:CommandInteraction, options?:object):Promise<void> {
        const response:string = messages.responses[await interaction.options.getString("response")];
        const tts:boolean = await interaction.options.getBoolean("tts");

        const reply:InteractionReplyOptions = {
            content: response,
            tts: tts
        }

        if (response != undefined) {
            //Sending it to the channel instead will hide the user who triggered the command
            await interaction.reply(reply);
        }
        else {
            let embed = new embedHandler.Embed("error", "responseFail", interaction);
            embed.printEmbed();
        }
    }
}   

