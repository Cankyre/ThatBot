const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");

require("dotenv").config();
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ["USER", "REACTION", "MESSAGE"],
});

const { RRData } = require("./resources/utilityResources");
const { ModData } = require("./resources/modResources");

client.commands = new Collection();
const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    console.log(file);
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
    if (process.argv.indexOf("--dev") + 1) {
        require("./slash")(["820704776425439244"]);
    } else if (process.argv.indexOf("--reload") + 1) {
        const guilds = (await client.guilds.fetch()).map(i => i.id);
        require("./slash")(guilds)
    }
    console.log("Ready!"); 
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply({
            content: ":x: There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    try {
        if (!user.bot) {
            const role = await reaction.message.guild.roles.fetch(
                RRData.get(
                    reaction.message.id +
                        reaction.emoji.name +
                        reaction.emoji.id
                )
            );
            (await role.guild.members.fetch(user.id)).roles.add(role);
        }
    } catch (err) {}
});

client.on("messageReactionRemove", async (reaction, user) => {
    try {
        if (!user.bot) {
            const role = await reaction.message.guild.roles.fetch(
                RRData.get(
                    reaction.message.id +
                        reaction.emoji.name +
                        reaction.emoji.id
                )
            );
            (await role.guild.members.fetch(user.id)).roles.remove(role);
        }
    } catch (err) {}
});

client.on("guildCreate", (guild) => {
    console.log("Reloading slash commands...");
    const guilds = [guild.id];
    require("./slash")(guilds);
});

async function checkBans() {
    var data = ModData.read();
    Object.keys(data).forEach((guild) => {
        Object.keys(data[guild].bans).forEach((player) => {
            if (data[guild].bans[player][0] <= Date.now()) {
                client.guilds.fetch(guild).then((guild) => {
                    guild.members.unban(player).catch(() => {});
                    ModData.unset(`${guild.id}.bans.${player}`);
                });
            }
        });
    });
}

setInterval(() => checkBans().catch(console.error), 60000);

client.login(process.env.TOKEN);
