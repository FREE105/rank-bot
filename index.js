const http = require("http");
const fs = require("fs");

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes
} = require("discord.js");

// ======================================================
// NASTAVENIA
// ======================================================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = "1535739014760632330";

const RANK_EDITOR_ROLE = "Rank editor";

const PORT = process.env.PORT || 3000;
const DB_FILE = "./ranks.json";

// ======================================================
// RENDER WEB SERVER
// ======================================================

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("CZ/SK/EN Rank Bot is online!");
}).listen(PORT, "0.0.0.0", () => {
    console.log(`Web server beží na porte ${PORT}`);
});

// ======================================================
// DATABASE
// ======================================================

function createDatabase() {
    return {
        players: {},
        history: []
    };
}

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(createDatabase(), null, 2)
    );
}

function loadDatabase() {
    try {
        const data = JSON.parse(
            fs.readFileSync(DB_FILE, "utf8")
        );

        if (!data.players) data.players = {};
        if (!data.history) data.history = [];

        return data;
    } catch {
        return createDatabase();
    }
}

function saveDatabase(data) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(data, null, 2)
    );
}

// ======================================================
// DISCORD CLIENT
// ======================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// ======================================================
// RANKY
// ======================================================

const rankChoices = [
    { name: "LT1", value: "LT1" },
    { name: "LT2", value: "LT2" },
    { name: "LT3", value: "LT3" },
    { name: "LT4", value: "LT4" },
    { name: "LT5", value: "LT5" },

    { name: "HT1", value: "HT1" },
    { name: "HT2", value: "HT2" },
    { name: "HT3", value: "HT3" },
    { name: "HT4", value: "HT4" },
    { name: "HT5", value: "HT5" }
];

// ======================================================
// SLASH COMMANDS
// ======================================================

const commands = [

    // ==================================================
    // /rank
    // ==================================================

    new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Zobrazí rank hráča")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Vyber hráča")
                .setRequired(true)
        ),

    // ==================================================
    // /setrank
    // ==================================================

    new SlashCommandBuilder()
        .setName("setrank")
        .setDescription("Nastaví alebo upraví rank hráča")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč, ktorému nastavuješ rank")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Napíš ľubovoľný gamemode")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("rank")
                .setDescription("Vyber rank")
                .setRequired(true)
                .addChoices(...rankChoices)
        )

        .addUserOption(option =>
            option
                .setName("tester")
                .setDescription("Kto hráča testoval")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("poznámka")
                .setDescription("Poznámka k testu")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("dôkaz")
                .setDescription("Link na video alebo screenshot")
                .setRequired(false)
        )

        .addIntegerOption(option =>
            option
                .setName("hodnotenie")
                .setDescription("Hodnotenie testu od 1 do 10")
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("subrank")
                .setDescription("Ľubovoľný subrank")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("tag")
                .setDescription("Vlastný tag")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("komentar")
                .setDescription("Dodatočný komentár")
                .setRequired(false)
        )

        .addBooleanOption(option =>
            option
                .setName("verified")
                .setDescription("Je test overený?")
                .setRequired(false)
        ),

    // ==================================================
    // /removerank
    // ==================================================

    new SlashCommandBuilder()
        .setName("removerank")
        .setDescription("Odstráni rank hráča")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Vyber hráča")
                .setRequired(true)
        ),

    // ==================================================
    // /ranks
    // ==================================================

    new SlashCommandBuilder()
        .setName("ranks")
        .setDescription("Zobrazí všetky uložené ranky"),

    // ==================================================
    // /top
    // ==================================================

    new SlashCommandBuilder()
        .setName("top")
        .setDescription("Zobrazí TOP ranky"),

    // ==================================================
    // /history
    // ==================================================

    new SlashCommandBuilder()
        .setName("history")
        .setDescription("Zobrazí históriu testov")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Vyber hráča")
                .setRequired(true)
        ),

    // ==================================================
    // /stats
    // ==================================================

    new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Zobrazí štatistiky rank systému"),

    // ==================================================
    // /myrank
    // ==================================================

    new SlashCommandBuilder()
        .setName("myrank")
        .setDescription("Zobrazí tvoj vlastný rank"),

    // ==================================================
    // /searchrank
    // ==================================================

    new SlashCommandBuilder()
        .setName("searchrank")
        .setDescription("Vyhľadá hráča podľa mena")

        .addStringOption(option =>
            option
                .setName("meno")
                .setDescription("Používateľské meno")
                .setRequired(true)
        ),

    // ==================================================
    // /rankinfo
    // ==================================================

    new SlashCommandBuilder()
        .setName("rankinfo")
        .setDescription("Zobrazí informácie o všetkých rankoch")

].map(command => command.toJSON());

