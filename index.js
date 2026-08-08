```js
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const http = require("http");

// ======================================================
// NASTAVENIE
// ======================================================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = "1535739014760632330";

const RANK_EDITOR_ROLE = "Rank editor";

const PORT = process.env.PORT || 3000;

// ======================================================
// RENDER WEB SERVER
// ======================================================

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("CZ/SK/EN Rank Bot is online!");
}).listen(PORT, "0.0.0.0", () => {
    console.log(`Web server bezi na porte ${PORT}`);
});

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
    {
        name: "LT1",
        value: "LT1"
    },
    {
        name: "LT2",
        value: "LT2"
    },
    {
        name: "LT3",
        value: "LT3"
    },
    {
        name: "LT4",
        value: "LT4"
    },
    {
        name: "LT5",
        value: "LT5"
    },
    {
        name: "HT1",
        value: "HT1"
    },
    {
        name: "HT2",
        value: "HT2"
    },
    {
        name: "HT3",
        value: "HT3"
    },
    {
        name: "HT4",
        value: "HT4"
    },
    {
        name: "HT5",
        value: "HT5"
    }
];

// ======================================================
// EMBED TEMY
// ======================================================

const themes = {
    aurora: {
        label: "Polarna ziara",
        emoji: "🌌",
        colors: [0x00FF88, 0x00CCFF, 0x8A2BE2],
        effects: [
            "🌌 ✨ 💚 💙 💜 ✨ 🌌",
            "💚 🌌 ✨ 💙 ✨ 💜 🌌",
            "💙 ✨ 🌌 💜 🌌 💚 ✨"
        ]
    },

    snow: {
        label: "Snezenie",
        emoji: "❄️",
        colors: [0x9EEAFF, 0xFFFFFF, 0x72BFFF],
        effects: [
            "❄️ ❄️ ✨ ❄️ ❄️",
            "❄️ ✨ ❄️ ☃️ ❄️",
            "✨ ❄️ ❄️ ❄️ ✨"
        ]
    },

    fire: {
        label: "Ohen",
        emoji: "🔥",
        colors: [0xFF0000, 0xFF6600, 0xFFCC00],
        effects: [
            "🔥 🔥 ✨ 🔥 🔥",
            "🔥 ✨ 🔥 💥 🔥",
            "✨ 🔥 🔥 🔥 ✨"
        ]
    },

    ice: {
        label: "Lad",
        emoji: "🧊",
        colors: [0x00CCFF, 0x66E6FF, 0xFFFFFF],
        effects: [
            "🧊 ❄️ 💎 ❄️ 🧊",
            "❄️ 💎 🧊 💎 ❄️",
            "💎 🧊 ❄️ 🧊 💎"
        ]
    },

    storm: {
        label: "Burka",
        emoji: "⚡",
        colors: [0x3030A0, 0x6666FF, 0xFFFF00],
        effects: [
            "🌩️ ⚡ 🌩️ ⚡ 🌩️",
            "⚡ 🌩️ ✨ 🌩️ ⚡",
            "🌩️ ⚡ 💥 ⚡ 🌩️"
        ]
    },

    ocean: {
        label: "Ocean",
        emoji: "🌊",
        colors: [0x0066FF, 0x00CCFF, 0x0044AA],
        effects: [
            "🌊 💧 🌊 🐋 🌊",
            "💧 🌊 🐋 🌊 💧",
            "🌊 🐋 ✨ 🌊 💧"
        ]
    },

    volcano: {
        label: "Sopka",
        emoji: "🌋",
        colors: [0xFF2200, 0xFF6600, 0xFFCC00],
        effects: [
            "🌋 🔥 💥 🔥 🌋",
            "🔥 🌋 ✨ 🌋 🔥",
            "💥 🔥 🌋 🔥 💥"
        ]
    },

    tornado: {
        label: "Tornado",
        emoji: "🌪️",
        colors: [0x555555, 0x888888, 0x222222],
        effects: [
            "💨 🌪️ 💨 🌪️ 💨",
            "🌪️ 💨 ✨ 💨 🌪️",
            "💨 ✨ 🌪️ ✨ 💨"
        ]
    },

    rain: {
        label: "Dazd",
        emoji: "🌧️",
        colors: [0x3366CC, 0x6699FF, 0x99CCFF],
        effects: [
            "🌧️ 💧 ☔ 💧 🌧️",
            "💧 🌧️ 💧 ☔ 💧",
            "☔ 💧 🌧️ 💧 ☔"
        ]
    },

    rainbow: {
        label: "Duzha",
        emoji: "🌈",
        colors: [0xFF0000, 0xFF9900, 0x00CCFF],
        effects: [
            "🌈 ✨ 🌈 ✨ 🌈",
            "✨ 🌈 💫 🌈 ✨",
            "🌈 💫 ✨ 💫 🌈"
        ]
    },

    moon: {
        label: "Mesacna noc",
        emoji: "🌙",
        colors: [0x111133, 0x333366, 0x6666AA],
        effects: [
            "🌙 ⭐ 🌌 ⭐ 🌙",
            "⭐ 🌙 ✨ 🌌 ⭐",
            "🌌 ⭐ 🌙 ⭐ 🌌"
        ]
    },

    stars: {
        label: "Hviezdy",
        emoji: "⭐",
        colors: [0x111111, 0x333366, 0x663399],
        effects: [
            "⭐ ✨ 🌟 💫 ⭐",
            "✨ 🌟 ⭐ 🌟 ✨",
            "💫 ⭐ ✨ ⭐ 💫"
        ]
    },

    meteor: {
        label: "Meteority",
        emoji: "☄️",
        colors: [0x551100, 0xFF6600, 0xFFCC00],
        effects: [
            "☄️ 🔥 ✨ 🔥 ☄️",
            "🔥 ☄️ 💥 ☄️ 🔥",
            "✨ 🔥 ☄️ 🔥 ✨"
        ]
    },

    galaxy: {
        label: "Galaxy",
        emoji: "💜",
        colors: [0x240046, 0x7209B7, 0x4361EE],
        effects: [
            "💜 🌌 ✨ 💫 💜",
            "🌌 💫 💜 ✨ 🌌",
            "✨ 💜 🌌 💜 ✨"
        ]
    },

    crystal: {
        label: "Crystal",
        emoji: "💎",
        colors: [0x00FFFF, 0x00AAFF, 0x9966FF],
        effects: [
            "💎 🔷 💠 🔷 💎",
            "🔷 💠 💎 💠 🔷",
            "💠 💎 🔷 💎 💠"
        ]
    },

    forest: {
        label: "Les",
        emoji: "🌲",
        colors: [0x14532D, 0x16A34A, 0x65A30D],
        effects: [
            "🌲 🍃 🌿 🍃 🌲",
            "🍃 🌲 ✨ 🌲 🍃",
            "🌿 🍃 🌲 🍃 🌿"
        ]
    },

    autumn: {
        label: "Jesen",
        emoji: "🍂",
        colors: [0xFF6600, 0xCC3300, 0xFFCC33],
        effects: [
            "🍂 🍁 🍂 🍁 🍂",
            "🍁 🍂 ✨ 🍂 🍁",
            "🍂 ✨ 🍁 ✨ 🍂"
        ]
    },

    spring: {
        label: "Jar",
        emoji: "🌸",
        colors: [0xFF99CC, 0xFF66AA, 0x99FFCC],
        effects: [
            "🌸 🌺 🌷 🌺 🌸",
            "🌺 🌸 ✨ 🌸 🌺",
            "🌷 ✨ 🌸 ✨ 🌷"
        ]
    },

    halloween: {
        label: "Halloween",
        emoji: "🎃",
        colors: [0xFF6600, 0x663399, 0x111111],
        effects: [
            "🎃 👻 🦇 👻 🎃",
            "👻 🎃 💀 🎃 👻",
            "🦇 👻 🎃 👻 🦇"
        ]
    },

    christmas: {
        label: "Vianoce",
        emoji: "🎄",
        colors: [0xFF0000, 0x00AA44, 0xFFFFFF],
        effects: [
            "🎄 🎁 ❄️ 🎅 🎄",
            "❄️ 🎄 ✨ 🎄 ❄️",
            "🎅 ❄️ 🎁 ❄️ 🎅"
        ]
    },

    fireworks: {
        label: "Ohnostroj",
        emoji: "🎆",
        colors: [0xFF00FF, 0x00FFFF, 0xFFFF00],
        effects: [
            "🎆 ✨ 🎇 ✨ 🎆",
            "🎇 💥 🎆 💥 🎇",
            "✨ 🎆 💫 🎆 ✨"
        ]
    },

    sun: {
        label: "Slnko",
        emoji: "☀️",
        colors: [0xFFCC00, 0xFF8800, 0xFFFF66],
        effects: [
            "☀️ ✨ 🌞 ✨ ☀️",
            "🌞 ☀️ 🔥 ☀️ 🌞",
            "✨ ☀️ 🌞 ☀️ ✨"
        ]
    },

    eclipse: {
        label: "Zatmenie",
        emoji: "🌑",
        colors: [0x111111, 0x333333, 0x663300],
        effects: [
            "🌑 🌘 🌒 🌘 🌑",
            "🌘 🌑 ✨ 🌑 🌘",
            "🌒 🌘 🌑 🌘 🌒"
        ]
    },

    desert: {
        label: "Pust",
        emoji: "🏜️",
        colors: [0xCC6600, 0xFFAA33, 0xFFDD88],
        effects: [
            "🏜️ 🌵 ☀️ 🌵 🏜️",
            "🌵 🏜️ ✨ 🏜️ 🌵",
            "☀️ 🌵 🏜️ 🌵 ☀️"
        ]
    },

    tropical: {
        label: "Tropical",
        emoji: "🌺",
        colors: [0x00CC88, 0x00CCFF, 0xFF66AA],
        effects: [
            "🌺 🌴 🦜 🌊 🌺",
            "🌴 🌺 ✨ 🌺 🌴",
            "🦜 🌊 🌺 🌊 🦜"
        ]
    }
};

// ======================================================
// SLASH COMMANDS
// ======================================================

const commands = [

    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription("Pridá rank test")
        .addUserOption(option =>
            option
                .setName("hrac")
                .setDescription("Hráč")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Gamemode - voľný text")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("rank")
                .setDescription("Rank hráča")
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
                .setName("poznamka")
                .setDescription("Voliteľná poznámka")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("status")
                .setDescription("Čo sa stalo s rankom")
                .setRequired(false)
                .addChoices(
                    {
                        name: "🟢 Rank UP",
                        value: "up"
                    },
                    {
                        name: "🔴 Rank DOWN",
                        value: "down"
                    },
                    {
                        name: "⚪ Rovnaký rank",
                        value: "same"
                    }
                )
        )
        .addStringOption(option =>
            option
                .setName("predosly_rank")
                .setDescription("Predošlý rank")
                .setRequired(false)
                .addChoices(...rankChoices)
        )
        .addIntegerOption(option =>
            option
                .setName("hodnotenie")
                .setDescription("Hodnotenie testu 1-10")
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("dokaz")
                .setDescription("Odkaz na dôkaz")
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Vytvorí tematický Discord embed"),

    new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Magická 8-ball")
        .addStringOption(option =>
            option
                .setName("otazka")
                .setDescription("Tvoja otázka")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Hod mincou"),

    new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Hod kockou"),

    new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Náhodné číslo")
        .addIntegerOption(option =>
            option
                .setName("maximum")
                .setDescription("Maximum")
                .setMinValue(2)
                .setMaxValue(1000000)
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Kameň papier nožnice")
        .addStringOption(option =>
            option
                .setName("volba")
                .setDescription("Tvoja voľba")
                .setRequired(true)
                .addChoices(
                    {
                        name: "🪨 Kameň",
                        value: "rock"
                    },
                    {
                        name: "📄 Papier",
                        value: "paper"
                    },
                    {
                        name: "✂️ Nožnice",
                        value: "scissors"
                    }
                )
        ),

    new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Zahraj si sloty"),

    new SlashCommandBuilder()
        .setName("choose")
        .setDescription("Vyberie náhodnú možnosť")
        .addStringOption(option =>
            option
                .setName("moznosti")
                .setDescription("Možnosti oddelené čiarkou")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("rate")
        .setDescription("Ohodnotí niečo")
        .addStringOption(option =>
            option
                .setName("co")
                .setDescription("Čo má bot hodnotiť?")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("ship")
        .setDescription("Kompatibilita dvoch hráčov")
        .addUserOption(option =>
            option
                .setName("hrac1")
                .setDescription("Prvý hráč")
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName("hrac2")
                .setDescription("Druhý hráč")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí pomoc")

].map(command => command.toJSON());

// ======================================================
// REGISTRÁCIA PRÍKAZOV
// ======================================================

async function registerCommands() {
    console.log("Registrujem slash prikazy...");

    try {
        const rest = new REST({
            version: "10"
        }).setToken(TOKEN);

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: commands
            }
        );

        console.log("Slash prikazy boli uspesne zaregistrovane!");
    } catch (error) {
        console.error("Chyba pri registracii prikazov:", error);
    }
}

// ======================================================
// KONTROLA ROLE RANK EDITOR
// ======================================================

function isRankEditor(interaction) {
    if (!interaction.guild) {
        return false;
    }

    if (!interaction.member) {
        return false;
    }

    return interaction.member.roles.cache.some(
        role => role.name === RANK_EDITOR_ROLE
    );
}

// ======================================================
// RANK STATUS
// ======================================================

function getStatus(status) {
    if (status === "up") {
        return "🟢 **RANK UP**";
    }

    if (status === "down") {
        return "🔴 **RANK DOWN**";
    }

    return "⚪ **SAME RANK**";
}

// ======================================================
// ADD RANK EMBED
// ======================================================

function createRankEmbed(interaction) {
    const player = interaction.options.getUser("hrac");

    const gamemode =
        interaction.options.getString("gamemode");

    const rank =
        interaction.options.getString("rank");

    const tester =
        interaction.options.getUser("tester") ||
        interaction.user;

    const note =
        interaction.options.getString("poznamka") ||
        "Bez poznámky.";

    const status =
        interaction.options.getString("status") ||
        "same";

    const previousRank =
        interaction.options.getString("predosly_rank") ||
        "Neuvedené";

    const rating =
        interaction.options.getInteger("hodnotenie");

    const evidence =
        interaction.options.getString("dokaz");

    let color = 0x5865F2;

    if (status === "up") {
        color = 0x57F287;
    }

    if (status === "down") {
        color = 0xED4245;
    }

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle("🏆 RANK TEST DOKONČENÝ")
        .setDescription(
            `## 👤 ${player.username}\n` +
            `${getStatus(status)}`
        )
        .setThumbnail(
            player.displayAvatarURL({
                size: 256
            })
        )
        .addFields(
            {
                name: "🎮 Gamemode",
                value: `\`${gamemode}\``,
                inline: true
            },
            {
                name: "🏆 Rank",
                value: `**${rank}**`,
                inline: true
            },
            {
                name: "🔄 Predošlý rank",
                value: previousRank,
                inline: true
            },
            {
                name: "🧪 Tester",
                value: `<@${tester.id}>`,
                inline: true
            },
            {
                name: "⭐ Hodnotenie",
                value: rating
                    ? `${rating}/10`
                    : "Neuvedené",
                inline: true
            },
            {
                name: "📝 Poznámka",
                value: note,
                inline: false
            }
        )
        .setFooter({
            text: "Minecraft Rank System • Rank Editor"
        })
        .setTimestamp();

    if (evidence) {
        embed.addFields({
            name: "🔗 Dôkaz",
            value: evidence
        });
    }

    return embed;
}

