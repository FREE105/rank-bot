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

const DB_FILE = "./testers.json";

if (!TOKEN) {
    console.error("❌ CHÝBA DISCORD_TOKEN!");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// =====================================================
// THEMES
// =====================================================

const THEMES = {
    aurora: {
        color: 0x57F287,
        image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=85"
    },
    fire: {
        color: 0xFF4500,
        image: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=1600&q=85"
    },
    snow: {
        color: 0xDDEEFF,
        image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=85"
    },
    ice: {
        color: 0x74C0FC,
        image: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=1600&q=85"
    },
    ocean: {
        color: 0x3498DB,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
    },
    forest: {
        color: 0x2ECC71,
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85"
    },
    volcano: {
        color: 0xC0392B,
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=85"
    },
    lightning: {
        color: 0xF1C40F,
        image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0f34c?auto=format&fit=crop&w=1600&q=85"
    },
    galaxy: {
        color: 0x9B59B6,
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=85"
    },
    minecraft: {
        color: 0x55AA55,
        image: "https://images.unsplash.com/photo-1607513746994-51f730a44832?auto=format&fit=crop&w=1600&q=85"
    }
};

function getTheme(text) {
    const t = String(text || "").toLowerCase();

    if (
        t.includes("fire") ||
        t.includes("flame") ||
        t.includes("oheň") ||
        t.includes("ohen")
    ) return THEMES.fire;

    if (
        t.includes("snow") ||
        t.includes("sneh") ||
        t.includes("winter") ||
        t.includes("zima")
    ) return THEMES.snow;

    if (
        t.includes("ice") ||
        t.includes("ľad") ||
        t.includes("lad")
    ) return THEMES.ice;

    if (
        t.includes("ocean") ||
        t.includes("water") ||
        t.includes("voda") ||
        t.includes("sea") ||
        t.includes("more")
    ) return THEMES.ocean;

    if (
        t.includes("forest") ||
        t.includes("les") ||
        t.includes("jungle")
    ) return THEMES.forest;

    if (
        t.includes("volcano") ||
        t.includes("sopka")
    ) return THEMES.volcano;

    if (
        t.includes("lightning") ||
        t.includes("thunder") ||
        t.includes("blesk")
    ) return THEMES.lightning;

    if (
        t.includes("galaxy") ||
        t.includes("galaxia") ||
        t.includes("space") ||
        t.includes("vesmir") ||
        t.includes("vesmír")
    ) return THEMES.galaxy;

    if (
        t.includes("minecraft") ||
        t.includes("bedrock") ||
        t.includes("java")
    ) return THEMES.minecraft;

    if (
        t.includes("aurora") ||
        t.includes("polarna") ||
        t.includes("polárna") ||
        t.includes("northern")
    ) return THEMES.aurora;

    return THEMES.aurora;
}

function official(embed) {
    embed.addFields({
        name: "🌐 Official Tier Web",
        value: `[Otvoriť Official Tier Web](${OFFICIAL_WEB})`
    });

    embed.setFooter({
        text: "CZ/SK/EN Global Ranking • Tier System"
    });

    embed.setTimestamp();

    return embed;
}

// =====================================================
// DATABASE
// =====================================================

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, "{}");
        }

        return JSON.parse(
            fs.readFileSync(DB_FILE, "utf8")
        );
    } catch {
        return {};
    }
}

function saveDB(db) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(db, null, 2)
    );
}

// =====================================================
// COMMANDS
// =====================================================

