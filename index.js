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
const GUILD_ID = "1523657617698984038";
const PORT = process.env.PORT || 3000;

const OFFICIAL_WEB =
    "https://czskengglobalranking.lovable.app/";

const DB_FILE = "./database.json";

if (!TOKEN) {
    console.error("❌ DISCORD_TOKEN NIE JE NASTAVENÝ!");
    process.exit(1);
}

// =====================================================
// CLIENT
// =====================================================

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// =====================================================
// DATABASE
// =====================================================

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(
                DB_FILE,
                JSON.stringify(
                    {
                        users: {},
                        testers: {},
                        ranks: []
                    },
                    null,
                    2
                )
            );
        }

        const db = JSON.parse(
            fs.readFileSync(DB_FILE, "utf8")
        );

        if (!db.users) db.users = {};
        if (!db.testers) db.testers = {};
        if (!db.ranks) db.ranks = [];

        return db;

    } catch (error) {
        console.error("❌ Chyba databázy:", error);

        return {
            users: {},
            testers: {},
            ranks: []
        };
    }
}

function saveDB(db) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(db, null, 2)
    );
}

// =====================================================
// EMBED THEMES
// =====================================================

const THEMES = {

    classic: {
        name: "Classic",
        emoji: "⬜",
        color: 0x5865F2,
        image: null
    },

    aurora: {
        name: "Aurora",
        emoji: "🌌",
        color: 0x57F287,
        image:
            "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=85"
    },

    fire: {
        name: "Fire",
        emoji: "🔥",
        color: 0xFF4500,
        image:
            "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=1600&q=85"
    },

    snow: {
        name: "Snow",
        emoji: "❄️",
        color: 0xDDEEFF,
        image:
            "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=85"
    },

    ice: {
        name: "Ice",
        emoji: "🧊",
        color: 0x74C0FC,
        image:
            "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=1600&q=85"
    },

    ocean: {
        name: "Ocean",
        emoji: "🌊",
        color: 0x3498DB,
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
    },

    forest: {
        name: "Forest",
        emoji: "🌲",
        color: 0x2ECC71,
        image:
            "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85"
    },

    volcano: {
        name: "Volcano",
        emoji: "🌋",
        color: 0xC0392B,
        image:
            "https://images.unsplash.com/photo-1497606818532-8b2a5f0e4c9b?auto=format&fit=crop&w=1600&q=85"
    },

    lightning: {
        name: "Lightning",
        emoji: "⚡",
        color: 0xF1C40F,
        image:
            "https://images.unsplash.com/photo-1605727216801-e27ce1d0f34c?auto=format&fit=crop&w=1600&q=85"
    },

    meteor: {
        name: "Meteor",
        emoji: "☄️",
        color: 0xE67E22,
        image:
            "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=85"
    },

    shadow: {
        name: "Shadow",
        emoji: "🌑",
        color: 0x191919,
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85"
    },

    diamond: {
        name: "Diamond",
        emoji: "💎",
        color: 0x00FFFF,
        image:
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85"
    },

    gold: {
        name: "Gold",
        emoji: "🥇",
        color: 0xFFD700,
        image:
            "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=85"
    },

    rainbow: {
        name: "Rainbow",
        emoji: "🌈",
        color: 0xFF66CC,
        image:
            "https://images.unsplash.com/photo-1500759285222-a95626b934cb?auto=format&fit=crop&w=1600&q=85"
    },

    galaxy: {
        name: "Galaxy",
        emoji: "🪐",
        color: 0x9B59B6,
        image:
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=85"
    },

    sunset: {
        name: "Sunset",
        emoji: "🌅",
        color: 0xFF7675,
        image:
            "https://images.unsplash.com/photo-1472120435266-53107fd0f44a?auto=format&fit=crop&w=1600&q=85"
    },

    storm: {
        name: "Storm",
        emoji: "⛈️",
        color: 0x546E7A,
        image:
            "https://images.unsplash.com/photo-1605727216801-e27ce1d0f34c?auto=format&fit=crop&w=1600&q=85"
    },

    cyber: {
        name: "Cyber",
        emoji: "💻",
        color: 0x00FFCC,
        image:
            "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=85"
    },

    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        image:
            "https://images.unsplash.com/photo-1607513746994-51f730a44832?auto=format&fit=crop&w=1600&q=85"
    },

    toxic: {
        name: "Toxic",
        emoji: "☢️",
        color: 0xA8FF00,
        image:
            "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&q=85"
    },

    blood: {
        name: "Blood",
        emoji: "🩸",
        color: 0x8B0000,
        image:
            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85"
    }
};

