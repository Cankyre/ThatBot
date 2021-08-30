const { SlashCommandBuilder } = require("@discordjs/builders");
const { BaseCommandInteraction } = require("discord.js");

const {
    ModData,
    warnEmbed,
    GuildSchema,
} = require("../resources/modResources");

function getGuild(id) {
    let _data = ModData.get(id);
    if (_data) {
        return _data;
    } else {
        ModData.set(id, GuildSchema);
        return GuildSchema;
    }
}

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
        interaction.reply(
            setUserWarns(
                interaction.guild.id,
                interaction.options.getUser("user"),
                getGuild(interaction.guild.id).warns[
                    interaction.options.getUser("user").id
                ] + 1 || 1
            )
        );
        interaction.options.getUser("user").send(`:x: You have now been warned **${
            getGuild(interaction.guild.id).warns[
                interaction.options.getUser("user").id
            ]
        }** times on the server **${interaction.guild.name}**. Please stop breaking the rules in the future!`)
    },
};
