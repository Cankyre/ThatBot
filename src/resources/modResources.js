const { version } = require("../../package.json");

const ModData = require("edit-json-file")("./data/modData.json", {
    autosave: true,
});

const warnEmbed = (user, warns) => {
    return {
        embeds: [
            {
                type: "rich",
                title: `Warned user ${user.username}#${user.discriminator}`,
                description: `They now have ${warns} warns on this server`,
                color: 0xf50000,
                image: {
                    url: [...globalImages, ...warnImages][
                        Math.floor(
                            Math.random() *
                                [...globalImages, ...warnImages].length
                        )
                    ],
                    height: 0,
                    width: 0,
                },
                timestamp: Date.now(),
                footer: {
                    text: "ThatBot v." + version,
                },
            },
        ],
    };
};

const globalImages = [
    "https://cdn.pixabay.com/photo/2018/08/01/14/04/gavel-3577254_960_720.jpg",
    "https://cdn.pixabay.com/photo/2017/07/10/23/49/club-2492011_960_720.jpg",
    "https://cdn.pixabay.com/photo/2017/02/12/14/00/justice-2060093_960_720.jpg",
    "https://cdn.pixabay.com/photo/2016/07/11/11/10/law-1509436_960_720.jpg",
];

const warnImages = [
    "https://cdn.pixabay.com/photo/2012/04/12/22/25/warning-sign-30915_960_720.png",
    "https://cdn.pixabay.com/photo/2015/10/30/10/46/stop-1013732_960_720.jpg",
];

const GuildSchema = {
    warns: {},
    mutes: {},
    bans: {},
};

function getGuild(id) {
    let _data = ModData.get(id);
    if (_data) {
        return _data;
    } else {
        ModData.set(id, GuildSchema);
        return GuildSchema;
    }
}

module.exports = {
    ModData,
    warnEmbed,
    getGuild,
    GuildSchema,
};
