import {
    BaseInteraction,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder
} from 'discord.js'
import type ApplicationCommand from '../templates/ApplicationCommand.js'
import Event from '../templates/Event.js'

export default new Event({
    name: Events.InteractionCreate,
    async execute(interaction: BaseInteraction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            if (!client.commands.has(interaction.commandName)) return
            try {
                const command: ApplicationCommand = (await client.commands.get(
                    interaction.commandName
                )) as ApplicationCommand

                if (!command.execute) {
                    console.error(
                        `Failed to find execution handler for ${command.data.name}`
                    )
                    await interaction.reply({
                        content:
                            'There was an error while executing this command!',
                        ephemeral: true
                    })
                    return
                }

                await command.execute(interaction)
            } catch (error) {
                console.error(error)
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                })
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.split(':')[0] === 'newAppButton') {
                const target = interaction.customId.split(':')[1]

                const modal = new ModalBuilder()
                    .setCustomId(`newAppModal:${target}`)
                    .setTitle('Septum Application')

                const username = new TextInputBuilder()
                    .setCustomId('username')
                    .setLabel('Discord username')
                    .setPlaceholder('e.g. ch4rlzki')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                const program = new TextInputBuilder()
                    .setCustomId('program')
                    .setLabel('What program/software do you use to edit?')
                    .setPlaceholder(
                        'e.g. After Effects, Alight Motion, Premiere Pro, etc.'
                    )
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                const reason = new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Why do you want to join septum?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                const logo = new TextInputBuilder()
                    .setCustomId('logo')
                    .setLabel('Would you use our logo?')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setPlaceholder('Yes or No')
                const edit = new TextInputBuilder()
                    .setCustomId('edit')
                    .setLabel('Edit link')
                    .setRequired(true)
                    .setPlaceholder(
                        'e.g. https://www.youtube.com/watch?v=Vj4SVVb_DxE'
                    )
                    .setStyle(TextInputStyle.Short)

                const usernameRow =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                        username
                    )
                const programRow =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                        program
                    )
                const reasonRow =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                        reason
                    )
                const logoRow =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(logo)
                const editRow =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(edit)

                modal.addComponents(
                    usernameRow,
                    programRow,
                    reasonRow,
                    logoRow,
                    editRow
                )

                await interaction.showModal(modal)
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId.split(':')[0] === 'newAppModal') {
                const target = interaction.customId.split(':')[1]

                const username =
                    interaction.fields.getTextInputValue('username')
                const program = interaction.fields.getTextInputValue('program')
                const reason = interaction.fields.getTextInputValue('reason')
                const logo = interaction.fields.getTextInputValue('logo')
                const edit = interaction.fields.getTextInputValue('edit')

                const embed = new EmbedBuilder()
                    .setColor(0xf5f5f5)
                    .setTitle('Septum Application')
                    .addFields(
                        { name: 'Discord username', value: username },
                        {
                            name: 'What program/software do you use?',
                            value: program
                        },
                        {
                            name: 'Why do you want to join septum?',
                            value: reason
                        },
                        { name: 'Would you use our logo?', value: logo },
                        { name: 'Edit link', value: edit }
                    )

                const channel = await client.channels.fetch(target)
                if (channel && channel.isTextBased()) {
                    await channel.send({
                        content:
                            '<@&1099356160441724998> An application has been submitted!',
                        embeds: [embed]
                    })

                    await interaction.reply({
                        content: 'Your application has been submitted!',
                        ephemeral: true
                    })
                } else {
                    await interaction.reply({
                        content: 'Something went wrong, please try again.',
                        ephemeral: true
                    })
                }
            }
        } else if (interaction.isAutocomplete()) {
            if (!client.commands.has(interaction.commandName)) return

            try {
                const command: ApplicationCommand = (await client.commands.get(
                    interaction.commandName
                )) as ApplicationCommand

                if (!command.autocomplete) {
                    console.error(
                        `Failed to find autocomplete handler for ${command.data.name}`
                    )
                    await interaction.respond([
                        {
                            name: 'Failed to autocomplete',
                            value: 'error'
                        }
                    ])
                    return
                }

                await command.autocomplete(interaction)
            } catch (error) {
                console.error(error)
            }
        }
    }
})
