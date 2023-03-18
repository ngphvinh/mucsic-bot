const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId);

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply("Không có bài nào hết ba");
			return;
		}

        // Pause the current song
		queue.setPaused(true);

        await interaction.reply("Đang choáy mà đm!");
	},
}