const { SlashCommandBuilder } = require("@discordjs/builders");
const { BaseCommandInteraction } = require("discord.js");

const { ModData, banEmbed, getGuild } = require("../resources/modResources");

function setUserBans(guild, user, minutes, reason) {
    let _data = getGuild(guild);
    if (!_data) return;
    ModData.set(`${guild}.bans.${user.id}`, [
        minutes ? (Date.now() / 1000 + minutes * 60).toFixed(0) : null,
        reason,
    ]);
    return banEmbed(user, minutes, reason);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban user with a set timeout (or not).")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to warn")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("minutes")
                .setDescription(
                    "The number of minutes during which the user is warned"
                )
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The ban reason.")
        ),
    /**
     * @param {BaseCommandInteraction} interaction
     */
    async execute(interaction) {
        if (interaction.member.permissions.has("BAN_MEMBERS")) {
            const minutes = interaction.options.getInteger("minutes") || null;
            try {
                var member = await interaction.guild.members.fetch(
                    interaction.options.getUser("user").id
                );
            } catch (err) {
                interaction.channel.send(":x: An invalid member was provided");
                console.error(err);
            }

            if (
                member.roles.highest.position >=
                interaction.guild.me.roles.highest.position
            ) {
                interaction.reply(":x: I can't ban this user");
                return;
            }

            interaction.options
                .getUser("user")
                .send(
                    `:x: You have now been banned of the server **${
                        interaction.guild.name
                    }** for ${minutes || "infinite"} minutes, ${
                        interaction.options.getString("reason")
                            ? "for the reason: **" +
                              interaction.options.getString("reason") +
                              "**."
                            : "no reason was provided."
                    }. Please stop breaking the rules in the future!`
                )
                .catch(() => {})
                .then(() => {
                    interaction.reply(
                        setUserBans(
                            interaction.guild.id,
                            interaction.options.getUser("user"),
                            minutes,
                            interaction.options.getString("reason")
                        )
                    );

                    member.ban({
                        reason: interaction.options.getString("reason"),
                    });
                });
        } else {
            interaction.reply(
                ":x: You do not have enough permissions in order to run this command."
            );
        }
    },
};
