const { SlashCommandBuilder } = require("@discordjs/builders");
const { BaseCommandInteraction } = require("discord.js");

const { RRData } = require('../resources/utilityResources')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reaction_role")
        .setDescription("React to a message in order to get a role")
        .addRoleOption((option) => 
            option
                .setName("role")
                .setDescription("The role you want to give")
                .setRequired(true)
        )
        .addChannelOption((option) => 
            option
                .setName("channel")
                .setDescription("The channel in chich your message is")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("message_id")
                .setDescription("The message you want people to react to.")
                .setRequired(true)
        ),
    /**
     * @param {BaseCommandInteraction} interaction
     */
    async execute(interaction) {
        const role = interaction.options.getRole("role")
        const channel = interaction.options.getChannel("channel")
        const message_id = interaction.options.getString("message_id")
        try {
            var message = await channel.messages.fetch(message_id)
            if (!(interaction.guild.me.roles.highest.position - role.position)) {
                interaction.reply(":x: Please add a role that is lower than the bot's highes role!")
            }
        } catch {
            interaction.reply(":x: An invalid message was given")
            return false;
        }
        
        interaction.reply("You're almost done!")
        interaction.channel.send("Last step: react to this message with the emoji you want people to react with. (in the next 30 seconds)").then(sent => {
            sent.awaitReactions({
                max: 1,
                time: 30000
            }).then(async (collected) => {
                try {    
                    const emoji = collected.first().emoji   
                    RRData.set(message_id + emoji.name + emoji.id, role.id)
                    sent.reactions.removeAll().then(sent.edit(":white_check_mark: All set!"))
                    message.react(emoji)
                } catch (err) {
                    sen
                }
            })
        })
    },
};