const commands = [

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Skontroluje stav botu"),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí všetky príkazy"),

    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription("Pridá výsledok rank testu")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )
        .addUserOption(o =>
            o.setName("hrac")
                .setDescription("Testovaný hráč")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("gamemode")
                .setDescription("Gamemode")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("previous_rank")
                .setDescription("Predošlý rank")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("new_rank")
                .setDescription("Nový rank")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("status")
                .setDescription("Výsledok")
                .setRequired(true)
                .addChoices(
                    { name: "🟢 Rank UP", value: "UP" },
                    { name: "🔴 Rank DOWN", value: "DOWN" },
                    { name: "⚪ Bez zmeny", value: "SAME" }
                )
        )
        .addIntegerOption(o =>
            o.setName("rounds")
                .setDescription("Počet rounds")
                .setMinValue(1)
        )
        .addStringOption(o =>
            o.setName("hodnotenie")
                .setDescription("Hodnotenie")
        )
        .addStringOption(o =>
            o.setName("poznamka")
                .setDescription("Poznámka")
        ),

    new SlashCommandBuilder()
        .setName("settester")
        .setDescription("Povýši používateľa na testera")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )
        .addUserOption(o =>
            o.setName("tester")
                .setDescription("Kto sa stáva testerom")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("gamemode")
                .setDescription("POVINNÉ - Free Text Gamemode")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("rank")
                .setDescription("Rank testera")
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("skusenosti")
                .setDescription("Skúsenosti / XP")
                .setRequired(true)
                .setMinValue(0)
        )
        .addStringOption(o =>
            o.setName("specializacia")
                .setDescription("Špecializácia")
        )
        .addStringOption(o =>
            o.setName("hodnotenie")
                .setDescription("Hodnotenie")
        )
        .addIntegerOption(o =>
            o.setName("testy")
                .setDescription("Počet testov")
                .setMinValue(0)
        )
        .addIntegerOption(o =>
            o.setName("uspesne_testy")
                .setDescription("Počet úspešných testov")
                .setMinValue(0)
        )
        .addStringOption(o =>
            o.setName("poznamka")
                .setDescription("Poznámka")
        ),

    new SlashCommandBuilder()
        .setName("testerinfo")
        .setDescription("Zobrazí profil testera")
        .addUserOption(o =>
            o.setName("tester")
                .setDescription("Tester")
        ),

    new SlashCommandBuilder()
        .setName("testers")
        .setDescription("Zobrazí všetkých testerov"),

    new SlashCommandBuilder()
        .setName("removetester")
        .setDescription("Odoberie testera")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )
        .addUserOption(o =>
            o.setName("tester")
                .setDescription("Tester")
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName("dovod")
                .setDescription("Dôvod")
        )
];

// =====================================================
// REGISTER COMMANDS
// =====================================================

async function registerCommands() {

    // DÔLEŽITÉ:
    // Použijeme ID samotného prihláseného bota.
    // Žiadny CLIENT_ID environment variable netreba.

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    console.log("🔄 Registrujem slash commands...");

    await rest.put(
        Routes.applicationGuildCommands(
            client.user.id,
            GUILD_ID
        ),
        {
            body: commands.map(c => c.toJSON())
        }
    );

    console.log(
        `✅ ${commands.length} slash commands zaregistrovaných na serveri ${GUILD_ID}`
    );
}

// =====================================================
// READY
// =====================================================

client.once("ready", async () => {

    console.log("=================================");
    console.log("🤖 BOT JE ONLINE");
    console.log(`👤 ${client.user.tag}`);
    console.log(`🆔 ${client.user.id}`);
    console.log("=================================");

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
});

// =====================================================
// INTERACTIONS
// =====================================================

