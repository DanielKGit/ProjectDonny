import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageSelectMenu } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, options?) {
		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('select')
				.setPlaceholder('Nothing selected')
				.setMinValues(2)
				.setMaxValues(3)
				.addOptions([
					{
						label: 'Select me',
						description: 'This is a description',
						value: 'first_option',
					},
					{
						label: 'You can select me too',
						description: 'This is also a description',
						value: 'second_option',
					},
					{
						label: 'I am also an option',
						description: 'This is a description as well',
						value: 'third_option',
					},
				]),
		);

		await interaction.reply({ content: 'Pong!', components: [row] });
	},
};