// ======================================================
// EMBED MENU
// ======================================================

function createThemeMenu() {
    const options = Object.entries(themes).map(
        ([key, theme]) => {
            return {
                label: theme.label,
                value: key,
                emoji: theme.emoji
            };
        }
    );

    const menu = new StringSelectMenuBuilder()
        .setCustomId("embed_theme")
        .setPlaceholder("🎨 Vyber si tému...")
        .addOptions(options);

    return new ActionRowBuilder()
        .addComponents(menu);
}

// ======================================================
// VYTVORENIE TEMATICKÉHO EMBEDU
// ======================================================

function createThemeEmbed(
    themeKey,
    title,
    description,
    footer,
    frame
) {
    const theme = themes[themeKey];

    const color =
        theme.colors[
            frame % theme.colors.length
        ];

    const effect =
        theme.effects[
            frame % theme.effects.length
        ];

    return new EmbedBuilder()
        .setColor(color)
        .setTitle(
            `${theme.emoji} ${title}`
        )
        .setDescription(
            `${effect}\n\n` +
            `${description}\n\n` +
            `${effect}`
        )
        .setFooter({
            text:
                footer ||
                `${theme.label} • Animated Embed`
        })
        .setTimestamp();
}

// ======================================================
// INTERACTIONS
// ======================================================

