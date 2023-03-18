const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick the bot from the channel."),
	execute: async ({ client, interaction }) => {

        // Get the current queue
		const queue = client.player.getQueue(interaction.guildId);

		if (!queue)
		{
			await interaction.reply("Không có bài nào hết ba");
			return;
		}

        // Deletes all the songs from the queue and exits the channel
		queue.destroy();

        await interaction.reply("Anh đang bay mà mấy em!");
	},
}