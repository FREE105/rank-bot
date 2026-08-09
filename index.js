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

// ======================================================
// CONFIG
// ======================================================

const TOKEN = process.env.DISCORD_TOKEN;

const CLIENT_ID =
    process.env.CLIENT_ID ||
    "1535978914843729970";

const GUILD_ID =
    process.env.GUILD_ID ||
    "1523657617698984038";

const PORT =
    process.env.PORT ||
    10000;

const OFFICIAL_WEB =
    "https://czskengglobalranking.lovable.app/";

// ======================================================
// TOKEN CHECK
// ======================================================

if (!TOKEN) {
    console.error(
        "❌ DISCORD_TOKEN nie je nastavený v Environment Variables!"
    );

    process.exit(1);
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
// DATABASE
// ======================================================

const DATABASE_FILE =
    "./testers.json";

function loadTesters() {

    try {

        if (!fs.existsSync(DATABASE_FILE)) {

            fs.writeFileSync(
                DATABASE_FILE,
                "{}"
            );

            return {};
        }

        return JSON.parse(
            fs.readFileSync(
                DATABASE_FILE,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "❌ Chyba pri načítaní databázy:",
            error
        );

        return {};
    }
}

function saveTesters(data) {

    try {

        fs.writeFileSync(
            DATABASE_FILE,
            JSON.stringify(
                data,
                null,
                2
            )
        );

    } catch (error) {

        console.error(
            "❌ Chyba pri ukladaní databázy:",
            error
        );
    }
}

// ======================================================
// OFFICIAL WEB
// ======================================================

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
            "CZ/SK/EN Tier Bot • Official Tier System"
    });

    return embed;
}

// ======================================================
// COMMANDS
// ======================================================

const commands = [];

// ======================================================
// /addrank
// ======================================================

commands.push(

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
                    "Hráč, ktorý bol testovaný"
                )
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription(
                    "Gamemode – ľubovoľný text"
                )
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("previous_rank")
                .setDescription(
                    "Predošlý rank – ľubovoľný text"
                )
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("new_rank")
                .setDescription(
                    "Nový rank – ľubovoľný text"
                )
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("status")
                .setDescription(
                    "Výsledok testu"
                )
                .setRequired(false)
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

        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription(
                    "Hodnotenie hráča"
                )
                .setRequired(false)
                .setMaxLength(500)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription(
                    "Ľubovoľná poznámka"
                )
                .setRequired(false)
                .setMaxLength(1000)
        )

        .addIntegerOption(option =>
            option
                .setName("rounds")
                .setDescription(
                    "Počet kôl testu"
                )
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100)
        )
);

// ======================================================
// /settester
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName("settester")

        .setDescription(
            "Nastaví používateľa ako testera"
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )

        // ==============================================
        // TESTER
        // ==============================================

        .addUserOption(option =>
            option
                .setName("tester")
                .setDescription(
                    "Používateľ, ktorý sa stáva testerom"
                )
                .setRequired(true)
        )

        // ==============================================
        // GAMEMODE - POVINNÝ FREE TEXT
        // ==============================================

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription(
                    "Gamemode testera – ľubovoľný text"
                )
                .setRequired(true)
                .setMaxLength(100)
        )

        // ==============================================
        // RANK - POVINNÝ
        // ==============================================

        .addStringOption(option =>
            option
                .setName("rank")
                .setDescription(
                    "Rank testera"
                )
                .setRequired(true)
                .setMaxLength(100)
        )

        // ==============================================
        // XP - POVINNÉ
        // ==============================================

        .addIntegerOption(option =>
            option
                .setName("skusenosti")
                .setDescription(
                    "Počet skúseností / XP"
                )
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(1000000)
        )

        // ==============================================
        // SPECIALIZÁCIA
        // ==============================================

        .addStringOption(option =>
            option
                .setName("specializacia")
                .setDescription(
                    "Špecializácia testera"
                )
                .setRequired(false)
                .setMaxLength(200)
        )

        // ==============================================
        // HODNOTENIE
        // ==============================================

        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription(
                    "Hodnotenie testera"
                )
                .setRequired(false)
                .setMaxLength(500)
        )

        // ==============================================
        // TESTY
        // ==============================================

        .addIntegerOption(option =>
            option
                .setName("testy")
                .setDescription(
                    "Počet vykonaných testov"
                )
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(1000000)
        )

        // ==============================================
        // ÚSPEŠNÉ TESTY
        // ==============================================

        .addIntegerOption(option =>
            option
                .setName("uspesne_testy")
                .setDescription(
                    "Počet úspešných testov"
                )
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(1000000)
        )

        // ==============================================
        // POZNÁMKA
        // ==============================================

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription(
                    "Ľubovoľná poznámka"
                )
                .setRequired(false)
                .setMaxLength(1000)
        )
);

