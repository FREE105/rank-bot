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

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = "1523657617698984038";
const PORT = process.env.PORT || 3000;

const OFFICIAL_WEB =
    "https://czskengglobalranking.lovable.app/";

const DB_FILE = "./database.json";

if (!TOKEN) {
    console.error("❌ DISCORD_TOKEN nie je nastavený!");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

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
        image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=85"
    },

    fire: {
        name: "Fire",
        emoji: "🔥",
        color: 0xFF4500,
        image: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=1600&q=85"
    },

    snow: {
        name: "Snow",
        emoji: "❄️",
        color: 0xDDEEFF,
        image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=85"
    },

    ice: {
        name: "Ice",
        emoji: "🧊",
        color: 0x74C0FC,
        image: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=1600&q=85"
    },

    ocean: {
        name: "Ocean",
        emoji: "🌊",
        color: 0x3498DB,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
    },

    forest: {
        name: "Forest",
        emoji: "🌲",
        color: 0x2ECC71,
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85"
    },

    volcano: {
        name: "Volcano",
        emoji: "🌋",
        color: 0xC0392B,
        image: "https://images.unsplash.com/photo-1497606818532-8b2a5f0e4c9b?auto=format&fit=crop&w=1600&q=85"
    },

    lightning: {
        name: "Lightning",
        emoji: "⚡",
        color: 0xF1C40F,
        image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0f34c?auto=format&fit=crop&w=1600&q=85"
    },

    meteor: {
        name: "Meteor",
        emoji: "☄️",
        color: 0xE67E22,
        image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=85"
    },

    shadow: {
        name: "Shadow",
        emoji: "🌑",
        color: 0x191919,
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85"
    },

    diamond: {
        name: "Diamond",
        emoji: "💎",
        color: 0x00FFFF,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85"
    },

    gold: {
        name: "Gold",
        emoji: "🥇",
        color: 0xFFD700,
        image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=85"
    },

    rainbow: {
        name: "Rainbow",
        emoji: "🌈",
        color: 0xFF66CC,
        image: "https://images.unsplash.com/photo-1500759285222-a95626b934cb?auto=format&fit=crop&w=1600&q=85"
    },

    galaxy: {
        name: "Galaxy",
        emoji: "🪐",
        color: 0x9B59B6,
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=85"
    },

    sunset: {
        name: "Sunset",
        emoji: "🌅",
        color: 0xFF7675,
        image: "https://images.unsplash.com/photo-1472120435266-53107fd0f44a?auto=format&fit=crop&w=1600&q=85"
    },

    storm: {
        name: "Storm",
        emoji: "⛈️",
        color: 0x546E7A,
        image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0f34c?auto=format&fit=crop&w=1600&q=85"
    },

    cyber: {
        name: "Cyber",
        emoji: "💻",
        color: 0x00FFCC,
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=85"
    },

    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        image: "https://images.unsplash.com/photo-1607513746994-51f730a44832?auto=format&fit=crop&w=1600&q=85"
    },

    toxic: {
        name: "Toxic",
        emoji: "☢️",
        color: 0xA8FF00,
        image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&q=85"
    },

    blood: {
        name: "Blood",
        emoji: "🩸",
        color: 0x8B0000,
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85"
    }
};

// =====================================================
// DATABASE
// =====================================================

function loadDB() {

    try {

        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(
                DB_FILE,
                JSON.stringify({
                    users: {},
                    testers: {}
                }, null, 2)
            );
        }

        const data =
            JSON.parse(
                fs.readFileSync(
                    DB_FILE,
                    "utf8"
                )
            );

        if (!data.users) data.users = {};
        if (!data.testers) data.testers = {};

        return data;

    } catch (error) {

        console.error(
            "❌ Database error:",
            error
        );

        return {
            users: {},
            testers: {}
        };
    }
}

function saveDB(db) {

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(
            db,
            null,
            2
        )
    );
}

// =====================================================
// USER THEME
// =====================================================

function getUserTheme(userId) {

    const db = loadDB();

    const theme =
        db.users?.[userId]?.theme;

    if (
        theme &&
        THEMES[theme]
    ) {
        return THEMES[theme];
    }

    return THEMES.classic;
}

// =====================================================
// EMBED BUILDER
// =====================================================

function createEmbed({
    userId,
    title,
    description,
    color,
    fields = [],
    thumbnail = null
}) {

    const theme =
        getUserTheme(userId);

    const embed =
        new EmbedBuilder()
            .setColor(
                color || theme.color
            )
            .setTitle(title)
            .setDescription(
                description || null
            );

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
            `[Otvoriť Official Tier Web](${OFFICIAL_WEB})`
    });

    embed.setFooter({
        text:
            `CZ/SK/EN Global Ranking • ${theme.emoji} ${theme.name}`
    });

    embed.setTimestamp();

    return embed;
}

// =====================================================
// COMMANDS
// =====================================================