// ======================================================
// REGISTRÁCIA PRÍKAZOV
// ======================================================

const rest = new REST({
    version: "10"
}).setToken(TOKEN);

async function registerCommands() {

    try {

        console.log("Registrujem slash príkazy...");

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: commands
            }
        );

        console.log(
            "Slash príkazy boli úspešne zaregistrované!"
        );

    } catch (error) {

        console.error(
            "Chyba pri registrácii príkazov:",
            error
        );
    }
}

// ======================================================
// RANK EDITOR
// ======================================================

function isRankEditor(interaction) {

    if (!interaction.guild) {
        return false;
    }

    const member = interaction.member;

    if (!member || !member.roles) {
        return false;
    }

    return member.roles.cache.some(
        role => role.name === RANK_EDITOR_ROLE
    );
}

// ======================================================
// HODNOTA RANKU
// ======================================================

function rankValue(rank) {

    const values = {
        LT1: 10,
        LT2: 9,
        LT3: 8,
        LT4: 7,
        LT5: 6,

        HT1: 5,
        HT2: 4,
        HT3: 3,
        HT4: 2,
        HT5: 1
    };

    return values[rank] || 0;
}

// ======================================================
// READY
// ======================================================

client.once("ready", () => {

    console.log(
        `Bot je online ako ${client.user.tag}!`
    );

    client.user.setPresence({

        activities: [
            {
                name: "Minecraft Rank System",
                type: 0
            }
        ],

        status: "online"
    });
});

// ======================================================
// INTERACTIONS
// ======================================================