client.on(
    "interactionCreate",
    async interaction => {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        try {

            // ---------------------------------------------
            // PING
            // ---------------------------------------------

            if (interaction.commandName === "ping") {

                const embed =
                    new EmbedBuilder()
                        .setColor(THEMES.aurora.color)
                        .setTitle("🌌 BOT ONLINE")
                        .setDescription(
                            `🤖 **${client.user.tag}**\n🏓 Ping: **${client.ws.ping} ms**`
                        )
                        .setImage(THEMES.aurora.image);

                official(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ---------------------------------------------
            // HELP
            // ---------------------------------------------

            if (interaction.commandName === "help") {

                const embed =
                    new EmbedBuilder()
                        .setColor(THEMES.aurora.color)
                        .setTitle("🏆 CZ/SK/EN GLOBAL RANKING")
                        .setDescription(
                            "Kompletný systém pre rank testy a testerov."
                        )
                        .addFields(

                            {
                                name: "🏆 Rank",
                                value:
                                    "`/addrank`\nPridanie výsledku testu."
                            },

                            {
                                name: "🧪 Tester",
                                value:
                                    "`/settester`\nPovýšenie používateľa na testera."
                            },

                            {
                                name: "👤 Tester profil",
                                value:
                                    "`/testerinfo`\nInformácie o testerovi."
                            },

                            {
                                name: "👥 Testeri",
                                value:
                                    "`/testers`\nZoznam testerov."
                            },

                            {
                                name: "🚫 Remove",
                                value:
                                    "`/removetester`\nOdstránenie testera."
                            },

                            {
                                name: "🌐 Web",
                                value:
                                    `[Official Tier Web](${OFFICIAL_WEB})`
                            }
                        )
                        .setImage(THEMES.aurora.image);

                official(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ---------------------------------------------
            // ADMIN CHECK
            // ---------------------------------------------

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

            // ---------------------------------------------
            // ADD RANK
            // ---------------------------------------------

            if (interaction.commandName === "addrank") {

                const player =
                    interaction.options.getUser("hrac");

                const gamemode =
                    interaction.options.getString("gamemode");

                const previous =
                    interaction.options.getString("previous_rank");

                const newRank =
                    interaction.options.getString("new_rank");

                const status =
                    interaction.options.getString("status");

                const rounds =
                    interaction.options.getInteger("rounds");

                const rating =
                    interaction.options.getString("hodnotenie");

                const note =
                    interaction.options.getString("poznamka");

                const theme =
                    getTheme(gamemode);

                let result;
                let color;

                if (status === "UP") {
                    result = "🟢 RANK UP";
                    color = 0x57F287;
                } else if (status === "DOWN") {
                    result = "🔴 RANK DOWN";
                    color = 0xED4245;
                } else {
                    result = "⚪ BEZ ZMENY";
                    color = 0x95A5A6;
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle(
                            `${result} • 🏆 RANK TEST`
                        )
                        .setDescription(
                            `## ${player.username}`
                        )
                        .setThumbnail(
                            player.displayAvatarURL()
                        )
                        .addFields(

                            {
                                name: "👤 Hráč",
                                value: `<@${player.id}>`,
                                inline: true
                            },

                            {
                                name: "🎮 Gamemode",
                                value: gamemode,
                                inline: true
                            },

                            {
                                name: "🧪 Tester",
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            },

                            {
                                name: "📉 Previous Rank",
                                value: previous,
                                inline: true
                            },

                            {
                                name: "📈 New Rank",
                                value: newRank,
                                inline: true
                            },

                            {
                                name: "🔄 Rounds",
                                value: rounds
                                    ? String(rounds)
                                    : "Neuvedené",
                                inline: true
                            }
                        )
                        .setImage(theme.image);

                if (rating) {
                    embed.addFields({
                        name: "⭐ Hodnotenie",
                        value: rating
                    });
                }

                if (note) {
                    embed.addFields({
                        name: "📝 Poznámka",
                        value: note
                    });
                }

                official(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ---------------------------------------------
            // SET TESTER
            // ---------------------------------------------

            if (interaction.commandName === "settester") {

                const tester =
                    interaction.options.getUser("tester");

                const gamemode =
                    interaction.options.getString("gamemode");

                const rank =
                    interaction.options.getString("rank");

                const xp =
                    interaction.options.getInteger("skusenosti");

                const specialization =
                    interaction.options.getString("specializacia")
                    || "Neuvedená";

                const rating =
                    interaction.options.getString("hodnotenie")
                    || "Neuvedené";

                const tests =
                    interaction.options.getInteger("testy")
                    ?? 0;

                const successful =
                    interaction.options.getInteger("uspesne_testy")
                    ?? 0;

                const note =
                    interaction.options.getString("poznamka")
                    || "Žiadna poznámka";

                const db = loadDB();

                db[tester.id] = {
                    userId: tester.id,
                    username: tester.username,
                    gamemode,
                    rank,
                    xp,
                    specialization,
                    rating,
                    tests,
                    successful,
                    note,
                    promotedBy: interaction.user.id,
                    promotedAt: new Date().toISOString(),
                    active: true
                };

                saveDB(db);

                const theme =
                    getTheme(gamemode);

                const percentage =
                    tests > 0
                        ? Math.round(
                            successful / tests * 100
                        )
                        : 0;

                const embed =
                    new EmbedBuilder()
                        .setColor(theme.color)
                        .setTitle(
                            "🧪 NOVÝ TESTER"
                        )
                        .setDescription(
                            `## ${tester.username}\nPoužívateľ bol povýšený na testera.`
                        )
                        .setThumbnail(
                            tester.displayAvatarURL()
                        )
                        .addFields(

                            {
                                name: "👤 Tester",
                                value: `<@${tester.id}>`,
                                inline: true
                            },

                            {
                                name: "🎮 Gamemode",
                                value: gamemode,
                                inline: true
                            },

                            {
                                name: "🏅 Rank",
                                value: rank,
                                inline: true
                            },

                            {
                                name: "⭐ XP",
                                value: String(xp),
                                inline: true
                            },

                            {
                                name: "🧪 Testy",
                                value: String(tests),
                                inline: true
                            },

                            {
                                name: "✅ Úspešné",
                                value: String(successful),
                                inline: true
                            },

                            {
                                name: "📈 Úspešnosť",
                                value: `${percentage}%`,
                                inline: true
                            },

                            {
                                name: "🎯 Špecializácia",
                                value: specialization
                            },

                            {
                                name: "⭐ Hodnotenie",
                                value: rating
                            },

                            {
                                name: "👑 Povýšil",
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            },

                            {
                                name: "📝 Poznámka",
                                value: note
                            }
                        )
                        .setImage(theme.image);

                official(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ---------------------------------------------
            // TESTER INFO
            // ---------------------------------------------

            if (interaction.commandName === "testerinfo") {

                const user =
                    interaction.options.getUser("tester")
                    || interaction.user;

                const db = loadDB();
                const data = db[user.id];

                if (!data || !data.active) {
                    return interaction.reply({
                        content:
                            "❌ Tento používateľ nie je aktívny tester.",
                        ephemeral: true
                    });
                }

                const theme =
                    getTheme(data.gamemode);

                const percentage =
                    data.tests > 0
                        ? Math.round(
                            data.successful /
                            data.tests *
                            100
                        )
                        : 0;

                const embed =
                    new EmbedBuilder()
                        .setColor(theme.color)
                        .setTitle(
                            `🧪 TESTER PROFILE • ${user.username}`
                        )
                        .setThumbnail(
                            user.displayAvatarURL()
                        )
                        .addFields(

                            {
                                name: "🎮 Gamemode",
                                value: data.gamemode,
                                inline: true
                            },

                            {
                                name: "🏅 Rank",
                                value: data.rank,
                                inline: true
                            },

                            {
                                name: "⭐ XP",
                                value: String(data.xp),
                                inline: true
                            },

                            {
                                name: "🧪 Testy",
                                value: String(data.tests),
                                inline: true
                            },

                            {
                                name: "✅ Úspešné",
                                value: String(data.successful),
                                inline: true
                            },

                            {
                                name: "📈 Úspešnosť",
                                value: `${percentage}%`,
                                inline: true
                            },

                            {
                                name: "🎯 Špecializácia",
                                value: data.specialization
                            },

                            {
                                name: "⭐ Hodnotenie",
                                value: data.rating
                            },

                            {
                                name: "👑 Povýšil",
                                value: `<@${data.promotedBy}>`
                            },

                            {
                                name: "📝 Poznámka",
                                value: data.note
                            }
                        )
                        .setImage(theme.image);

                official(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ---------------------------------------------
            // TESTERS
            // ---------------------------------------------

            if (interaction.commandName === "testers") {

                const db = loadDB();

                const testers =
                    Object.values(db)
                        .filter(x => x.active);

                const embed =
                    new EmbedBuilder()
                        .setColor(THEMES.aurora.color)
                        .setTitle("🧪 AKTÍVNI TESTERI")
                        .setImage(THEMES.aurora.image);

                if (testers.length === 0) {

                    embed.setDescription(
                        "Momentálne nemáme žiadnych aktívnych testerov."
                    );

                } else {

                    embed.setDescription(
                        testers
                            .map(
                                (x, i) =>
                                    `**${i + 1}.** <@${x.userId}> — **${x.rank}** • ${x.gamemode} • ⭐ ${x.xp} XP`
                            )
                            .join("\n")
                    );
                }

                official(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ---------------------------------------------
            // REMOVE TESTER
            // ---------------------------------------------

            if (
                interaction.commandName ===
                "removetester"
            ) {

                const tester =
                    interaction.options.getUser("tester");

                const reason =
                    interaction.options.getString("dovod")
                    || "Bez dôvodu";

                const db = loadDB();

                if (!db[tester.id] || !db[tester.id].active) {

                    return interaction.reply({
                        content:
                            "❌ Tento používateľ nie je aktívny tester.",
                        ephemeral: true
                    });
                }

                db[tester.id].active = false;
                db[tester.id].removedBy =
                    interaction.user.id;
                db[tester.id].removedAt =
                    new Date().toISOString();
                db[tester.id].removeReason =
                    reason;

                saveDB(db);

                const embed =
                    new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle(
                            "🚫 TESTER ODOBRATÝ"
                        )
                        .setDescription(
                            `<@${tester.id}> už nie je aktívnym testerom.`
                        )
                        .addFields(
                            {
                                name: "👤 Tester",
                                value: `<@${tester.id}>`,
                                inline: true
                            },
                            {
                                name: "👑 Odobral",
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            },
                            {
                                name: "📝 Dôvod",
                                value: reason
                            }
                        )
                        .setImage(
                            THEMES.aurora.image
                        );

                official(embed);

                return interaction.reply({
                    embeds: [embed]
                });
            }

        } catch (error) {

            console.error(
                "❌ CHYBA COMMANDU:",
                error
            );

            if (!interaction.replied) {

                await interaction.reply({
                    content:
                        "❌ Nastala chyba. Pozri konzolu botu.",
                    ephemeral: true
                });
            }
        }
    }
);

// =====================================================
// KEEP ALIVE
// =====================================================

http.createServer((req, res) => {
    res.writeHead(200);
    res.end("CZ/SK/EN Global Ranking Bot ONLINE");
}).listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 Web server beží na porte ${PORT}`);
});

// =====================================================
// LOGIN
// =====================================================

console.log("🔄 Spúšťam Discord bot...");

client.login(TOKEN)
    .catch(error => {
        console.error("❌ DISCORD LOGIN ERROR:");
        console.error(error);
        process.exit(1);
    });