client.on(
    "interactionCreate",
    async interaction => {

        // ==================================================
        // SLASH COMMANDS
        // ==================================================

        if (interaction.isChatInputCommand()) {

            try {

                // ==========================================
                // ADD RANK
                // ==========================================

                if (
                    interaction.commandName === "addrank"
                ) {
                    if (!isRankEditor(interaction)) {
                        return interaction.reply({
                            content:
                                "❌ Tento príkaz môže používať iba rola **Rank editor**.",
                            ephemeral: true
                        });
                    }

                    const embed =
                        createRankEmbed(interaction);

                    return interaction.reply({
                        content:
                            "🏆 **Rank bol úspešne pridaný!**",
                        embeds: [embed]
                    });
                }

                // ==========================================
                // EMBED
                // ==========================================

                if (
                    interaction.commandName === "embed"
                ) {
                    return interaction.reply({
                        content:
                            "🎨 **Embed Creator**\n\n" +
                            "Vyber si tému pre svoj embed:",
                        components: [
                            createThemeMenu()
                        ],
                        ephemeral: true
                    });
                }

                // ==========================================
                // 8BALL
                // ==========================================

                if (
                    interaction.commandName === "8ball"
                ) {
                    const answers = [
                        "Áno! 🟢",
                        "Určite! 🟢",
                        "Vyzerá to dobre! 🟢",
                        "Skôr áno. 🟢",
                        "Možno. 🤔",
                        "Neviem... 🤔",
                        "Skôr nie. 🔴",
                        "Nie. 🔴",
                        "Určite nie. 🔴",
                        "Osud zatiaľ mlčí... 🌌"
                    ];

                    const question =
                        interaction.options.getString(
                            "otazka"
                        );

                    const answer =
                        answers[
                            Math.floor(
                                Math.random() *
                                answers.length
                            )
                        ];

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle("🎱 Magic 8-Ball")
                                .addFields(
                                    {
                                        name: "❓ Otázka",
                                        value: question
                                    },
                                    {
                                        name: "🔮 Odpoveď",
                                        value:
                                            `**${answer}**`
                                    }
                                )
                                .setTimestamp()
                        ]
                    });
                }

                // ==========================================
                // COINFLIP
                // ==========================================

                if (
                    interaction.commandName === "coinflip"
                ) {
                    const result =
                        Math.random() < 0.5
                            ? "HLAVA"
                            : "ZNAK";

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xF1C40F)
                                .setTitle("🪙 Hod mincou")
                                .setDescription(
                                    `# 🪙 ${result}`
                                )
                        ]
                    });
                }

                // ==========================================
                // DICE
                // ==========================================

                if (
                    interaction.commandName === "dice"
                ) {
                    const result =
                        Math.floor(
                            Math.random() * 6
                        ) + 1;

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x95A5A6)
                                .setTitle("🎲 Hod kockou")
                                .setDescription(
                                    `# ${result}`
                                )
                        ]
                    });
                }

                // ==========================================
                // ROLL
                // ==========================================

                if (
                    interaction.commandName === "roll"
                ) {
                    const max =
                        interaction.options.getInteger(
                            "maximum"
                        ) || 100;

                    const result =
                        Math.floor(
                            Math.random() * max
                        ) + 1;

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle("🎲 Random Roll")
                                .setDescription(
                                    `# ${result}\n\n` +
                                    `Rozsah: **1–${max}**`
                                )
                        ]
                    });
                }

                // ==========================================
                // RPS
                // ==========================================

                if (
                    interaction.commandName === "rps"
                ) {
                    const player =
                        interaction.options.getString(
                            "volba"
                        );

                    const choices = [
                        "rock",
                        "paper",
                        "scissors"
                    ];

                    const bot =
                        choices[
                            Math.floor(
                                Math.random() *
                                choices.length
                            )
                        ];

                    const names = {
                        rock: "🪨 Kameň",
                        paper: "📄 Papier",
                        scissors: "✂️ Nožnice"
                    };

                    let result;

                    if (player === bot) {
                        result = "🤝 Remíza!";
                    } else if (
                        (player === "rock" &&
                            bot === "scissors") ||
                        (player === "paper" &&
                            bot === "rock") ||
                        (player === "scissors" &&
                            bot === "paper")
                    ) {
                        result = "🏆 Vyhral si!";
                    } else {
                        result = "🤖 Vyhral bot!";
                    }

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle(
                                    "✊ Kameň Papier Nožnice"
                                )
                                .addFields(
                                    {
                                        name: "👤 Ty",
                                        value: names[player],
                                        inline: true
                                    },
                                    {
                                        name: "🤖 Bot",
                                        value: names[bot],
                                        inline: true
                                    },
                                    {
                                        name: "🏆 Výsledok",
                                        value: result
                                    }
                                )
                        ]
                    });
                }

                // ==========================================
                // SLOTS
                // ==========================================

                if (
                    interaction.commandName === "slots"
                ) {
                    const symbols = [
                        "🍒",
                        "🍋",
                        "🍉",
                        "⭐",
                        "💎",
                        "7️⃣"
                    ];

                    const a =
                        symbols[
                            Math.floor(
                                Math.random() *
                                symbols.length
                            )
                        ];

                    const b =
                        symbols[
                            Math.floor(
                                Math.random() *
                                symbols.length
                            )
                        ];

                    const c =
                        symbols[
                            Math.floor(
                                Math.random() *
                                symbols.length
                            )
                        ];

                    const win =
                        a === b && b === c;

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(
                                    win
                                        ? 0x57F287
                                        : 0xED4245
                                )
                                .setTitle("🎰 SLOTS")
                                .setDescription(
                                    `# ${a} │ ${b} │ ${c}\n\n` +
                                    (
                                        win
                                            ? "🎉 **JACKPOT!**"
                                            : "😢 Skús znova!"
                                    )
                                )
                        ]
                    });
                }

                // ==========================================
                // CHOOSE
                // ==========================================

                if (
                    interaction.commandName === "choose"
                ) {
                    const input =
                        interaction.options.getString(
                            "moznosti"
                        );

                    const options =
                        input
                            .split(",")
                            .map(item => item.trim())
                            .filter(Boolean);

                    if (options.length < 2) {
                        return interaction.reply({
                            content:
                                "❌ Zadaj aspoň 2 možnosti oddelené čiarkou.",
                            ephemeral: true
                        });
                    }

                    const chosen =
                        options[
                            Math.floor(
                                Math.random() *
                                options.length
                            )
                        ];

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle(
                                    "🤔 Random Choice"
                                )
                                .setDescription(
                                    `### 🎯 Vybral som:\n# ${chosen}`
                                )
                        ]
                    });
                }

                // ==========================================
                // RATE
                // ==========================================

                if (
                    interaction.commandName === "rate"
                ) {
                    const what =
                        interaction.options.getString(
                            "co"
                        );

                    const rating =
                        Math.floor(
                            Math.random() * 101
                        );

                    let color = 0xED4245;

                    if (rating >= 80) {
                        color = 0x57F287;
                    } else if (rating >= 50) {
                        color = 0xFEE75C;
                    }

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color)
                                .setTitle("⭐ Hodnotenie")
                                .setDescription(
                                    `**${what}**\n\n# ${rating}%`
                                )
                        ]
                    });
                }

                // ==========================================
                // SHIP
                // ==========================================

                if (
                    interaction.commandName === "ship"
                ) {
                    const player1 =
                        interaction.options.getUser(
                            "hrac1"
                        );

                    const player2 =
                        interaction.options.getUser(
                            "hrac2"
                        );

                    const percent =
                        Math.floor(
                            Math.random() * 101
                        );

                    const hearts =
                        Math.round(
                            percent / 10
                        );

                    const bar =
                        "❤️".repeat(hearts) +
                        "🖤".repeat(
                            10 - hearts
                        );

                    let message =
                        "💀 To bude ťažké...";

                    if (percent >= 80) {
                        message =
                            "🔥 Dokonalý match!";
                    } else if (percent >= 50) {
                        message =
                            "💕 Celkom dobré!";
                    }

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xFF69B4)
                                .setTitle(
                                    "❤️ Love Calculator"
                                )
                                .setDescription(
                                    `<@${player1.id}> ❤️ <@${player2.id}>\n\n` +
                                    `# ${percent}%\n` +
                                    `${bar}\n\n` +
                                    message
                                )
                        ]
                    });
                }

                // ==========================================
                // HELP
                // ==========================================

                if (
                    interaction.commandName === "help"
                ) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle(
                                    "🤖 CZ/SK/EN Bot"
                                )
                                .setDescription(
                                    "Dostupné príkazy:"
                                )
                                .addFields(
                                    {
                                        name: "🏆 Rank System",
                                        value:
                                            "`/addrank` — Rank Editor"
                                    },
                                    {
                                        name: "🎨 Embed Creator",
                                        value:
                                            "`/embed` — tematické embedy"
                                    },
                                    {
                                        name: "🎮 Hry",
                                        value:
                                            "`/8ball`\n" +
                                            "`/coinflip`\n" +
                                            "`/dice`\n" +
                                            "`/roll`\n" +
                                            "`/rps`\n" +
                                            "`/slots`\n" +
                                            "`/choose`"
                                    },
                                    {
                                        name: "❤️ Fun",
                                        value:
                                            "`/ship`\n" +
                                            "`/rate`"
                                    }
                                )
                                .setFooter({
                                    text:
                                        "Bez databázy • Bez storage"
                                })
                        ]
                    });
                }

            } catch (error) {
                console.error(
                    "Chyba interaction:",
                    error
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {
                    return interaction.followUp({
                        content:
                            "❌ Nastala chyba pri vykonávaní príkazu.",
                        ephemeral: true
                    });
                }

                return interaction.reply({
                    content:
                        "❌ Nastala chyba pri vykonávaní príkazu.",
                    ephemeral: true
                });
            }
        }

        // ==================================================
        // VÝBER TÉMY
        // ==================================================

        if (
            interaction.isStringSelectMenu()
        ) {
            if (
                interaction.customId !==
                "embed_theme"
            ) {
                return;
            }

            const themeKey =
                interaction.values[0];

            const theme =
                themes[themeKey];

            const modal =
                new ModalBuilder()
                    .setCustomId(
                        `embed_modal_${themeKey}`
                    )
                    .setTitle(
                        `${theme.emoji} ${theme.label}`
                    );

            const titleInput =
                new TextInputBuilder()
                    .setCustomId("title")
                    .setLabel("Nadpis")
                    .setStyle(
                        TextInputStyle.Short
                    )
                    .setPlaceholder(
                        "Napíš nadpis embedu..."
                    )
                    .setRequired(true)
                    .setMaxLength(256);

            const descriptionInput =
                new TextInputBuilder()
                    .setCustomId("description")
                    .setLabel("Text")
                    .setStyle(
                        TextInputStyle.Paragraph
                    )
                    .setPlaceholder(
                        "Napíš text embedu..."
                    )
                    .setRequired(true)
                    .setMaxLength(4000);

            const footerInput =
                new TextInputBuilder()
                    .setCustomId("footer")
                    .setLabel("Footer")
                    .setStyle(
                        TextInputStyle.Short
                    )
                    .setPlaceholder(
                        "Voliteľný footer..."
                    )
                    .setRequired(false)
                    .setMaxLength(200);

            const row1 =
                new ActionRowBuilder()
                    .addComponents(
                        titleInput
                    );

            const row2 =
                new ActionRowBuilder()
                    .addComponents(
                        descriptionInput
                    );

            const row3 =
                new ActionRowBuilder()
                    .addComponents(
                        footerInput
                    );

            modal.addComponents(
                row1,
                row2,
                row3
            );

            return interaction.showModal(
                modal
            );
        }

        // ==================================================
        // EMBED MODAL
        // ==================================================

        if (
            interaction.isModalSubmit()
        ) {
            if (
                !interaction.customId.startsWith(
                    "embed_modal_"
                )
            ) {
                return;
            }

            const themeKey =
                interaction.customId.replace(
                    "embed_modal_",
                    ""
                );

            const title =
                interaction.fields.getTextInputValue(
                    "title"
                );

            const description =
                interaction.fields.getTextInputValue(
                    "description"
                );

            const footer =
                interaction.fields.getTextInputValue(
                    "footer"
                );

            const firstEmbed =
                createThemeEmbed(
                    themeKey,
                    title,
                    description,
                    footer,
                    0
                );

            await interaction.reply({
                embeds: [firstEmbed]
            });

            const message =
                await interaction.fetchReply();

            let frame = 1;

            const animation =
                setInterval(
                    async () => {
                        try {
                            const embed =
                                createThemeEmbed(
                                    themeKey,
                                    title,
                                    description,
                                    footer,
                                    frame
                                );

                            await message.edit({
                                embeds: [embed]
                            });

                            frame++;
                        } catch (error) {
                            console.error(
                                "Animacia skoncila:",
                                error.message
                            );

                            clearInterval(
                                animation
                            );
                        }
                    },
                    2500
                );

            setTimeout(
                () => {
                    clearInterval(
                        animation
                    );
                },
                30000
            );
        }
    }
);

// ======================================================
// BOT READY
// ======================================================

client.once(
    "ready",
    () => {
        console.log(
            `Bot je online ako ${client.user.tag}!`
        );

        client.user.setPresence({
            activities: [
                {
                    name:
                        "Minecraft Rank System",
                    type: 0
                }
            ],
            status: "online"
        });
    }
);

// ======================================================
// START
// ======================================================

if (!TOKEN) {
    console.error(
        "DISCORD_TOKEN nie je nastaveny!"
    );

    process.exit(1);
}

registerCommands();

client.login(TOKEN);
```

