module.exports = (guild_ids) => {
    const fs = require("fs");
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    require("dotenv").config();
    const clientId = process.env.CLIENT_ID;
    const token = process.env.TOKEN;
    const commands = [];
    const commandFiles = fs
        .readdirSync("./src/commands")
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: "9" }).setToken(token);
    guild_ids.forEach((guildId) => {
        (async () => {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    {
                        body: commands,
                    }
                );
                console.log(
                    "Successfully registered application commands for guild " +
                        guildId +
                        "."
                );
            } catch (error) {
                console.error(error);
            }
        })();
    });
};