// =====================================================
// USER THEME
// =====================================================

function getUserTheme(userId) {
    const db = loadDB();

    const themeKey =
        db.users[userId]?.theme || "classic";

    return THEMES[themeKey] || THEMES.classic;
}

// =====================================================
// CREATE EMBED
// =====================================================

function createEmbed({
    userId,
    title,
    description,
    color,
    fields = [],
    thumbnail = null
}) {
    const theme = getUserTheme(userId);

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color ?? theme.color);

    if (description) {
        embed.setDescription(description);
    }

    if (fields.length > 0) {
        embed.addFields(fields);
    }

    if (thumbnail) {
        embed.setThumbnail(thumbnail);
    }

    if (theme.image) {
        embed.setImage(theme.image);
    }

    embed.addFields({
        name: "🌐 Official Tier Web",
        value:
            `[CZ/SK/EN Global Ranking](${OFFICIAL_WEB})`
    });

    embed.setFooter({
        text:
            `CZ/SK/EN Global Ranking • ${theme.emoji} ${theme.name}`
    });

    embed.setTimestamp();

    return embed;
}

// =====================================================
// SLASH COMMANDS
// =====================================================

const commands = [

    // =================================================
    // PING
    // =================================================

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Skontroluje, či bot funguje"
        ),

    // =================================================
    // HELP
    // =================================================

    new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Zobrazí všetky príkazy"
        ),

    // =================================================
    // EMBED
    // =================================================

    new SlashCommandBuilder()
        .setName("embed")
        .setDescription(
            "Nastaví osobný embed motív"
        )

        .addStringOption(option =>
            option
                .setName("theme")
                .setDescription(
                    "Vyber embed motív"
                )
                .setRequired(true)

                .addChoices(
                    {
                        name: "⬜ Classic — bez obrázka",
                        value: "classic"
                    },
                    {
                        name: "🌌 Aurora — polárna žiara",
                        value: "aurora"
                    },
                    {
                        name: "🔥 Fire — oheň/plamene",
                        value: "fire"
                    },
                    {
                        name: "❄️ Snow — zasnežená krajina",
                        value: "snow"
                    },
                    {
                        name: "🧊 Ice — ľadovec",
                        value: "ice"
                    },
                    {
                        name: "🌊 Ocean — oceán",
                        value: "ocean"
                    },
                    {
                        name: "🌲 Forest — les",
                        value: "forest"
                    },
                    {
                        name: "🌋 Volcano — sopka",
                        value: "volcano"
                    },
                    {
                        name: "⚡ Lightning — blesky",
                        value: "lightning"
                    },
                    {
                        name: "☄️ Meteor — meteor",
                        value: "meteor"
                    },
                    {
                        name: "🌑 Shadow — temná noc",
                        value: "shadow"
                    },
                    {
                        name: "💎 Diamond — diamanty",
                        value: "diamond"
                    },
                    {
                        name: "🥇 Gold — zlato",
                        value: "gold"
                    },
                    {
                        name: "🌈 Rainbow — dúha",
                        value: "rainbow"
                    },
                    {
                        name: "🪐 Galaxy — galaxia",
                        value: "galaxy"
                    },
                    {
                        name: "🌅 Sunset — západ slnka",
                        value: "sunset"
                    },
                    {
                        name: "⛈️ Storm — búrka",
                        value: "storm"
                    },
                    {
                        name: "💻 Cyber — cyberpunk",
                        value: "cyber"
                    },
                    {
                        name: "⛏️ Minecraft — Minecraft motív",
                        value: "minecraft"
                    },
                    {
                        name: "☢️ Toxic — toxická zóna",
                        value: "toxic"
                    },
                    {
                        name: "🩸 Blood — krvavý motív",
                        value: "blood"
                    }
                )
        )

        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(
                    "Používateľ, ktorému nastavíš motív"
                )
                .setRequired(false)
        ),

    // =================================================
    // ADD RANK
    // =================================================

    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription(
            "Pridá výsledok rank testu"
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
                    "Výsledok testu"
                )
                .setRequired(true)

                .addChoices(
                    {
                        name: "🟢 Rank UP",
                        value: "UP"
                    },
                    {
                        name: "🔴 Rank DOWN",
                        value: "DOWN"
                    },
                    {
                        name: "⚪ Bez zmeny",
                        value: "SAME"
                    }
                )
        )

        .addIntegerOption(option =>
            option
                .setName("rounds")
                .setDescription(
                    "Počet kôl"
                )
                .setMinValue(1)
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription(
                    "Hodnotenie"
                )
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription(
                    "Poznámka"
                )
                .setRequired(false)
        ),

    // =================================================
    // SET TESTER
    // =================================================

    new SlashCommandBuilder()
        .setName("settester")
        .setDescription(
            "Povýši používateľa na testera"
        )

        .addUserOption(option =>
            option
                .setName("tester")
                .setDescription(
                    "Používateľ"
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
                .setName("rank")
                .setDescription(
                    "Rank testera"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("specializacia")
                .setDescription(
                    "Špecializácia"
                )
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription(
                    "Hodnotenie testera"
                )
                .setRequired(false)
        )

        .addIntegerOption(option =>
            option
                .setName("testy")
                .setDescription(
                    "Počet testov"
                )
                .setMinValue(0)
                .setRequired(false)
        )

        .addIntegerOption(option =>
            option
                .setName("uspesne_testy")
                .setDescription(
                    "Počet úspešných testov"
                )
                .setMinValue(0)
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("uspesnost")
                .setDescription(
                    "Manuálna úspešnosť, napr. 85%"
                )
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription(
                    "Ďalšia poznámka"
                )
                .setRequired(false)
        ),

    // =================================================
    // TESTER INFO
    // =================================================

    new SlashCommandBuilder()
        .setName("testerinfo")
        .setDescription(
            "Zobrazí informácie o testerovi"
        )

        .addUserOption(option =>
            option
                .setName("tester")
                .setDescription(
                    "Tester"
                )
                .setRequired(false)
        ),

    // =================================================
    // TESTERS
    // =================================================

    new SlashCommandBuilder()
        .setName("testers")
        .setDescription(
            "Zobrazí zoznam aktívnych testerov"
        ),

    // =================================================
    // REMOVE TESTER
    // =================================================

    new SlashCommandBuilder()
        .setName("removetester")
        .setDescription(
            "Odoberie testerovi status"
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
                .setRequired(false)
        )
];

// =====================================================
// REGISTER COMMANDS
// =====================================================

async function registerCommands() {

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    const commandData =
        commands.map(command =>
            command.toJSON()
        );

    console.log(
        "🔄 Registrujem slash príkazy..."
    );

    await rest.put(
        Routes.applicationGuildCommands(
            client.user.id,
            GUILD_ID
        ),
        {
            body: commandData
        }
    );

    console.log(
        `✅ Zaregistrovaných ${commandData.length} slash príkazov.`
    );

    console.log(
        commandData
            .map(command =>
                `/${command.name}`
            )
            .join(" | ")
    );
}

// =====================================================
// READY
// =====================================================

client.once(
    "ready",
    async () => {

        console.log(
            "================================"
        );

        console.log(
            "🤖 DISCORD BOT ONLINE"
        );

        console.log(
            `👤 ${client.user.tag}`
        );

        console.log(
            `🆔 ${client.user.id}`
        );

        console.log(
            "================================"
        );

        client.user.setActivity(
            "Global Ranking 🏆"
        );

        try {

            await registerCommands();

        } catch (error) {

            console.error(
                "❌ REGISTRÁCIA PRÍKAZOV ZLYHALA:"
            );

            console.error(error);
        }
    }
);

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

                const embed =
                    createEmbed({

                        userId:
                            interaction.user.id,

                        title:
                            "🏓 PONG!",

                        description:
                            `Bot funguje!\n\nLatency: **${client.ws.ping} ms**`
                    });

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

                const embed =
                    createEmbed({

                        userId:
                            interaction.user.id,

                        title:
                            "🏆 CZ/SK/EN GLOBAL RANKING",

                        description:
                            "Dostupné príkazy:",

                        fields: [

                            {
                                name:
                                    "🎨 /embed",
                                value:
                                    "Nastaví osobný embed motív."
                            },

                            {
                                name:
                                    "🏆 /addrank",
                                value:
                                    "Pridá výsledok rank testu."
                            },

                            {
                                name:
                                    "🧪 /settester",
                                value:
                                    "Povýši používateľa na testera."
                            },

                            {
                                name:
                                    "👤 /testerinfo",
                                value:
                                    "Zobrazí profil testera."
                            },

                            {
                                name:
                                    "👥 /testers",
                                value:
                                    "Zobrazí aktívnych testerov."
                            },

                            {
                                name:
                                    "🚫 /removetester",
                                value:
                                    "Odoberie testerovi status."
                            },

                            {
                                name:
                                    "🏓 /ping",
                                value:
                                    "Skontroluje stav botu."
                            }
                        ]
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // EMBED
            // =================================================

            if (
                interaction.commandName ===
                "embed"
            ) {

                const themeKey =
                    interaction.options.getString(
                        "theme",
                        true
                    );

                const target =
                    interaction.options.getUser(
                        "user"
                    ) ||
                    interaction.user;

                const theme =
                    THEMES[themeKey];

                if (!theme) {

                    return interaction.reply({
                        content:
                            "❌ Neplatný motív.",
                        ephemeral:
                            true
                    });
                }

                if (
                    target.id !==
                    interaction.user.id
                ) {

                    if (
                        !interaction.memberPermissions?.has(
                            PermissionFlagsBits.Administrator
                        )
                    ) {

                        return interaction.reply({
                            content:
                                "❌ Na nastavenie motívu inému používateľovi potrebuješ Administrator.",
                            ephemeral:
                                true
                        });
                    }
                }

                const db =
                    loadDB();

                if (
                    !db.users[target.id]
                ) {
                    db.users[target.id] = {};
                }

                db.users[target.id].theme =
                    themeKey;

                db.users[target.id].updatedBy =
                    interaction.user.id;

                db.users[target.id].updatedAt =
                    new Date().toISOString();

                saveDB(db);

                const embed =
                    createEmbed({

                        userId:
                            target.id,

                        title:
                            `${theme.emoji} EMBED MOTÍV NASTAVENÝ`,

                        description:
                            `Pre používateľa <@${target.id}> bol nastavený motív **${theme.name}**.`,

                        fields: [

                            {
                                name:
                                    "👤 Používateľ",
                                value:
                                    `<@${target.id}>`,
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎨 Motív",
                                value:
                                    `${theme.emoji} ${theme.name}`,
                                inline:
                                    true
                            },

                            {
                                name:
                                    "👑 Nastavil",
                                value:
                                    `<@${interaction.user.id}>`,
                                inline:
                                    true
                            }
                        ]
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
            // ADMIN CHECK
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

                if (
                    !interaction.memberPermissions?.has(
                        PermissionFlagsBits.Administrator
                    )
                ) {

                    return interaction.reply({
                        content:
                            "❌ Tento príkaz môže používať iba Administrator.",
                        ephemeral:
                            true
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
                        "hrac",
                        true
                    );

                const gamemode =
                    interaction.options.getString(
                        "gamemode",
                        true
                    );

                const previousRank =
                    interaction.options.getString(
                        "previous_rank",
                        true
                    );

                const newRank =
                    interaction.options.getString(
                        "new_rank",
                        true
                    );

                const status =
                    interaction.options.getString(
                        "status",
                        true
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

                let result;
                let color;

                if (
                    status ===
                    "UP"
                ) {

                    result =
                        "🟢 RANK UP";

                    color =
                        0x57F287;

                } else if (
                    status ===
                    "DOWN"
                ) {

                    result =
                        "🔴 RANK DOWN";

                    color =
                        0xED4245;

                } else {

                    result =
                        "⚪ BEZ ZMENY";

                    color =
                        0x95A5A6;
                }

                const fields = [

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
                            "📉 Predošlý rank",
                        value:
                            previousRank,
                        inline:
                            true
                    },

                    {
                        name:
                            "📈 Nový rank",
                        value:
                            newRank,
                        inline:
                            true
                    },

                    {
                        name:
                            "🔄 Kôl",
                        value:
                            rounds !== null
                                ? String(rounds)
                                : "None",
                        inline:
                            true
                    }
                ];

                fields.push({
                    name:
                        "⭐ Hodnotenie",
                    value:
                        rating || "None"
                });

                fields.push({
                    name:
                        "📝 Poznámka",
                    value:
                        note || "None"
                });

                const db =
                    loadDB();

                db.ranks.push({

                    player:
                        player.id,

                    gamemode,

                    previousRank,

                    newRank,

                    status,

                    rounds:
                        rounds !== null
                            ? rounds
                            : "None",

                    rating:
                        rating || "None",

                    note:
                        note || "None",

                    tester:
                        interaction.user.id,

                    createdAt:
                        new Date().toISOString()
                });

                saveDB(db);

                const embed =
                    createEmbed({

                        userId:
                            player.id,

                        title:
                            `${result} • 🏆 RANK TEST`,

                        description:
                            `## ${player.username}`,

                        color,

                        fields,

                        thumbnail:
                            player.displayAvatarURL()
                    });

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
                        "tester",
                        true
                    );

                const gamemode =
                    interaction.options.getString(
                        "gamemode",
                        true
                    );

                const rank =
                    interaction.options.getString(
                        "rank",
                        true
                    );

                const specialization =
                    interaction.options.getString(
                        "specializacia"
                    ) ||
                    "None";

                const rating =
                    interaction.options.getString(
                        "hodnotenie"
                    ) ||
                    "None";

                const tests =
                    interaction.options.getInteger(
                        "testy"
                    );

                const successful =
                    interaction.options.getInteger(
                        "uspesne_testy"
                    );

                const successRate =
                    interaction.options.getString(
                        "uspesnost"
                    ) ||
                    "None";

                const note =
                    interaction.options.getString(
                        "poznamka"
                    ) ||
                    "None";

                const db =
                    loadDB();

                db.testers[tester.id] = {

                    userId:
                        tester.id,

                    gamemode,

                    rank,

                    specialization,

                    rating,

                    tests:
                        tests !== null
                            ? tests
                            : "None",

                    successful:
                        successful !== null
                            ? successful
                            : "None",

                    successRate,

                    note,

                    promotedBy:
                        interaction.user.id,

                    promotedAt:
                        new Date().toISOString(),

                    active:
                        true
                };

                saveDB(db);

                const embed =
                    createEmbed({

                        userId:
                            tester.id,

                        title:
                            "🧪 NOVÝ TESTER",

                        description:
                            `## ${tester.username}\nPoužívateľ bol povýšený na testera.`,

                        fields: [

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
                                    "🧪 Testy",
                                value:
                                    String(
                                        tests !== null
                                            ? tests
                                            : "None"
                                    ),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné testy",
                                value:
                                    String(
                                        successful !== null
                                            ? successful
                                            : "None"
                                    ),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "📈 Úspešnosť",
                                value:
                                    successRate,
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎯 Špecializácia",
                                value:
                                    specialization
                            },

                            {
                                name:
                                    "⭐ Hodnotenie",
                                value:
                                    rating
                            },

                            {
                                name:
                                    "👑 Povýšil",
                                value:
                                    `<@${interaction.user.id}>`
                            },

                            {
                                name:
                                    "📝 Poznámka",
                                value:
                                    note
                            }
                        ],

                        thumbnail:
                            tester.displayAvatarURL()
                    });

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

                const user =
                    interaction.options.getUser(
                        "tester"
                    ) ||
                    interaction.user;

                const db =
                    loadDB();

                const tester =
                    db.testers[user.id];

                if (
                    !tester ||
                    !tester.active
                ) {

                    return interaction.reply({
                        content:
                            "❌ Tento používateľ nie je aktívny tester.",
                        ephemeral:
                            true
                    });
                }

                const embed =
                    createEmbed({

                        userId:
                            user.id,

                        title:
                            `🧪 TESTER • ${user.username}`,

                        fields: [

                            {
                                name:
                                    "🎮 Gamemode",
                                value:
                                    tester.gamemode || "None",
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🏅 Rank",
                                value:
                                    tester.rank || "None",
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Testy",
                                value:
                                    String(
                                        tester.tests ??
                                        "None"
                                    ),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné testy",
                                value:
                                    String(
                                        tester.successful ??
                                        "None"
                                    ),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "📈 Úspešnosť",
                                value:
                                    tester.successRate ??
                                    "None",
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎯 Špecializácia",
                                value:
                                    tester.specialization ||
                                    "None"
                            },

                            {
                                name:
                                    "⭐ Hodnotenie",
                                value:
                                    tester.rating ||
                                    "None"
                            },

                            {
                                name:
                                    "👑 Povýšil",
                                value:
                                    tester.promotedBy
                                        ? `<@${tester.promotedBy}>`
                                        : "None"
                            },

                            {
                                name:
                                    "📝 Poznámka",
                                value:
                                    tester.note ||
                                    "None"
                            }
                        ],

                        thumbnail:
                            user.displayAvatarURL()
                    });

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

                const db =
                    loadDB();

                const testers =
                    Object.values(
                        db.testers
                    ).filter(
                        tester =>
                            tester.active
                    );

                let text;

                if (
                    testers.length === 0
                ) {

                    text =
                        "Momentálne nemáme žiadnych aktívnych testerov.";

                } else {

                    text =
                        testers
                            .map(
                                (tester, index) =>
                                    `**${index + 1}.** <@${tester.userId}> — **${tester.rank || "None"}** • ${tester.gamemode || "None"}`
                            )
                            .join("\n");
                }

                const embed =
                    createEmbed({

                        userId:
                            interaction.user.id,

                        title:
                            "🧪 AKTÍVNI TESTERI",

                        fields: [

                            {
                                name:
                                    "🧪 Aktívni testeri",
                                value:
                                    text
                            }
                        ]
                    });

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
                        "tester",
                        true
                    );

                const reason =
                    interaction.options.getString(
                        "dovod"
                    ) ||
                    "None";

                const db =
                    loadDB();

                if (
                    !db.testers[tester.id] ||
                    !db.testers[tester.id].active
                ) {

                    return interaction.reply({
                        content:
                            "❌ Tento používateľ nie je aktívny tester.",
                        ephemeral:
                            true
                    });
                }

                db.testers[tester.id].active =
                    false;

                db.testers[tester.id].removedBy =
                    interaction.user.id;

                db.testers[tester.id].removedAt =
                    new Date().toISOString();

                db.testers[tester.id].removeReason =
                    reason;

                saveDB(db);

                const embed =
                    createEmbed({

                        userId:
                            tester.id,

                        title:
                            "🚫 TESTER ODOBRATÝ",

                        description:
                            `<@${tester.id}> už nie je aktívnym testerom.`,

                        color:
                            0xED4245,

                        fields: [

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
                                    reason
                            }
                        ]
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

        } catch (error) {

            console.error(
                "❌ CHYBA PRI SPRACOVANÍ PRÍKAZU:"
            );

            console.error(error);

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({
                    content:
                        "❌ Pri vykonávaní príkazu nastala chyba.",
                    ephemeral:
                        true
                }).catch(() => {});
            }
        }
    }
);

// =====================================================
// KEEP ALIVE SERVER
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
            "CZ/SK/EN Global Ranking Bot ONLINE"
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
    "🔄 Spúšťam Discord bot..."
);

client.login(TOKEN)
    .then(() => {

        console.log(
            "🔑 Discord login úspešný."
        );

    })
    .catch(error => {

        console.error(
            "❌ Discord login zlyhal:"
        );

        console.error(error);

        process.exit(1);
    });
