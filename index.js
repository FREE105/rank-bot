const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const http = require("http");

// =====================================================
// CONFIG
// =====================================================

const TOKEN = process.env.DISCORD_TOKEN;

const CLIENT_ID =
    process.env.CLIENT_ID || "1535978914843729970";

const GUILD_ID =
    process.env.GUILD_ID || "1523657617698984038";

const PORT =
    process.env.PORT || 3000;

const OFFICIAL_WEB =
    "https://czskengglobalranking.lovable.app/";

const DB_FILE =
    "./testers.json";

// =====================================================
// TOKEN CHECK
// =====================================================

if (!TOKEN) {
    console.error("❌ DISCORD_TOKEN nie je nastavený!");
    process.exit(1);
}

// =====================================================
// DISCORD CLIENT
// =====================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// =====================================================
// THEMES + IMAGES
// =====================================================

const THEMES = {

    aurora: {
        name: "🌌 Aurora",
        color: 0x57F287,
        image:
            "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=85"
    },

    fire: {
        name: "🔥 Fire",
        color: 0xFF4500,
        image:
            "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=1600&q=85"
    },

    snow: {
        name: "❄️ Snow",
        color: 0xDDEEFF,
        image:
            "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=85"
    },

    ice: {
        name: "🧊 Ice",
        color: 0x74C0FC,
        image:
            "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=1600&q=85"
    },

    ocean: {
        name: "🌊 Ocean",
        color: 0x3498DB,
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
    },

    forest: {
        name: "🌲 Forest",
        color: 0x2ECC71,
        image:
            "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85"
    },

    volcano: {
        name: "🌋 Volcano",
        color: 0xC0392B,
        image:
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=85"
    },

    lightning: {
        name: "⚡ Lightning",
        color: 0xF1C40F,
        image:
            "https://images.unsplash.com/photo-1605727216801-e27ce1d0f34c?auto=format&fit=crop&w=1600&q=85"
    },

    meteor: {
        name: "☄️ Meteor",
        color: 0xE74C3C,
        image:
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85"
    },

    galaxy: {
        name: "🪐 Galaxy",
        color: 0x9B59B6,
        image:
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=85"
    },

    moon: {
        name: "🌙 Moon",
        color: 0x7289DA,
        image:
            "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1600&q=85"
    },

    sunset: {
        name: "🌅 Sunset",
        color: 0xE67E22,
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85"
    },

    storm: {
        name: "⛈️ Storm",
        color: 0x34495E,
        image:
            "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1600&q=85"
    },

    rainbow: {
        name: "🌈 Rainbow",
        color: 0xE91E63,
        image:
            "https://images.unsplash.com/photo-1593362831502-5c3ad1c05f57?auto=format&fit=crop&w=1600&q=85"
    },

    desert: {
        name: "🏜️ Desert",
        color: 0xD4AC0D,
        image:
            "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=85"
    },

    toxic: {
        name: "☢️ Toxic",
        color: 0xA3CB38,
        image:
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85"
    },

    cyber: {
        name: "💻 Cyber",
        color: 0x00FFFF,
        image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85"
    },

    blood: {
        name: "🩸 Blood",
        color: 0x8B0000,
        image:
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85"
    },

    shadow: {
        name: "🌑 Shadow",
        color: 0x202020,
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85"
    },

    diamond: {
        name: "💎 Diamond",
        color: 0x00FFFF,
        image:
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1600&q=85"
    },

    gold: {
        name: "🥇 Gold",
        color: 0xFFD700,
        image:
            "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=85"
    },

    minecraft: {
        name: "⛏️ Minecraft",
        color: 0x55AA55,
        image:
            "https://images.unsplash.com/photo-1607513746994-51f730a44832?auto=format&fit=crop&w=1600&q=85"
    }
};

// =====================================================
// AUTOMATIC THEME DETECTION
// =====================================================

