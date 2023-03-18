const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song from YouTube.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Searches for a song and plays it")
                .addStringOption(option =>
                    option.setName("searchterms").setDescription("search keywords").setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("Plays a playlist from YT")
                .addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Plays a single song from YT")
                .addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
        ),
    execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
        if (!interaction.member.voice.channel) return interaction.reply("Mày chưa vô kênh voice sao tao mở nhạc được");

        // Create a play queue for the server
        const queue = client.player.createQueue(interaction.guild)

        // Wait until you are connected to the channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        const embed = new EmbedBuilder()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")

            // Search for the song using the discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply("Không có kết quả!")

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** được cho vô danh sách BAY rồi nha`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })

        }
        else if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.reply(`Không có cái playlist nhạc nào zới cái link này ${url}`)

            // Add the tracks to the queue
            const playlist = result.tracks
            await queue.addTracks(playlist)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** được cho vô danh sách BAY rồi nha`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Duration: ${playlist.duration}` })
        }
        else if (interaction.options.getSubcommand() === "search") {

            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.editReply("Không có kết quả")

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTracks(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** được cho vô danh sách BAY rồi nha`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        }

        // Play the song
        if (!queue.playing) await queue.play()

        // Respond with the embed containing information about the player
        await interaction.reply({
            embeds: [embed]
        })
    }
}