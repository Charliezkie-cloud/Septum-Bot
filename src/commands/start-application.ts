import {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder
} from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('startapplication')
        .addChannelOption((option) =>
            option
                .setName('target')
                .setDescription('The channel where applications are sent.')
                .setRequired(true)
        )
        .setDescription('Start application.'),
    async execute(interaction): Promise<void> {
        const target = interaction.options.getChannel('target')

        const newApp = new ButtonBuilder()
            .setCustomId(`newAppButton:${target ? target.id : 'null'}`)
            .setLabel('New Application')
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(newApp)

        const imageEmbed = new EmbedBuilder()
            .setColor(0xf5f5f5)
            .setImage('https://i.imgur.com/sjVSAiE.jpeg')
        const mainEmbed = new EmbedBuilder()
            .setColor(0xf5f5f5)
            .setTitle('𝚂𝚎𝚙𝚝𝚞𝚖 𝙰𝚙𝚙𝚕𝚒𝚌𝚊𝚝𝚒𝚘𝚗')
            .addFields({
                name: 'ʏᴏᴜ ᴄᴀɴ ᴛᴀᴋᴇ ᴀᴅᴠᴀɴᴛᴀɢᴇ ᴏꜰ ᴏᴜʀ ꜱᴜᴘᴘᴏʀᴛ ꜱᴇʀᴠɪᴄᴇꜱ ʙʏ ᴜꜱɪɴɢ ᴛʜᴇ ʙᴜᴛᴛᴏɴꜱ ʙᴇʟᴏᴡ!',
                value: '```Create Unit Application by clicking the New Application button below```'
            })

        await interaction.reply({
            embeds: [imageEmbed, mainEmbed],
            components: [row]
        })
    }
})
