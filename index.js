const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const http = require("http");

// ======================================================
// NASTAVENIE
// ======================================================

const TOKEN = process.env.DISCORD_TOKEN;

const CLIENT_ID = process.env.CLIENT_ID || "1535739014760632330";

const GUILD_ID = "1523657617698984038";

if (!TOKEN) {
    console.error("❌ DISCORD_TOKEN nie je nastavený!");
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
// EMBED STYLY
// ======================================================

const STYLES = {
    aurora: {
        name: "Polárna žiara",
        emoji: "🌌",
        color: 0x57F287,
        text: "Northern Lights • Aurora Borealis"
    },

    snow: {
        name: "Sneženie",
        emoji: "❄️",
        color: 0xDDEEFF,
        text: "Zimná snehová atmosféra"
    },

    fire: {
        name: "Oheň",
        emoji: "🔥",
        color: 0xFF4500,
        text: "Horúca ohnivá atmosféra"
    },

    ice: {
        name: "Ľad",
        emoji: "🧊",
        color: 0x00BFFF,
        text: "Mrazivá ľadová atmosféra"
    },

    ocean: {
        name: "Oceán",
        emoji: "🌊",
        color: 0x0077FF,
        text: "Deep Ocean"
    },

    space: {
        name: "Vesmír",
        emoji: "🚀",
        color: 0x6C5CE7,
        text: "Deep Space"
    },

    galaxy: {
        name: "Galaxia",
        emoji: "🌠",
        color: 0x9B59B6,
        text: "Galaxy"
    },

    sunset: {
        name: "Západ slnka",
        emoji: "🌅",
        color: 0xFF7675,
        text: "Golden Sunset"
    },

    storm: {
        name: "Búrka",
        emoji: "⛈️",
        color: 0x5865F2,
        text: "Thunderstorm"
    },

    rainbow: {
        name: "Dúha",
        emoji: "🌈",
        color: 0xFF69B4,
        text: "Rainbow"
    },

    forest: {
        name: "Les",
        emoji: "🌲",
        color: 0x228B22,
        text: "Deep Forest"
    },

    desert: {
        name: "Púšť",
        emoji: "🏜️",
        color: 0xE6A23C,
        text: "Desert"
    },

    volcano: {
        name: "Sopka",
        emoji: "🌋",
        color: 0xC0392B,
        text: "Volcano"
    },

    toxic: {
        name: "Toxic",
        emoji: "☢️",
        color: 0xA3FF12,
        text: "Toxic Zone"
    },

    cyber: {
        name: "Cyber",
        emoji: "💻",
        color: 0x00FFCC,
        text: "Cyber World"
    },

    blood: {
        name: "Blood",
        emoji: "🩸",
        color: 0x8B0000,
        text: "Dark Blood"
    },

    shadow: {
        name: "Shadow",
        emoji: "🌑",
        color: 0x202020,
        text: "Dark Shadow"
    },

    diamond: {
        name: "Diamant",
        emoji: "💎",
        color: 0x00FFFF,
        text: "Diamond"
    },

    gold: {
        name: "Gold",
        emoji: "🏆",
        color: 0xFFD700,
        text: "Golden Style"
    },

    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        text: "Minecraft Style"
    }
};

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
        .setDescription("Pridá hráčovi výsledok rank testu")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )

        .addUserOption(option =>
            option
                .setName("hrac")
                .setDescription("Hráč")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Napíš ľubovoľný gamemode")
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("previous_rank")
                .setDescription("Predošlý rank - ľubovoľný text")
                .setRequired(true)
                .setMaxLength(50)
        )

        .addStringOption(option =>
            option
                .setName("new_rank")
                .setDescription("Nový rank - ľubovoľný text")
                .setRequired(true)
                .setMaxLength(50)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription("Voliteľná poznámka")
                .setRequired(false)
                .setMaxLength(1000)
        )

        .addStringOption(option =>
            option
                .setName("status")
                .setDescription("Výsledok testu")
                .setRequired(false)
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
);

// ======================================================
// /embed
// ======================================================

