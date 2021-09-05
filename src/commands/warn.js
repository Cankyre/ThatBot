const { SlashCommandBuilder } = require("@discordjs/builders");
const { BaseCommandInteraction } = require("discord.js");

const { ModData, warnEmbed, getGuild } = require("../resources/modResources");

function setUserWarns(guild, user, number) {
    let _data = getGuild(guild);
    if (!_data) return;
    ModData.set(`${guild}.warns.${user.id}`, number);
    return warnEmbed(user, number);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn user before ban.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to warn")
                .setRequired(true)
        ),
    /**
     * @param {BaseCommandInteraction} interaction
     */
    async execute(interaction) {
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            interaction.reply(
                setUserWarns(
                    interaction.guild.id,
                    interaction.options.getUser("user"),
                    getGuild(interaction.guild.id).warns[
                        interaction.options.getUser("user").id
                    ] + 1 || 1
                )
            );
            interaction.options
                .getUser("user")
                .send(
                    `:x: You have now been warned **${
                        getGuild(interaction.guild.id).warns[
                            interaction.options.getUser("user").id
                        ]
                    }** times on the server **${
                        interaction.guild.name
                    }**. Please stop breaking the rules in the future!`
                );
        } else {
            interaction.reply(
                ":x: You do not have enough permissions in order to run this command."
            );
        }
    },
};
