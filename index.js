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
// SETTINGS
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

    res.end("Rank Bot is online!");
}).listen(PORT, "0.0.0.0", () => {
    console.log(`Web server beží na porte ${PORT}`);
});

// ======================================================
// DATABASE
// ======================================================

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify({
            players: {},
            history: []
        }, null, 2)
    );
}

function loadDatabase() {
    try {
        const data = JSON.parse(
            fs.readFileSync(DB_FILE, "utf8")
        );

        if (!data.players) data.players = [];
        if (!data.history) data.history = [];

        return data;

    } catch {
        return {
            players: {},
            history: []
        };
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
// RANK OPTIONS
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
// GAMEMODE OPTIONS
// ======================================================

const gamemodeChoices = [
    { name: "BedWars", value: "BedWars" },
    { name: "Bridges", value: "Bridges" },
    { name: "Boxing", value: "Boxing" },
    { name: "Clutch", value: "Clutch" },
    { name: "Combo", value: "Combo" },
    { name: "Crystal PvP", value: "Crystal PvP" },
    { name: "Diamond", value: "Diamond" },
    { name: "Factions", value: "Factions" },
    { name: "KitPvP", value: "KitPvP" },
    { name: "NoDebuff", value: "NoDebuff" },
    { name: "PotPvP", value: "PotPvP" },
    { name: "SkyWars", value: "SkyWars" },
    { name: "Survival Games", value: "Survival Games" },
    { name: "UHC", value: "UHC" },
    { name: "Other", value: "Other" }
];

// ======================================================
// SLASH COMMANDS
// ======================================================

const commands = [

    // --------------------------------------------------
    // /rank
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Zobrazí rank hráča")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Vyber hráča")
                .setRequired(true)
        ),

    // --------------------------------------------------
    // /setrank
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("setrank")
        .setDescription("Nastaví alebo upraví rank hráča")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Vyber hráča")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Vyber gamemode")
                .setRequired(true)
                .addChoices(...gamemodeChoices)
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
        ),

    // --------------------------------------------------
    // /removerank
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("removerank")
        .setDescription("Odstráni rank hráča")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Vyber hráča")
                .setRequired(true)
        ),

    // --------------------------------------------------
    // /ranks
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("ranks")
        .setDescription("Zobrazí všetkých hráčov s rankom"),

    // --------------------------------------------------
    // /top
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("top")
        .setDescription("Zobrazí najvyššie ranky"),

    // --------------------------------------------------
    // /history
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("history")
        .setDescription("Zobrazí históriu testov hráča")

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Vyber hráča")
                .setRequired(true)
        ),

    // --------------------------------------------------
    // /stats
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Zobrazí štatistiky rank systému")

].map(command => command.toJSON());

// ======================================================
// REGISTER SLASH COMMANDS
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
// RANK EDITOR CHECK
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
// RANK VALUE
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
        // RANK EDITOR COMMANDS
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

                const embed =
                    new EmbedBuilder()

                        .setColor(0xED4245)

                        .setTitle(
                            "❌ Rank nenájdený"
                        )

                        .setDescription(
                            `Hráč **${user.username}** zatiaľ nemá nastavený rank.`
                        )

                        .setThumbnail(
                            user.displayAvatarURL()
                        )

                        .setTimestamp();

                return interaction.reply({
                    embeds: [embed]
                });
            }

            const embed =
                new EmbedBuilder()

                    .setColor(0x5865F2)

                    .setTitle(
                        "🏆 Minecraft Rank"
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
                            name: "🧪 Testoval",
                            value:
                                `<@${data.tester}>`,
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
                            name: "📅 Test",
                            value:
                                `<t:${Math.floor(
                                    new Date(data.updatedAt).getTime() / 1000
                                )}:R>`,
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

            const oldData =
                db.players[user.id];

            db.players[user.id] = {

                username:
                    user.username,

                gamemode:
                    gamemode,

                rank:
                    rank,

                note:
                    note,

                tester:
                    tester.id,

                updatedAt:
                    new Date().toISOString()
            };

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

                previousRank:
                    oldData
                        ? oldData.rank
                        : null,

                date:
                    new Date().toISOString()
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
                            name: "🧪 Testoval",
                            value:
                                `<@${tester.id}>`,
                            inline: true
                        },

                        {
                            name: "📝 Poznámka",
                            value:
                                note,
                            inline: false
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

            const embed =
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

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // /ranks
        // ==================================================

        if (
            interaction.commandName ===
            "ranks"
        ) {

            const entries =
                Object.entries(
                    db.players
                );

            if (
                entries.length === 0
            ) {

                return interaction.reply({

                    content:
                        "📭 Zatiaľ nemá nikto nastavený rank."
                });
            }

            const sorted =
                entries.sort(
                    (a, b) =>
                        rankValue(
                            b[1].rank
                        ) -
                        rankValue(
                            a[1].rank
                        )
                );

            let description = "";

            for (
                const [userId, data]
                of sorted
            ) {

                description +=
                    `👤 <@${userId}> — **${data.rank}** — ${data.gamemode}\n`;
            }

            const embed =
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
                            `Počet hráčov: ${entries.length}`
                    })

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // /top
        // ==================================================

        if (
            interaction.commandName ===
            "top"
        ) {

            const entries =
                Object.entries(
                    db.players
                );

            const sorted =
                entries.sort(
                    (a, b) =>
                        rankValue(
                            b[1].rank
                        ) -
                        rankValue(
                            a[1].rank
                        )
                );

            const top =
                sorted.slice(0, 10);

            if (top.length === 0) {

                return interaction.reply({
                    content:
                        "📭 Zatiaľ nemá nikto rank."
                });
            }

            let description = "";

            top.forEach(
                ([userId, data], index) => {

                    description +=
                        `**${index + 1}.** <@${userId}> — **${data.rank}** — ${data.gamemode}\n`;
                }
            );

            const embed =
                new EmbedBuilder()

                    .setColor(0xFEE75C)

                    .setTitle(
                        "🏆 TOP Ranky"
                    )

                    .setDescription(
                        description
                    )

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
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
                        entry =>
                            entry.player ===
                            user.id
                    )
                    .slice(-10)
                    .reverse();

            if (
                history.length === 0
            ) {

                return interaction.reply({

                    content:
                        "📭 Tento hráč zatiaľ nemá históriu testov."
                });
            }

            let description = "";

            history.forEach(
                entry => {

                    description +=
                        `🏆 **${entry.rank}** — ${entry.gamemode} — <@${entry.tester}>\n`;

                    description +=
                        `📝 ${entry.note}\n\n`;
                }
            );

            const embed =
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

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // /stats
        // ==================================================

        if (
            interaction.commandName ===
            "stats"
        ) {

            const players =
                Object.values(
                    db.players
                );

            const totalTests =
                db.history.length;

            const rankCounts = {};

            for (
                const player
                of players
            ) {

                rankCounts[player.rank] =
                    (rankCounts[player.rank] || 0) + 1;
            }

            let rankList = "";

            for (
                const rank of rankChoices
            ) {

                const count =
                    rankCounts[rank.value] ||
                    0;

                rankList +=
                    `**${rank.value}:** ${count}\n`;
            }

            const embed =
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
                                "🧪 Testy",
                            value:
                                `${totalTests}`,
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

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
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
