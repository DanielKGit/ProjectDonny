import { CommandInteraction, InteractionReplyOptions } from "discord.js";
import messages = require("./../config/messages.json");
import embedHandler = require("./../embedHandler");
import messageHandler = require("./../messageHandler");
import { SlashCommandBuilder } from "@discordjs/builders";

//This feature is not possible. Might look at it agian later
//You know what, this feature is being canned. Its serves no purpose and this bot is taking too long to develop.
//TODO remove this eventually
//(NAMEOFCOMMAND) option1:"INPUT" + option2:"INPUT && ()"
module.exports = {
    data: new SlashCommandBuilder()
        .setName("alias")
        .setDescription("You can chain commands and add an alias to them")
        .addStringOption(option => option
            .setName("keypharse")
            .setDescription("The pharse that will trigger the alias")
            .setRequired(true))
        .addStringOption(option => option
            .setName("alias")
            .setDescription("Place the commands here")
            .setRequired(true)),
    async execute(interaction:CommandInteraction, options?:object):Promise<void> {
        const content:string = await interaction.options.getString("alias");
        const commandArgs = content.split("&");

        if (content != undefined) {
            await interaction.reply(content);
            console.log(commandArgs);
        }
        else {
            let embed = new embedHandler.Embed("error", "responseFail", interaction);
            embed.printEmbed();
        }

    }
}   