function getThemeFromText(text) {

    const value =
        String(text || "")
            .toLowerCase();

    const keywords = {

        aurora: [
            "aurora",
            "polarna",
            "polárna",
            "northern lights"
        ],

        fire: [
            "fire",
            "flame",
            "lava",
            "oheň",
            "ohen"
        ],

        snow: [
            "snow",
            "sneh",
            "snowman",
            "winter",
            "zima"
        ],

        ice: [
            "ice",
            "ľad",
            "lad",
            "frost"
        ],

        ocean: [
            "ocean",
            "water",
            "voda",
            "sea",
            "more"
        ],

        forest: [
            "forest",
            "les",
            "jungle",
            "nature"
        ],

        volcano: [
            "volcano",
            "sopka"
        ],

        lightning: [
            "lightning",
            "thunder",
            "blesk"
        ],

        meteor: [
            "meteor",
            "meteorit",
            "space rock"
        ],

        galaxy: [
            "galaxy",
            "galaxia",
            "space",
            "vesmir",
            "vesmír"
        ],

        moon: [
            "moon",
            "mesiac",
            "night",
            "noc"
        ],

        sunset: [
            "sunset",
            "zapad",
            "západ",
            "evening"
        ],

        storm: [
            "storm",
            "búrka",
            "burka"
        ],

        rainbow: [
            "rainbow",
            "dúha",
            "duha"
        ],

        desert: [
            "desert",
            "púšť",
            "pust"
        ],

        toxic: [
            "toxic",
            "poison",
            "radioactive",
            "toxic"
        ],

        cyber: [
            "cyber",
            "cyberpunk",
            "tech",
            "technology"
        ],

        blood: [
            "blood",
            "krv"
        ],

        shadow: [
            "shadow",
            "tieň",
            "tien",
            "dark"
        ],

        diamond: [
            "diamond",
            "diamant"
        ],

        gold: [
            "gold",
            "zlato"
        ],

        minecraft: [
            "minecraft",
            "mc",
            "bedrock",
            "java"
        ]
    };

    for (
        const [theme, words]
        of Object.entries(keywords)
    ) {

        if (
            words.some(
                word =>
                    value.includes(word)
            )
        ) {

            return THEMES[theme];
        }
    }

    return THEMES.aurora;
}

// =====================================================
// DATABASE
// =====================================================

function loadDatabase() {

    try {

        if (!fs.existsSync(DB_FILE)) {

            fs.writeFileSync(
                DB_FILE,
                "{}"
            );

            return {};
        }

        return JSON.parse(
            fs.readFileSync(
                DB_FILE,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "❌ Chyba databázy:",
            error
        );

        return {};
    }
}

function saveDatabase(data) {

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(
            data,
            null,
            2
        )
    );
}

// =====================================================
// EMBED HELPERS
// =====================================================

function addOfficialWeb(embed) {

    embed.addFields({
        name:
            "🌐 Official Tier Web",

        value:
            `[Otvoriť oficiálny Tier Web](${OFFICIAL_WEB})`,

        inline:
            false
    });

    embed.setFooter({
        text:
            "CZ/SK/EN Tier Bot • Tier System"
    });

    embed.setTimestamp();

    return embed;
}

// =====================================================
// COMMANDS
// =====================================================