// ======================================================
// /testerinfo
// ======================================================

commands.push(

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
                .setRequired(false)
        )
);

// ======================================================
// /testers
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName("testers")

        .setDescription(
            "Zobrazí zoznam testerov"
        )
);

// ======================================================
// /removetester
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName("removetester")

        .setDescription(
            "Odoberie používateľovi status testera"
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
                    "Dôvod odobratia"
                )
                .setRequired(false)
                .setMaxLength(500)
        )
);

// ======================================================
// /help
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName("help")

        .setDescription(
            "Zobrazí pomoc"
        )
);

// ======================================================
// /ping
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName("ping")

        .setDescription(
            "Skontroluje stav bota"
        )
);

// ======================================================
// /serverinfo
// ======================================================

commands.push(

    new SlashCommandBuilder()

        .setName("serverinfo")

        .setDescription(
            "Informácie o serveri"
        )
);

// ======================================================
// REGISTER COMMANDS
// ======================================================

async function registerCommands() {

    console.log(
        "🔄 Registrujem slash príkazy..."
    );

    const rest =
        new REST({
            version: "10"
        }).setToken(TOKEN);

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

// ======================================================
// ADMIN CHECK
// ======================================================

function isAdmin(
    interaction
) {

    return (

        interaction.memberPermissions &&

        interaction.memberPermissions.has(
            PermissionFlagsBits.Administrator
        )
    );
}

// ======================================================
// INTERACTION CREATE
// ======================================================

client.on(
    "interactionCreate",

    async interaction => {

        if (
            !interaction.isChatInputCommand()
        ) {
            return;
        }

        try {

            // ==================================================
            // PING
            // ==================================================

            if (
                interaction.commandName ===
                "ping"
            ) {

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x57F287
                        )

                        .setTitle(
                            "🏓 Pong!"
                        )

                        .setDescription(
                            `Bot funguje správne!\n\n📡 Ping: **${client.ws.ping} ms**`
                        )

                        .setTimestamp();

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

            // ==================================================
            // HELP
            // ==================================================

            if (
                interaction.commandName ===
                "help"
            ) {

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x5865F2
                        )

                        .setTitle(
                            "🤖 CZ/SK/EN Tier Bot"
                        )

                        .setDescription(
                            "Minecraft Rank & Tier Test System"
                        )

                        .addFields(

                            {
                                name:
                                    "🏆 Rank System",

                                value:
                                    "`/addrank` — výsledok rank testu\n" +
                                    "`/settester` — nastaví testera\n" +
                                    "`/testerinfo` — profil testera\n" +
                                    "`/testers` — zoznam testerov\n" +
                                    "`/removetester` — odoberie testera"
                            },

                            {
                                name:
                                    "🛠️ Utility",

                                value:
                                    "`/ping` — stav bota\n" +
                                    "`/serverinfo` — informácie o serveri\n" +
                                    "`/help` — pomoc"
                            }
                        )

                        .setTimestamp();

                addOfficialWeb(
                    embed
                );

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

            // ==================================================
            // SERVERINFO
            // ==================================================

            if (
                interaction.commandName ===
                "serverinfo"
            ) {

                if (
                    !interaction.guild
                ) {

                    return interaction.reply({
                        content:
                            "❌ Tento príkaz musíš použiť na serveri.",

                        ephemeral:
                            true
                    });
                }

                const guild =
                    interaction.guild;

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x5865F2
                        )

                        .setTitle(
                            `🏰 ${guild.name}`
                        )

                        .setThumbnail(
                            guild.iconURL() ||
                            undefined
                        )

                        .addFields(

                            {
                                name:
                                    "👥 Členovia",

                                value:
                                    String(
                                        guild.memberCount
                                    ),

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🆔 Server ID",

                                value:
                                    guild.id,

                                inline:
                                    true
                            }
                        )

                        .setTimestamp();

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

            // ==================================================
            // ADMIN COMMANDS
            // ==================================================

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
                    !isAdmin(
                        interaction
                    )
                ) {

                    return interaction.reply({

                        content:
                            "❌ Tento príkaz môže používať iba používateľ s oprávnením Administrator.",

                        ephemeral:
                            true
                    });
                }
            }

            // ==================================================
            // ADDRANK
            // ==================================================

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
                    ) ||
                    "SAME";

                const rating =
                    interaction.options.getString(
                        "hodnotenie"
                    );

                const note =
                    interaction.options.getString(
                        "poznamka"
                    );

                const rounds =
                    interaction.options.getInteger(
                        "rounds"
                    );

                const tester =
                    interaction.user;

                let statusText =
                    "⚪ BEZ ZMENY";

                let color =
                    0x5865F2;

                if (
                    status ===
                    "UP"
                ) {

                    statusText =
                        "🟢 RANK UP";

                    color =
                        0x57F287;
                }

                if (
                    status ===
                    "DOWN"
                ) {

                    statusText =
                        "🔴 RANK DOWN";

                    color =
                        0xED4245;
                }

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            color
                        )

                        .setTitle(
                            "🏆 Rank Test"
                        )

                        .setDescription(
                            `## 👤 ${player.username}\nVýsledok rank testu`
                        )

                        .setThumbnail(
                            player.displayAvatarURL()
                        )

                        .addFields(

                            {
                                name:
                                    "👤 Hráč",

                                value:
                                    `<@${player.id}>\n\`${player.username}\``,

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
                                    `<@${tester.id}>\n\`${tester.username}\``,

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
                                    "📊 Status",

                                value:
                                    statusText,

                                inline:
                                    true
                            }
                        )

                        .setTimestamp();

                if (
                    rounds !== null
                ) {

                    embed.addFields({

                        name:
                            "🔄 Rounds",

                        value:
                            String(
                                rounds
                            ),

                        inline:
                            true
                    });
                }

                if (
                    rating
                ) {

                    embed.addFields({

                        name:
                            "⭐ Hodnotenie",

                        value:
                            rating,

                        inline:
                            false
                    });
                }

                if (
                    note
                ) {

                    embed.addFields({

                        name:
                            "📝 Poznámka",

                        value:
                            note,

                        inline:
                            false
                    });
                }

                addOfficialWeb(
                    embed
                );

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

            // ==================================================
            // SETTESTER
            // ==================================================

            if (
                interaction.commandName ===
                "settester"
            ) {

                const tester =
                    interaction.options.getUser(
                        "tester"
                    );

                // POVINNÝ GAMEMODE
                const gamemode =
                    interaction.options.getString(
                        "gamemode"
                    );

                // POVINNÝ RANK
                const rank =
                    interaction.options.getString(
                        "rank"
                    );

                // POVINNÉ XP
                const experience =
                    interaction.options.getInteger(
                        "skusenosti"
                    );

                const specialization =
                    interaction.options.getString(
                        "specializacia"
                    );

                const rating =
                    interaction.options.getString(
                        "hodnotenie"
                    );

                const tests =
                    interaction.options.getInteger(
                        "testy"
                    ) ??
                    0;

                const successfulTests =
                    interaction.options.getInteger(
                        "uspesne_testy"
                    ) ??
                    0;

                const note =
                    interaction.options.getString(
                        "poznamka"
                    );

                const promotedBy =
                    interaction.user;

                const now =
                    new Date();

                const testers =
                    loadTesters();

                // ==========================================
                // SAVE TESTER
                // ==========================================

                testers[
                    tester.id
                ] = {

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
                        specialization ||
                        "Neuvedená",

                    rating:
                        rating ||
                        "Neuvedené",

                    tests:
                        tests,

                    successfulTests:
                        successfulTests,

                    note:
                        note ||
                        "Žiadna poznámka",

                    promotedBy: {

                        id:
                            promotedBy.id,

                        username:
                            promotedBy.username
                    },

                    promotedAt:
                        now.toISOString(),

                    active:
                        true
                };

                saveTesters(
                    testers
                );

                // ==========================================
                // SUCCESS RATE
                // ==========================================

                const successRate =
                    tests > 0

                        ? Math.round(
                            (
                                successfulTests /
                                tests
                            ) *
                            100
                        )

                        : 0;

                // ==========================================
                // EMBED
                // ==========================================

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x57F287
                        )

                        .setTitle(
                            "🧪 Nový Tester"
                        )

                        .setDescription(
                            `## 🎉 ${tester.username}\nPoužívateľ bol úspešne nastavený ako tester.`
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
                                    "⭐ Skúsenosti",

                                value:
                                    `${experience} XP`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Testy",

                                value:
                                    String(
                                        tests
                                    ),

                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné testy",

                                value:
                                    String(
                                        successfulTests
                                    ),

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
                                    specialization ||
                                    "Neuvedená",

                                inline:
                                    false
                            },

                            {
                                name:
                                    "⭐ Hodnotenie",

                                value:
                                    rating ||
                                    "Neuvedené",

                                inline:
                                    false
                            },

                            {
                                name:
                                    "👑 Povýšil",

                                value:
                                    `<@${promotedBy.id}>`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "📅 Dátum",

                                value:
                                    `<t:${Math.floor(
                                        now.getTime() /
                                        1000
                                    )}:F>`,

                                inline:
                                    true
                            }
                        )

                        .setTimestamp();

                if (
                    note
                ) {

                    embed.addFields({

                        name:
                            "📝 Poznámka",

                        value:
                            note,

                        inline:
                            false
                    });
                }

                addOfficialWeb(
                    embed
                );

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

            // ==================================================
            // TESTERINFO
            // ==================================================

            if (
                interaction.commandName ===
                "testerinfo"
            ) {

                const selectedUser =
                    interaction.options.getUser(
                        "tester"
                    ) ||
                    interaction.user;

                const testers =
                    loadTesters();

                const data =
                    testers[
                        selectedUser.id
                    ];

                if (
                    !data ||
                    !data.active
                ) {

                    return interaction.reply({

                        content:
                            `❌ ${selectedUser.username} nie je evidovaný ako tester.`,

                        ephemeral:
                            true
                    });
                }

                const successRate =
                    data.tests > 0

                        ? Math.round(
                            (
                                data.successfulTests /
                                data.tests
                            ) *
                            100
                        )

                        : 0;

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x5865F2
                        )

                        .setTitle(
                            "🧪 Tester Profile"
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
                                    data.gamemode ||
                                    "Neuvedený",

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
                                    "⭐ Skúsenosti",

                                value:
                                    `${data.experience} XP`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    "🧪 Testy",

                                value:
                                    String(
                                        data.tests
                                    ),

                                inline:
                                    true
                            },

                            {
                                name:
                                    "✅ Úspešné",

                                value:
                                    String(
                                        data.successfulTests
                                    ),

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
                            }
                        )

                        .setTimestamp();

                if (
                    data.note &&
                    data.note !==
                        "Žiadna poznámka"
                ) {

                    embed.addFields({

                        name:
                            "📝 Poznámka",

                        value:
                            data.note,

                        inline:
                            false
                    });
                }

                addOfficialWeb(
                    embed
                );

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

            // ==================================================
            // TESTERS
            // ==================================================

            if (
                interaction.commandName ===
                "testers"
            ) {

                const testers =
                    loadTesters();

                const activeTesters =
                    Object.values(
                        testers
                    ).filter(
                        tester =>
                            tester.active
                    );

                if (
                    activeTesters.length ===
                    0
                ) {

                    return interaction.reply({

                        content:
                            "🧪 Momentálne nie sú evidovaní žiadni testeri."
                    });
                }

                const list =
                    activeTesters

                        .slice(
                            0,
                            25
                        )

                        .map(
                            (
                                tester,
                                index
                            ) =>

                                `${index + 1}. <@${tester.userId}> — **${tester.rank}** • 🎮 ${tester.gamemode} • ${tester.experience} XP`
                        )

                        .join(
                            "\n"
                        );

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0x57F287
                        )

                        .setTitle(
                            "🧪 Testeri"
                        )

                        .setDescription(
                            list
                        )

                        .setTimestamp();

                embed.setFooter({
                    text:
                        `Počet testerov: ${activeTesters.length}`
                });

                addOfficialWeb(
                    embed
                );

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

            // ==================================================
            // REMOVE TESTER
            // ==================================================

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
                    "Bez uvedeného dôvodu";

                const testers =
                    loadTesters();

                if (
                    !testers[
                        tester.id
                    ] ||
                    !testers[
                        tester.id
                    ].active
                ) {

                    return interaction.reply({

                        content:
                            "❌ Tento používateľ nie je aktívny tester.",

                        ephemeral:
                            true
                    });
                }

                testers[
                    tester.id
                ].active =
                    false;

                testers[
                    tester.id
                ].removedBy = {

                    id:
                        interaction.user.id,

                    username:
                        interaction.user.username
                };

                testers[
                    tester.id
                ].removedAt =
                    new Date().toISOString();

                testers[
                    tester.id
                ].removeReason =
                    reason;

                saveTesters(
                    testers
                );

                const embed =
                    new EmbedBuilder()

                        .setColor(
                            0xED4245
                        )

                        .setTitle(
                            "🚫 Tester odobratý"
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

                        .setTimestamp();

                addOfficialWeb(
                    embed
                );

                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }

        } catch (error) {

            console.error(
                "❌ Interaction error:"
            );

            console.error(
                error
            );

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

// ======================================================
// READY
// ======================================================

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
            "========================================"
        );

        client.user.setActivity(
            "Minecraft Rank System"
        );

        try {

            await registerCommands();

        } catch (error) {

            console.error(
                "❌ Registrácia slash príkazov zlyhala:"
            );

            console.error(
                error
            );
        }
    }
);

// ======================================================
// HTTP SERVER
// ======================================================

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
            "CZ/SK/EN Tier Bot is online!"
        );
    }

).listen(

    PORT,

    "0.0.0.0",

    () => {

        console.log(
            `🌐 HTTP server beží na porte ${PORT}`
        );
    }
);

// ======================================================
// LOGIN
// ======================================================

console.log(
    "🔄 Skúšam pripojiť Discord..."
);

client.login(
    TOKEN
)

.then(() => {

    console.log(
        "🔐 Discord login OK"
    );

})

.catch(error => {

    console.error(
        "❌ Discord login zlyhal:"
    );

    console.error(
        error
    );

    process.exit(1);
});