client.on(
    "interactionCreate",
    async interaction => {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        // ==================================================
        // RANK EDITOR CHECK
        // ==================================================

        if (
            interaction.commandName === "setrank" ||
            interaction.commandName === "removerank"
        ) {

            if (!isRankEditor(interaction)) {

                return interaction.reply({

                    content:
                        "❌ Tento príkaz môže používať iba tím **Rank editor**.",

                    ephemeral: true
                });
            }
        }

        const db = loadDatabase();

        // ==================================================
        // /rank
        // ==================================================

        if (
            interaction.commandName === "rank"
        ) {

            const user =
                interaction.options.getUser("hráč");

            const data =
                db.players[user.id];

            if (!data) {

                return interaction.reply({

                    embeds: [

                        new EmbedBuilder()

                            .setColor(0xED4245)

                            .setTitle(
                                "❌ Rank nenájdený"
                            )

                            .setDescription(
                                `Hráč **${user.username}** nemá uložený rank.`
                            )

                            .setThumbnail(
                                user.displayAvatarURL()
                            )
                    ]
                });
            }

            const embed =
                new EmbedBuilder()

                    .setColor(0x5865F2)

                    .setTitle(
                        `🏆 Rank — ${user.username}`
                    )

                    .setThumbnail(
                        user.displayAvatarURL()
                    )

                    .addFields(

                        {
                            name: "👤 Hráč",
                            value:
                                `<@${user.id}>`,
                            inline: true
                        },

                        {
                            name: "🎮 Gamemode",
                            value:
                                data.gamemode,
                            inline: true
                        },

                        {
                            name: "🏆 Rank",
                            value:
                                `**${data.rank}**`,
                            inline: true
                        },

                        {
                            name: "🧪 Tester",
                            value:
                                `<@${data.tester}>`,
                            inline: true
                        },

                        {
                            name: "⭐ Hodnotenie",
                            value:
                                data.hodnotenie
                                    ? `${data.hodnotenie}/10`
                                    : "Neuvedené",
                            inline: true
                        },

                        {
                            name: "🏷️ Tag",
                            value:
                                data.tag ||
                                "Žiadny",
                            inline: true
                        },

                        {
                            name: "🎯 Subrank",
                            value:
                                data.subrank ||
                                "Žiadny",
                            inline: true
                        },

                        {
                            name: "📝 Poznámka",
                            value:
                                data.note ||
                                "Bez poznámky",
                            inline: false
                        },

                        {
                            name: "💬 Komentár",
                            value:
                                data.komentar ||
                                "Žiadny",
                            inline: false
                        },

                        {
                            name: "🔗 Dôkaz",
                            value:
                                data.dokaz ||
                                "Žiadny",
                            inline: false
                        },

                        {
                            name: "✅ Overené",
                            value:
                                data.verified
                                    ? "Áno"
                                    : "Nie",
                            inline: true
                        }

                    )

                    .setFooter({
                        text:
                            "Minecraft Rank System"
                    })

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // /myrank
        // ==================================================

        if (
            interaction.commandName === "myrank"
        ) {

            const data =
                db.players[interaction.user.id];

            if (!data) {

                return interaction.reply({
                    content:
                        "❌ Nemáš uložený rank."
                });
            }

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0x5865F2)

                        .setTitle(
                            "🏆 Tvoj rank"
                        )

                        .setDescription(
                            `**${data.rank}** — ${data.gamemode}`
                        )

                        .setThumbnail(
                            interaction.user.displayAvatarURL()
                        )

                        .setTimestamp()
                ]
            });
        }

        // ==================================================
        // /setrank
        // ==================================================

        if (
            interaction.commandName === "setrank"
        ) {

            const user =
                interaction.options.getUser(
                    "hráč"
                );

            const gamemode =
                interaction.options.getString(
                    "gamemode"
                );

            const rank =
                interaction.options.getString(
                    "rank"
                );

            const selectedTester =
                interaction.options.getUser(
                    "tester"
                );

            const tester =
                selectedTester ||
                interaction.user;

            const note =
                interaction.options.getString(
                    "poznámka"
                ) ||
                "Bez poznámky";

            const dokaz =
                interaction.options.getString(
                    "dôkaz"
                ) ||
                "";

            const hodnotenie =
                interaction.options.getInteger(
                    "hodnotenie"
                );

            const subrank =
                interaction.options.getString(
                    "subrank"
                ) ||
                "";

            const tag =
                interaction.options.getString(
                    "tag"
                ) ||
                "";

            const komentar =
                interaction.options.getString(
                    "komentar"
                ) ||
                "";

            const verifiedOption =
                interaction.options.getBoolean(
                    "verified"
                );

            const verified =
                verifiedOption === null
                    ? false
                    : verifiedOption;

            const oldData =
                db.players[user.id];

            const newData = {

                username:
                    user.username,

                gamemode:
                    gamemode,

                rank:
                    rank,

                tester:
                    tester.id,

                note:
                    note,

                dokaz:
                    dokaz,

                hodnotenie:
                    hodnotenie,

                subrank:
                    subrank,

                tag:
                    tag,

                komentar:
                    komentar,

                verified:
                    verified,

                updatedAt:
                    new Date().toISOString()
            };

            db.players[user.id] =
                newData;

            // ==================================================
            // HISTORY
            // ==================================================

            db.history.push({

                player:
                    user.id,

                username:
                    user.username,

                gamemode:
                    gamemode,

                rank:
                    rank,

                tester:
                    tester.id,

                note:
                    note,

                hodnotenie:
                    hodnotenie,

                date:
                    new Date().toISOString(),

                previousRank:
                    oldData
                        ? oldData.rank
                        : null
            });

            saveDatabase(db);

            const embed =
                new EmbedBuilder()

                    .setColor(0x57F287)

                    .setTitle(
                        oldData
                            ? "🔄 Rank aktualizovaný"
                            : "🏆 Rank test dokončený"
                    )

                    .setThumbnail(
                        user.displayAvatarURL()
                    )

                    .addFields(

                        {
                            name: "👤 Hráč",
                            value:
                                `<@${user.id}>`,
                            inline: true
                        },

                        {
                            name: "🎮 Gamemode",
                            value:
                                gamemode,
                            inline: true
                        },

                        {
                            name: "🏆 Rank",
                            value:
                                `**${rank}**`,
                            inline: true
                        },

                        {
                            name: "🧪 Tester",
                            value:
                                `<@${tester.id}>`,
                            inline: true
                        },

                        {
                            name: "⭐ Hodnotenie",
                            value:
                                hodnotenie
                                    ? `${hodnotenie}/10`
                                    : "Neuvedené",
                            inline: true
                        },

                        {
                            name: "🏷️ Tag",
                            value:
                                tag ||
                                "Žiadny",
                            inline: true
                        },

                        {
                            name: "🎯 Subrank",
                            value:
                                subrank ||
                                "Žiadny",
                            inline: true
                        },

                        {
                            name: "📝 Poznámka",
                            value:
                                note,
                            inline: false
                        },

                        {
                            name: "💬 Komentár",
                            value:
                                komentar ||
                                "Žiadny",
                            inline: false
                        },

                        {
                            name: "🔗 Dôkaz",
                            value:
                                dokaz ||
                                "Žiadny",
                            inline: false
                        },

                        {
                            name: "✅ Overené",
                            value:
                                verified
                                    ? "Áno"
                                    : "Nie",
                            inline: true
                        },

                        {
                            name: "📊 Predchádzajúci rank",
                            value:
                                oldData
                                    ? `**${oldData.rank}**`
                                    : "Prvý test",
                            inline: true
                        }

                    )

                    .setFooter({
                        text:
                            "Minecraft Rank System • Rank editor"
                    })

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // /removerank
        // ==================================================

        if (
            interaction.commandName ===
            "removerank"
        ) {

            const user =
                interaction.options.getUser(
                    "hráč"
                );

            if (!db.players[user.id]) {

                return interaction.reply({

                    content:
                        "❌ Tento hráč nemá uložený rank.",

                    ephemeral: true
                });
            }

            delete db.players[user.id];

            saveDatabase(db);

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0xED4245)

                        .setTitle(
                            "🗑️ Rank odstránený"
                        )

                        .setDescription(
                            `Rank hráča **${user.username}** bol odstránený.`
                        )

                        .setThumbnail(
                            user.displayAvatarURL()
                        )

                        .setTimestamp()
                ]
            });
        }

        // ==================================================
        // /ranks
        // ==================================================

        if (
            interaction.commandName === "ranks"
        ) {

            const entries =
                Object.entries(
                    db.players
                );

            if (!entries.length) {

                return interaction.reply({
                    content:
                        "📭 Zatiaľ nie sú uložené žiadne ranky."
                });
            }

            entries.sort(
                (a, b) =>
                    rankValue(b[1].rank) -
                    rankValue(a[1].rank)
            );

            let description = "";

            for (
                const [id, data]
                of entries.slice(0, 30)
            ) {

                description +=
                    `👤 <@${id}> — **${data.rank}** — ${data.gamemode}\n`;
            }

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0x5865F2)

                        .setTitle(
                            "🏆 Minecraft Ranky"
                        )

                        .setDescription(
                            description
                        )

                        .setFooter({
                            text:
                                `Hráčov: ${entries.length}`
                        })

                        .setTimestamp()
                ]
            });
        }

        // ==================================================
        // /top
        // ==================================================

        if (
            interaction.commandName === "top"
        ) {

            const entries =
                Object.entries(
                    db.players
                );

            entries.sort(
                (a, b) =>
                    rankValue(b[1].rank) -
                    rankValue(a[1].rank)
            );

            const top =
                entries.slice(0, 10);

            if (!top.length) {

                return interaction.reply({
                    content:
                        "📭 Zatiaľ nie sú žiadne ranky."
                });
            }

            let description = "";

            top.forEach(
                ([id, data], index) => {

                    description +=
                        `**${index + 1}.** <@${id}> — **${data.rank}** — ${data.gamemode}\n`;
                }
            );

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0xFEE75C)

                        .setTitle(
                            "🏆 TOP 10"
                        )

                        .setDescription(
                            description
                        )

                        .setTimestamp()
                ]
            });
        }

        // ==================================================
        // /history
        // ==================================================

        if (
            interaction.commandName ===
            "history"
        ) {

            const user =
                interaction.options.getUser(
                    "hráč"
                );

            const history =
                db.history
                    .filter(
                        item =>
                            item.player ===
                            user.id
                    )
                    .slice(-10)
                    .reverse();

            if (!history.length) {

                return interaction.reply({
                    content:
                        "📭 Tento hráč nemá históriu."
                });
            }

            let description = "";

            history.forEach(
                item => {

                    description +=
                        `🏆 **${item.rank}** — ${item.gamemode}\n`;

                    description +=
                        `🧪 Tester: <@${item.tester}>\n`;

                    if (item.hodnotenie) {
                        description +=
                            `⭐ ${item.hodnotenie}/10\n`;
                    }

                    description += "\n";
                }
            );

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0x5865F2)

                        .setTitle(
                            `📜 História — ${user.username}`
                        )

                        .setDescription(
                            description
                        )

                        .setThumbnail(
                            user.displayAvatarURL()
                        )

                        .setFooter({
                            text:
                                "Posledných 10 testov"
                        })

                        .setTimestamp()
                ]
            });
        }

        // ==================================================
        // /stats
        // ==================================================

        if (
            interaction.commandName === "stats"
        ) {

            const players =
                Object.values(
                    db.players
                );

            const counts = {};

            players.forEach(
                player => {

                    counts[player.rank] =
                        (counts[player.rank] || 0) + 1;
                }
            );

            let rankList = "";

            rankChoices.forEach(
                rank => {

                    rankList +=
                        `**${rank.value}:** ${counts[rank.value] || 0}\n`;
                }
            );

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0x5865F2)

                        .setTitle(
                            "📊 Rank System Stats"
                        )

                        .addFields(

                            {
                                name:
                                    "👥 Hráči",
                                value:
                                    `${players.length}`,
                                inline: true
                            },

                            {
                                name:
                                    "🧪 Celkovo testov",
                                value:
                                    `${db.history.length}`,
                                inline: true
                            },

                            {
                                name:
                                    "🏆 Ranky",
                                value:
                                    rankList,
                                inline: false
                            }

                        )

                        .setTimestamp()
                ]
            });
        }

        // ==================================================
        // /searchrank
        // ==================================================

        if (
            interaction.commandName ===
            "searchrank"
        ) {

            const search =
                interaction.options
                    .getString("meno")
                    .toLowerCase();

            const results =
                Object.entries(
                    db.players
                )
                .filter(
                    ([id, data]) =>
                        data.username
                            .toLowerCase()
                            .includes(search)
                )
                .slice(0, 10);

            if (!results.length) {

                return interaction.reply({
                    content:
                        "❌ Žiadny hráč nebol nájdený."
                });
            }

            let description = "";

            results.forEach(
                ([id, data]) => {

                    description +=
                        `👤 <@${id}> — **${data.rank}** — ${data.gamemode}\n`;
                }
            );

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0x5865F2)

                        .setTitle(
                            "🔎 Výsledky vyhľadávania"
                        )

                        .setDescription(
                            description
                        )

                        .setTimestamp()
                ]
            });
        }

        // ==================================================
        // /rankinfo
        // ==================================================

        if (
            interaction.commandName ===
            "rankinfo"
        ) {

            return interaction.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor(0x5865F2)

                        .setTitle(
                            "🏆 Rank System"
                        )

                        .setDescription(
                            "Dostupné ranky:"
                        )

                        .addFields(

                            {
                                name: "🟢 LT",
                                value:
                                    "LT1 • LT2 • LT3 • LT4 • LT5",
                                inline: false
                            },

                            {
                                name: "🔵 HT",
                                value:
                                    "HT1 • HT2 • HT3 • HT4 • HT5",
                                inline: false
                            },

                            {
                                name: "🔐 Rank editor",
                                value:
                                    "Iba členovia s rolou **Rank editor** môžu používať `/setrank` a `/removerank`.",
                                inline: false
                            }

                        )

                        .setTimestamp()
                ]
            });
        }
    }
);

// ======================================================
// START
// ======================================================

if (!TOKEN) {

    console.error(
        "❌ DISCORD_TOKEN nie je nastavený!"
    );

    process.exit(1);
}

registerCommands();

client.login(TOKEN);