const commands = [

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Skontroluje, či bot funguje"
        ),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Zobrazí všetky príkazy"
        ),

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription(
            "Informácie o serveri"
        ),

    // =================================================
    // ADD RANK
    // =================================================

    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription(
            "Pridá výsledok rank testu"
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )

        .addUserOption(option =>
            option
                .setName("hrac")
                .setDescription(
                    "Testovaný hráč"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription(
                    "Gamemode"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("previous_rank")
                .setDescription(
                    "Predošlý rank"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("new_rank")
                .setDescription(
                    "Nový rank"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("status")
                .setDescription(
                    "Výsledok"
                )
                .setRequired(true)
                .addChoices(
                    {
                        name:
                            "🟢 Rank UP",

                        value:
                            "UP"
                    },
                    {
                        name:
                            "🔴 Rank DOWN",

                        value:
                            "DOWN"
                    },
                    {
                        name:
                            "⚪ Bez zmeny",

                        value:
                            "SAME"
                    }
                )
        )

        .addIntegerOption(option =>
            option
                .setName("rounds")
                .setDescription(
                    "Počet rounds"
                )
                .setMinValue(1)
                .setMaxValue(100)
        )

        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription(
                    "Hodnotenie"
                )
                .setMaxLength(500)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription(
                    "Poznámka"
                )
                .setMaxLength(1000)
        ),

    // =================================================
    // SET TESTER
    // =================================================

    new SlashCommandBuilder()
        .setName("settester")
        .setDescription(
            "Nastaví používateľa ako testera"
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )

        .addUserOption(option =>
            option
                .setName("tester")
                .setDescription(
                    "Kto sa stáva testerom"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription(
                    "POVINNÉ – Free Text gamemode"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("rank")
                .setDescription(
                    "Rank testera"
                )
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("skusenosti")
                .setDescription(
                    "XP / skúsenosti"
                )
                .setRequired(true)
                .setMinValue(0)
        )

        .addStringOption(option =>
            option
                .setName("specializacia")
                .setDescription(
                    "Špecializácia"
                )
        )

        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription(
                    "Hodnotenie"
                )
        )

        .addIntegerOption(option =>
            option
                .setName("testy")
                .setDescription(
                    "Počet testov"
                )
                .setMinValue(0)
        )

        .addIntegerOption(option =>
            option
                .setName("uspesne_testy")
                .setDescription(
                    "Úspešné testy"
                )
                .setMinValue(0)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription(
                    "Poznámka"
                )
        ),

    // =================================================
    // TESTER INFO
    // =================================================

    new SlashCommandBuilder()
        .setName("testerinfo")
        .setDescription(
            "Zobrazí profil testera"
        )

        .addUserOption(option =>
            option
                .setName("tester")
                .setDescription(
                    "Tester"
                )
        ),

    // =================================================
    // TESTERS
    // =================================================

    new SlashCommandBuilder()
        .setName("testers")
        .setDescription(
            "Zobrazí zoznam testerov"
        ),

    // =================================================
    // REMOVE TESTER
    // =================================================

    new SlashCommandBuilder()
        .setName("removetester")
        .setDescription(
            "Odoberie testera"
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )

        .addUserOption(option =>
            option
                .setName("tester")
                .setDescription(
                    "Tester"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("dovod")
                .setDescription(
                    "Dôvod"
                )
        )
];

// =====================================================
// REGISTER COMMANDS
// =====================================================

async function registerCommands() {

    const rest =
        new REST({
            version: "10"
        }).setToken(TOKEN);

    console.log(
        "🔄 Registrujem slash príkazy..."
    );

    await rest.put(
        Routes.applicationGuildCommands(
            CLIENT_ID,
            GUILD_ID
        ),
        {
            body:
                commands.map(
                    command =>
                        command.toJSON()
                )
        }
    );

    console.log(
        "✅ Slash príkazy zaregistrované!"
    );
}

// =====================================================
// ADMIN CHECK
// =====================================================

function isAdmin(interaction) {

    return (
        interaction.memberPermissions &&
        interaction.memberPermissions.has(
            PermissionFlagsBits.Administrator
        )
    );
}

// =====================================================
// INTERACTIONS
// =====================================================

client.on(
    "interactionCreate",
    async interaction => {

        if (
            !interaction.isChatInputCommand()
        ) {
            return;
        }

        try {

            // =================================================
            // PING
            // =================================================

            if (
                interaction.commandName ===
                "ping"
            ) {

                const theme =
                    THEMES.aurora;

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            theme.color
                        )
                        .setTitle(
                            "🌌 BOT ONLINE"
                        )
                        .setDescription(
                            `🤖 **${client.user.tag}**\n\n🏓 Ping: **${client.ws.ping} ms**\n\nBot funguje správne.`
                        )
                        .setImage(
                            theme.image
                        );

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // HELP
            // =================================================

            if (
                interaction.commandName ===
                "help"
            ) {

                const theme =
                    THEMES.aurora;

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            theme.color
                        )
                        .setTitle(
                            "🌌 CZ/SK/EN TIER BOT"
                        )
                        .setDescription(
                            "Kompletný systém pre ranky, testovanie a testerov."
                        )

                        .addFields(

                            {
                                name:
                                    "🏆 RANK",

                                value:
                                    "`/addrank`\n" +
                                    "Hráč • Gamemode • Previous Rank • New Rank • Status • Rounds • Hodnotenie • Poznámka"
                            },

                            {
                                name:
                                    "🧪 TESTER",

                                value:
                                    "`/settester`\n" +
                                    "Tester • Gamemode • Rank • XP • Špecializácia • Hodnotenie • Testy • Úspešné testy • Poznámka"
                            },

                            {
                                name:
                                    "📋 PROFIL",

                                value:
                                    "`/testerinfo`\n" +
                                    "Zobrazí kompletné údaje testera."
                            },

                            {
                                name:
                                    "👥 TESTERI",

                                value:
                                    "`/testers`\n" +
                                    "Zoznam aktívnych testerov."
                            },

                            {
                                name:
                                    "🚫 REMOVE",

                                value:
                                    "`/removetester`\n" +
                                    "Odstránenie testera."
                            },

                            {
                                name:
                                    "🛠️ OSTATNÉ",

                                value:
                                    "`/ping`\n" +
                                    "`/serverinfo`\n" +
                                    "`/help`"
                            }
                        )
                        .setImage(
                            theme.image
                        );

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // SERVER INFO
            // =================================================

            if (
                interaction.commandName ===
                "serverinfo"
            ) {

                const guild =
                    interaction.guild;

                if (!guild) {

                    return interaction.reply({
                        content:
                            "❌ Použi tento príkaz na serveri.",
                        ephemeral: true
                    });
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            THEMES.space.color
                        )
                        .setTitle(
                            `🌌 ${guild.name}`
                        )
                        .setThumbnail(
                            guild.iconURL() || null
                        )
                        .addFields(

                            {
                                name:
                                    "👥 Členovia",

                                value:
                                    `${guild.memberCount}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🆔 Guild ID",

                                value:
                                    guild.id,

                                inline:
                                    true
                            }
                        )
                        .setImage(
                            THEMES.space.image
                        );

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // ADMIN COMMANDS
            // =================================================

            if (
                [
                    "addrank",
                    "settester",
                    "removetester"
                ].includes(
                    interaction.commandName
                )
            ) {

                if (!isAdmin(interaction)) {

                    return interaction.reply({
                        content:
                            "❌ Tento príkaz môže používať iba Administrator.",
                        ephemeral: true
                    });
                }
            }

            // =================================================
            // ADD RANK
            // =================================================

            if (
                interaction.commandName ===
                "addrank"
            ) {

                const player =
                    interaction.options.getUser(
                        "hrac"
                    );

                const gamemode =
                    interaction.options.getString(
                        "gamemode"
                    );

                const previousRank =
                    interaction.options.getString(
                        "previous_rank"
                    );

                const newRank =
                    interaction.options.getString(
                        "new_rank"
                    );

                const status =
                    interaction.options.getString(
                        "status"
                    );

                const rounds =
                    interaction.options.getInteger(
                        "rounds"
                    );

                const rating =
                    interaction.options.getString(
                        "hodnotenie"
                    );

                const note =
                    interaction.options.getString(
                        "poznamka"
                    );

                // Theme podľa gamemode
                const theme =
                    getThemeFromText(
                        gamemode
                    );

                let statusText;
                let statusEmoji;
                let statusColor;

                if (
                    status === "UP"
                ) {

                    statusText =
                        "RANK UP";

                    statusEmoji =
                        "🟢";

                    statusColor =
                        0x57F287;

                } else if (
                    status === "DOWN"
                ) {

                    statusText =
                        "RANK DOWN";

                    statusEmoji =
                        "🔴";

                    statusColor =
                        0xED4245;

                } else {

                    statusText =
                        "BEZ ZMENY";

                    statusEmoji =
                        "⚪";

                    statusColor =
                        0x95A5A6;
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            statusColor
                        )
                        .setTitle(
                            `${theme.name} • 🏆 RANK TEST`
                        )
                        .setDescription(
                            `## ${player.username}\n**Výsledok testu**`
                        )
                        .setThumbnail(
                            player.displayAvatarURL()
                        )

                        .addFields(

                            {
                                name:
                                    "👤 Hráč",

                                value:
                                    `<@${player.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎮 Gamemode",

                                value:
                                    gamemode,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Tester",

                                value:
                                    `<@${interaction.user.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📉 Previous Rank",

                                value:
                                    previousRank,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📈 New Rank",

                                value:
                                    newRank,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📊 Výsledok",

                                value:
                                    `${statusEmoji} **${statusText}**`,

                                inline:
                                    true
                            }
                        );

                if (
                    rounds !== null
                ) {

                    embed.addFields({
                        name:
                            "🔄 Rounds",

                        value:
                            `${rounds}`,

                        inline:
                            true
                    });
                }

                if (rating) {

                    embed.addFields({
                        name:
                            "⭐ Hodnotenie",

                        value:
                            rating,

                        inline:
                            false
                    });
                }

                if (note) {

                    embed.addFields({
                        name:
                            "📝 Poznámka",

                        value:
                            note,

                        inline:
                            false
                    });
                }

                embed.setImage(
                    theme.image
                );

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // SET TESTER
            // =================================================

            if (
                interaction.commandName ===
                "settester"
            ) {

                const tester =
                    interaction.options.getUser(
                        "tester"
                    );

                const gamemode =
                    interaction.options.getString(
                        "gamemode"
                    );

                const rank =
                    interaction.options.getString(
                        "rank"
                    );

                const experience =
                    interaction.options.getInteger(
                        "skusenosti"
                    );

                const specialization =
                    interaction.options.getString(
                        "specializacia"
                    ) ||
                    "Neuvedená";

                const rating =
                    interaction.options.getString(
                        "hodnotenie"
                    ) ||
                    "Neuvedené";

                const tests =
                    interaction.options.getInteger(
                        "testy"
                    ) ?? 0;

                const successfulTests =
                    interaction.options.getInteger(
                        "uspesne_testy"
                    ) ?? 0;

                const note =
                    interaction.options.getString(
                        "poznamka"
                    ) ||
                    "Žiadna poznámka";

                const database =
                    loadDatabase();

                const now =
                    new Date();

                database[tester.id] = {

                    userId:
                        tester.id,

                    username:
                        tester.username,

                    gamemode:
                        gamemode,

                    rank:
                        rank,

                    experience:
                        experience,

                    specialization:
                        specialization,

                    rating:
                        rating,

                    tests:
                        tests,

                    successfulTests:
                        successfulTests,

                    note:
                        note,

                    promotedBy: {

                        id:
                            interaction.user.id,

                        username:
                            interaction.user.username
                    },

                    promotedAt:
                        now.toISOString(),

                    active:
                        true
                };

                saveDatabase(
                    database
                );

                const successRate =
                    tests > 0
                        ? Math.round(
                            (
                                successfulTests /
                                tests
                            ) * 100
                        )
                        : 0;

                const theme =
                    getThemeFromText(
                        gamemode
                    );

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            theme.color
                        )
                        .setTitle(
                            `${theme.name} • 🧪 NOVÝ TESTER`
                        )
                        .setDescription(
                            `## ${tester.username}\nPoužívateľ bol pridaný medzi testerov.`
                        )
                        .setThumbnail(
                            tester.displayAvatarURL()
                        )

                        .addFields(

                            {
                                name:
                                    "👤 Tester",

                                value:
                                    `<@${tester.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎮 Gamemode",

                                value:
                                    gamemode,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🏅 Rank",

                                value:
                                    rank,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "⭐ XP",

                                value:
                                    `${experience}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Testy",

                                value:
                                    `${tests}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné",

                                value:
                                    `${successfulTests}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📈 Úspešnosť",

                                value:
                                    `${successRate}%`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎯 Špecializácia",

                                value:
                                    specialization,

                                inline:
                                    false
                            },

                            {
                                name:
                                    "⭐ Hodnotenie",

                                value:
                                    rating,

                                inline:
                                    false
                            },

                            {
                                name:
                                    "👑 Povýšil",

                                value:
                                    `<@${interaction.user.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📅 Pridaný",

                                value:
                                    `<t:${Math.floor(
                                        now.getTime() / 1000
                                    )}:F>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📝 Poznámka",

                                value:
                                    note,

                                inline:
                                    false
                            }
                        )
                        .setImage(
                            theme.image
                        );

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // TESTER INFO
            // =================================================

            if (
                interaction.commandName ===
                "testerinfo"
            ) {

                const selectedUser =
                    interaction.options.getUser(
                        "tester"
                    ) ||
                    interaction.user;

                const database =
                    loadDatabase();

                const data =
                    database[
                        selectedUser.id
                    ];

                if (
                    !data ||
                    !data.active
                ) {

                    return interaction.reply({
                        content:
                            "❌ Tento používateľ nie je aktívny tester.",
                        ephemeral: true
                    });
                }

                const successRate =
                    data.tests > 0
                        ? Math.round(
                            (
                                data.successfulTests /
                                data.tests
                            ) * 100
                        )
                        : 0;

                const theme =
                    getThemeFromText(
                        data.gamemode
                    );

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            theme.color
                        )
                        .setTitle(
                            `${theme.name} • 🧪 TESTER PROFILE`
                        )
                        .setDescription(
                            `## ${selectedUser.username}`
                        )
                        .setThumbnail(
                            selectedUser.displayAvatarURL()
                        )

                        .addFields(

                            {
                                name:
                                    "🎮 Gamemode",

                                value:
                                    data.gamemode,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🏅 Rank",

                                value:
                                    data.rank,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "⭐ XP",

                                value:
                                    `${data.experience}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Testy",

                                value:
                                    `${data.tests}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné",

                                value:
                                    `${data.successfulTests}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📈 Úspešnosť",

                                value:
                                    `${successRate}%`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎯 Špecializácia",

                                value:
                                    data.specialization,

                                inline:
                                    false
                            },

                            {
                                name:
                                    "⭐ Hodnotenie",

                                value:
                                    data.rating,

                                inline:
                                    false
                            },

                            {
                                name:
                                    "👑 Povýšil",

                                value:
                                    `<@${data.promotedBy.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📅 Tester od",

                                value:
                                    `<t:${Math.floor(
                                        new Date(
                                            data.promotedAt
                                        ).getTime() /
                                        1000
                                    )}:R>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📝 Poznámka",

                                value:
                                    data.note,

                                inline:
                                    false
                            }
                        )
                        .setImage(
                            theme.image
                        );

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // TESTERS
            // =================================================

            if (
                interaction.commandName ===
                "testers"
            ) {

                const database =
                    loadDatabase();

                const testers =
                    Object.values(
                        database
                    ).filter(
                        tester =>
                            tester.active
                    );

                const theme =
                    THEMES.aurora;

                if (
                    testers.length === 0
                ) {

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(
                                    theme.color
                                )
                                .setTitle(
                                    "🌌 Aktívni Testeri"
                                )
                                .setDescription(
                                    "Momentálne nemáme žiadnych aktívnych testerov."
                                )
                                .setImage(
                                    theme.image
                                )
                        ]
                    });
                }

                const list =
                    testers
                        .slice(0, 25)
                        .map(
                            (tester, index) =>
                                `${index + 1}. <@${tester.userId}> — **${tester.rank}** • 🎮 ${tester.gamemode} • ⭐ ${tester.experience} XP`
                        )
                        .join("\n");

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            theme.color
                        )
                        .setTitle(
                            "🌌 Aktívni Testeri"
                        )
                        .setDescription(
                            list
                        )
                        .setImage(
                            theme.image
                        )
                        .setFooter({
                            text:
                                `Počet testerov: ${testers.length}`
                        });

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // REMOVE TESTER
            // =================================================

            if (
                interaction.commandName ===
                "removetester"
            ) {

                const tester =
                    interaction.options.getUser(
                        "tester"
                    );

                const reason =
                    interaction.options.getString(
                        "dovod"
                    ) ||
                    "Bez dôvodu";

                const database =
                    loadDatabase();

                if (
                    !database[tester.id] ||
                    !database[tester.id].active
                ) {

                    return interaction.reply({
                        content:
                            "❌ Tento používateľ nie je aktívny tester.",
                        ephemeral: true
                    });
                }

                database[
                    tester.id
                ].active = false;

                database[
                    tester.id
                ].removedBy = {

                    id:
                        interaction.user.id,

                    username:
                        interaction.user.username
                };

                database[
                    tester.id
                ].removedAt =
                    new Date().toISOString();

                database[
                    tester.id
                ].removeReason =
                    reason;

                saveDatabase(
                    database
                );

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            0xED4245
                        )
                        .setTitle(
                            "🚫 TESTER ODOBRATÝ"
                        )
                        .setDescription(
                            `<@${tester.id}> už nie je aktívnym testerom.`
                        )
                        .addFields(

                            {
                                name:
                                    "👤 Tester",

                                value:
                                    `<@${tester.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "👑 Odobral",

                                value:
                                    `<@${interaction.user.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📝 Dôvod",

                                value:
                                    reason,

                                inline:
                                    false
                            }
                        )
                        .setImage(
                            THEMES.shadow.image
                        );

                addOfficialWeb(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

        } catch (error) {

            console.error(
                "❌ Interaction error:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({
                    content:
                        "❌ Nastala chyba pri vykonávaní príkazu.",
                    ephemeral: true
                });
            }
        }
    }
);

// =====================================================
// READY
// =====================================================

client.once(
    "ready",
    async () => {

        console.log(
            "========================================"
        );

        console.log(
            "🤖 BOT JE ONLINE!"
        );

        console.log(
            `👤 ${client.user.tag}`
        );

        console.log(
            `🆔 Client ID: ${CLIENT_ID}`
        );

        console.log(
            `🏠 Guild ID: ${GUILD_ID}`
        );

        console.log(
            "🌌 THEMATIC EMBED SYSTEM ONLINE"
        );

        console.log(
            "========================================"
        );

        client.user.setActivity(
            "Tier Testing 🏆"
        );

        try {

            await registerCommands();

        } catch (error) {

            console.error(
                "❌ Slash command registration error:",
                error
            );
        }
    }
);

// =====================================================
// WEB SERVER
// =====================================================

http.createServer(
    (req, res) => {

        res.writeHead(
            200,
            {
                "Content-Type":
                    "text/plain; charset=utf-8"
            }
        );

        res.end(
            "🌌 CZ/SK/EN Tier Bot is online!"
        );
    }
).listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🌐 Web server beží na porte ${PORT}`
        );
    }
);

// =====================================================
// LOGIN
// =====================================================

console.log(
    "🔄 Pripájam Discord bota..."
);

client.login(TOKEN)
    .then(() => {

        console.log(
            "🔐 Discord login OK"
        );

    })
    .catch(error => {

        console.error(
            "❌ Discord login zlyhal:",
            error
        );

        process.exit(1);
    });
