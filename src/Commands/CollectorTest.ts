import { CommandInteraction, InteractionReplyOptions } from "discord.js";
import messages = require("./../config/messages.json");
import embedHandler = require("./../embedHandler");
import messageHandler = require("./../messageHandler");
import { SlashCommandBuilder } from "@discordjs/builders";

//This feature is not possible. Might look at it agian later
module.exports = {
    data: new SlashCommandBuilder()
        .setName("testcol")
        .setDescription("You can embed commands into messages"),
    async execute(interaction:CommandInteraction, options?:object):Promise<void> {
        const filter = m => m.content.includes('discord');
        const collector = interaction.channel.createMessageCollector({ filter, max: 3, maxProcessed: 6});

        interaction.reply("Started to listen");

        collector.on('collect', m => {
            console.log(`Collected ${m.content}`);
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });
    }
}   