const embedCommand = new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Vytvorí tematický Discord embed")
    .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator.toString()
    )

    .addUserOption(option =>
        option
            .setName("hrac")
            .setDescription("Komu je embed určený")
            .setRequired(true)
    )

    .addStringOption(option =>
        option
            .setName("styl")
            .setDescription("Vyber tematický štýl")
            .setRequired(true)
            .addChoices(
                { name: "🌌 Polárna žiara", value: "aurora" },
                { name: "❄️ Sneženie", value: "snow" },
                { name: "🔥 Oheň", value: "fire" },
                { name: "🧊 Ľad", value: "ice" },
                { name: "🌊 Oceán", value: "ocean" },
                { name: "🚀 Vesmír", value: "space" },
                { name: "🌠 Galaxia", value: "galaxy" },
                { name: "🌅 Západ slnka", value: "sunset" },
                { name: "⛈️ Búrka", value: "storm" },
                { name: "🌈 Dúha", value: "rainbow" },
                { name: "🌲 Les", value: "forest" },
                { name: "🏜️ Púšť", value: "desert" },
                { name: "🌋 Sopka", value: "volcano" },
                { name: "☢️ Toxic", value: "toxic" },
                { name: "💻 Cyber", value: "cyber" },
                { name: "🩸 Blood", value: "blood" },
                { name: "🌑 Shadow", value: "shadow" },
                { name: "💎 Diamant", value: "diamond" },
                { name: "🏆 Gold", value: "gold" },
                { name: "⛏️ Minecraft", value: "minecraft" }
            )
    )

    .addStringOption(option =>
        option
            .setName("text")
            .setDescription("Voliteľný text embedu")
            .setRequired(false)
            .setMaxLength(1500)
    );

commands.push(embedCommand);

// ======================================================
// /help
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí všetky príkazy")
);

// ======================================================
// /ping
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Skontroluje stav bota")
);

// ======================================================
// /serverinfo
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Informácie o serveri")
);

// ======================================================
// /styles
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("styles")
        .setDescription("Zobrazí všetky dostupné embed štýly")
);

// ======================================================
// REGISTRÁCIA PRÍKAZOV
// ======================================================

async function registerCommands() {

    console.log("🔄 Registrujem slash príkazy na server...");

    const rest = new REST({
        version: "10",
        timeout: 15000
    }).setToken(TOKEN);

    try {

        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: commands.map(command =>
                    command.toJSON()
                )
            }
        );

        console.log(
            "✅ Slash príkazy boli úspešne zaregistrované!"
        );

    } catch (error) {

        console.error(
            "❌ Chyba pri registrácii príkazov:"
        );

        console.error(error);

        throw error;
    }
}

// ======================================================
// INTERACTIONS
// ======================================================

client.on(
    "interactionCreate",
    async interaction => {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        try {

            // ==================================================
            // PING
            // ==================================================

            if (interaction.commandName === "ping") {

                const ping =
                    client.ws.ping;

                const embed =
                    new EmbedBuilder()
                        .setColor(0x57F287)
                        .setTitle("🏓 Pong!")
                        .setDescription(
                            "Bot funguje správne."
                        )
                        .addFields({
                            name: "📡 Discord Ping",
                            value: `${ping} ms`,
                            inline: true
                        })
                        .setTimestamp();

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ==================================================
            // HELP
            // ==================================================

            if (interaction.commandName === "help") {

                const embed =
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle("🤖 CZ/SK/EN Rank Bot")
                        .setDescription(
                            "Minecraft Rank System"
                        )
                        .addFields(
                            {
                                name: "🏆 Rank System",
                                value:
                                    "`/addrank` — pridá výsledok rank testu\n" +
                                    "`/embed` — vytvorí tematický embed",
                                inline: false
                            },
                            {
                                name: "🎨 Embed",
                                value:
                                    "`/styles` — všetky dostupné štýly",
                                inline: false
                            },
                            {
                                name: "🛠️ Utility",
                                value:
                                    "`/ping` — stav bota\n" +
                                    "`/serverinfo` — informácie o serveri\n" +
                                    "`/help` — pomoc",
                                inline: false
                            }
                        )
                        .setFooter({
                            text: "Rank Bot"
                        })
                        .setTimestamp();

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ==================================================
            // STYLES
            // ==================================================

            if (interaction.commandName === "styles") {

                let text = "";

                for (const key in STYLES) {

                    const style =
                        STYLES[key];

                    text +=
                        `${style.emoji} **${style.name}** — \`/embed\` → ${key}\n`;
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(0x9B59B6)
                        .setTitle("🎨 Embed štýly")
                        .setDescription(text)
                        .setFooter({
                            text: "Vyber si štýl cez /embed"
                        });

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // ==================================================
            // SERVERINFO
            // ==================================================

            if (
                interaction.commandName === "serverinfo"
            ) {

                if (!interaction.guild) {

                    return interaction.reply({
                        content:
                            "❌ Tento príkaz musíš použiť na serveri.",
                        ephemeral: true
                    });
                }

                const guild =
                    interaction.guild;

                const embed =
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle(
                            "🏰 " + guild.name
                        )
                        .setThumbnail(
                            guild.iconURL() || undefined
                        )
                        .addFields(
                            {
                                name: "👥 Členovia",
                                value:
                                    String(
                                        guild.memberCount
                                    ),
                                inline: true
                            },
                            {
                                name: "🆔 Server ID",
                                value:
                                    guild.id,
                                inline: true
                            }
                        )
                        .setTimestamp();

                return interaction.reply({
                    embeds: [embed]
                });
            }

            // =================================================