const commands = [

    // PING

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Skontroluje stav botu"
        ),

    // HELP

    new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Zobrazí všetky príkazy"
        ),

    // EMBED

    new SlashCommandBuilder()
        .setName("embed")
        .setDescription(
            "Nastaví osobný embed motív používateľa"
        )
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(
                    "Používateľ, ktorému nastavíš motív"
                )
                .setRequired(false)
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
        ),

    // ADD RANK

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
        )
        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription(
                    "Hodnotenie"
                )
        )
        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription(
                    "Poznámka"
                )
        ),

    // SET TESTER

    new SlashCommandBuilder()
        .setName("settester")
        .setDescription(
            "Povýši používateľa na testera"
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
                    "POVINNÉ — Free Text Gamemode"
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
                    "Skúsenosti / XP"
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
                    "Počet úspešných testov"
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

    // TESTER INFO

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

    // TESTERS

    new SlashCommandBuilder()
        .setName("testers")
        .setDescription(
            "Zobrazí všetkých testerov"
        ),

    // REMOVE TESTER

    new SlashCommandBuilder()
        .setName("removetester")
        .setDescription(
            "Odoberie testerovi status"
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
// REGISTER SLASH COMMANDS
// =====================================================

async function registerCommands() {

    const rest =
        new REST({
            version: "10"
        }).setToken(TOKEN);

    console.log(
        "🔄 Registrujem slash commands..."
    );

    await rest.put(
        Routes.applicationGuildCommands(
            client.user.id,
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
        `✅ ${commands.length} slash commands zaregistrovaných`
    );
}

// =====================================================
// READY
// =====================================================

client.once(
    "ready",
    async () => {

        console.log(
            "================================="
        );

        console.log(
            "🤖 BOT JE ONLINE"
        );

        console.log(
            `👤 ${client.user.tag}`
        );

        console.log(
            `🆔 ${client.user.id}`
        );

        console.log(
            "================================="
        );

        client.user.setActivity(
            "Global Ranking 🏆"
        );

        try {

            await registerCommands();

        } catch (error) {

            console.error(
                "❌ Registrácia commands zlyhala:"
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

            // =========================================
            // PING
            // =========================================

            if (
                interaction.commandName ===
                "ping"
            ) {

                const embed =
                    createEmbed({

                        userId:
                            interaction.user.id,

                        title:
                            "🌌 BOT ONLINE",

                        description:
                            `🤖 **${client.user.tag}**\n🏓 Ping: **${client.ws.ping} ms**`
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =========================================
            // HELP
            // =========================================

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
                            "Kompletný systém pre rank testy a testerov.",

                        fields: [

                            {
                                name: "🎨 Embed",
                                value:
                                    "`/embed` — nastaví osobný motív embedu."
                            },

                            {
                                name: "🏆 Rank",
                                value:
                                    "`/addrank` — pridá výsledok rank testu."
                            },

                            {
                                name: "🧪 Tester",
                                value:
                                    "`/settester` — povýši používateľa na testera."
                            },

                            {
                                name: "👤 Tester profil",
                                value:
                                    "`/testerinfo` — zobrazí profil testera."
                            },

                            {
                                name: "👥 Testeri",
                                value:
                                    "`/testers` — zobrazí všetkých testerov."
                            },

                            {
                                name: "🚫 Remove",
                                value:
                                    "`/removetester` — odoberie testera."
                            }
                        ]
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =========================================
            // EMBED
            // =========================================

            if (
                interaction.commandName ===
                "embed"
            ) {

                const selectedUser =
                    interaction.options.getUser(
                        "user"
                    ) || interaction.user;

                const themeKey =
                    interaction.options.getString(
                        "theme"
                    );

                const theme =
                    THEMES[themeKey];

                if (!theme) {

                    return interaction.reply({
                        content:
                            "❌ Tento motív neexistuje.",
                        ephemeral: true
                    });
                }

                const db =
                    loadDB();

                if (!db.users) {
                    db.users = {};
                }

                if (!db.users[selectedUser.id]) {

                    db.users[selectedUser.id] = {};
                }

                db.users[selectedUser.id].theme =
                    themeKey;

                db.users[selectedUser.id].updatedBy =
                    interaction.user.id;

                db.users[selectedUser.id].updatedAt =
                    new Date().toISOString();

                saveDB(db);

                const embed =
                    createEmbed({

                        userId:
                            selectedUser.id,

                        title:
                            `${theme.emoji} EMBED MOTÍV NASTAVENÝ`,

                        description:
                            `Motív pre **${selectedUser.username}** bol nastavený na **${theme.name}**.`,

                        fields: [

                            {
                                name: "👤 Používateľ",
                                value:
                                    `<@${selectedUser.id}>`,
                                inline: true
                            },

                            {
                                name: "🎨 Motív",
                                value:
                                    `${theme.emoji} **${theme.name}**`,
                                inline: true
                            },

                            {
                                name: "👑 Nastavil",
                                value:
                                    `<@${interaction.user.id}>`,
                                inline: true
                            }
                        ]
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =========================================
            // ADMIN COMMAND CHECK
            // =========================================

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
                        ephemeral: true
                    });
                }
            }

            // =========================================
            // ADD RANK
            // =========================================

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

                const previous =
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

                let result;
                let color;

                if (
                    status === "UP"
                ) {

                    result =
                        "🟢 RANK UP";

                    color =
                        0x57F287;

                } else if (
                    status === "DOWN"
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
                        name: "👤 Hráč",
                        value:
                            `<@${player.id}>`,
                        inline: true
                    },

                    {
                        name: "🎮 Gamemode",
                        value:
                            gamemode,
                        inline: true
                    },

                    {
                        name: "🧪 Tester",
                        value:
                            `<@${interaction.user.id}>`,
                        inline: true
                    },

                    {
                        name: "📉 Previous Rank",
                        value:
                            previous,
                        inline: true
                    },

                    {
                        name: "📈 New Rank",
                        value:
                            newRank,
                        inline: true
                    },

                    {
                        name: "🔄 Rounds",
                        value:
                            rounds
                                ? String(rounds)
                                : "Neuvedené",
                        inline: true
                    }
                ];

                if (rating) {

                    fields.push({
                        name:
                            "⭐ Hodnotenie",
                        value:
                            rating
                    });
                }

                if (note) {

                    fields.push({
                        name:
                            "📝 Poznámka",
                        value:
                            note
                    });
                }

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

            // =========================================
            // SET TESTER
            // =========================================

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

                const xp =
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

                const successful =
                    interaction.options.getInteger(
                        "uspesne_testy"
                    ) ?? 0;

                const note =
                    interaction.options.getString(
                        "poznamka"
                    ) ||
                    "Žiadna poznámka";

                const db =
                    loadDB();

                db.testers[tester.id] = {

                    userId:
                        tester.id,

                    username:
                        tester.username,

                    gamemode,

                    rank,

                    xp,

                    specialization,

                    rating,

                    tests,

                    successful,

                    note,

                    promotedBy:
                        interaction.user.id,

                    promotedAt:
                        new Date().toISOString(),

                    active:
                        true
                };

                saveDB(db);

                const percentage =
                    tests > 0
                        ? Math.round(
                            successful /
                            tests *
                            100
                        )
                        : 0;

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
                                    "⭐ XP",
                                value:
                                    String(xp),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Testy",
                                value:
                                    String(tests),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné",
                                value:
                                    String(successful),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "📈 Úspešnosť",
                                value:
                                    `${percentage}%`,
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

            // =========================================
            // TESTER INFO
            // =========================================

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

                const data =
                    db.testers[user.id];

                if (
                    !data ||
                    !data.active
                ) {

                    return interaction.reply({
                        content:
                            "❌ Tento používateľ nie je aktívny tester.",
                        ephemeral:
                            true
                    });
                }

                const percentage =
                    data.tests > 0
                        ? Math.round(
                            data.successful /
                            data.tests *
                            100
                        )
                        : 0;

                const embed =
                    createEmbed({

                        userId:
                            user.id,

                        title:
                            `🧪 TESTER PROFILE • ${user.username}`,

                        fields: [

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
                                    String(data.xp),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Testy",
                                value:
                                    String(data.tests),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné",
                                value:
                                    String(data.successful),
                                inline:
                                    true
                            },

                            {
                                name:
                                    "📈 Úspešnosť",
                                value:
                                    `${percentage}%`,
                                inline:
                                    true
                            },

                            {
                                name:
                                    "🎯 Špecializácia",
                                value:
                                    data.specialization
                            },

                            {
                                name:
                                    "⭐ Hodnotenie",
                                value:
                                    data.rating
                            },

                            {
                                name:
                                    "👑 Povýšil",
                                value:
                                    `<@${data.promotedBy}>`
                            },

                            {
                                name:
                                    "📝 Poznámka",
                                value:
                                    data.note
                            }
                        ],

                        thumbnail:
                            user.displayAvatarURL()
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =========================================
            // TESTERS
            // =========================================

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

                const fields = [];

                if (
                    testers.length === 0
                ) {

                    fields.push({
                        name:
                            "🧪 Testeri",
                        value:
                            "Momentálne nemáme žiadnych aktívnych testerov."
                    });

                } else {

                    fields.push({
                        name:
                            "🧪 Aktívni testeri",
                        value:
                            testers
                                .map(
                                    (tester, index) =>
                                        `**${index + 1}.** <@${tester.userId}> — **${tester.rank}** • ${tester.gamemode} • ⭐ ${tester.xp} XP`
                                )
                                .join("\n")
                    });
                }

                const embed =
                    createEmbed({

                        userId:
                            interaction.user.id,

                        title:
                            "🧪 AKTÍVNI TESTERI",

                        fields
                    });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =========================================
            // REMOVE TESTER
            // =========================================

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
                "❌ COMMAND ERROR:"
            );

            console.error(error);

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({
                    content:
                        "❌ Nastala chyba pri vykonávaní príkazu.",
                    ephemeral:
                        true
                });
            }
        }
    }
);

// =====================================================
// KEEP ALIVE
// =====================================================

http.createServer(
    (req, res) => {

        res.writeHead(
            200,
            {
                "Content-Type":
                    "text/plain"
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
            "❌ DISCORD LOGIN ERROR:"
        );

        console.error(error);

        process.exit(1);
    });
