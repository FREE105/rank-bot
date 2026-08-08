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
// WEB SERVER PRE RENDER
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

const ranks = [
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
// EMBED TÉMY
// ======================================================

const themes = {

    aurora: {
        name: "🌌 Polárna žiara",
        colors: [0x00ff88, 0x00ccff, 0x8a2be2],
        emojis: ["🌌", "💚", "💙", "💜", "✨"]
    },

    snow: {
        name: "❄️ Sneženie",
        colors: [0x9eeaff, 0xffffff, 0x72bfff],
        emojis: ["❄️", "❄️", "☃️", "❄️", "✨"]
    },

    fire: {
        name: "🔥 Oheň",
        colors: [0xff0000, 0xff6600, 0xffcc00],
        emojis: ["🔥", "🔥", "🧨", "🔥", "✨"]
    },

    ice: {
        name: "🧊 Ľad",
        colors: [0x00ccff, 0x66e6ff, 0xffffff],
        emojis: ["🧊", "❄️", "💎", "🧊", "✨"]
    },

    storm: {
        name: "⚡ Búrka",
        colors: [0x3030a0, 0x6666ff, 0xffff00],
        emojis: ["⚡", "🌩️", "⚡", "🌩️", "✨"]
    },

    ocean: {
        name: "🌊 Oceán",
        colors: [0x0066ff, 0x00ccff, 0x0044aa],
        emojis: ["🌊", "🐋", "💧", "🌊", "✨"]
    },

    volcano: {
        name: "🌋 Sopka",
        colors: [0xff2200, 0xff6600, 0xffcc00],
        emojis: ["🌋", "🔥", "💥", "🔥", "✨"]
    },

    tornado: {
        name: "🌪️ Tornádo",
        colors: [0x555555, 0x888888, 0x222222],
        emojis: ["🌪️", "💨", "🌪️", "💨", "✨"]
    },

    rain: {
        name: "🌧️ Dážď",
        colors: [0x3366cc, 0x6699ff, 0x99ccff],
        emojis: ["🌧️", "💧", "☔", "💧", "✨"]
    },

    rainbow: {
        name: "🌈 Dúha",
        colors: [0xff0000, 0xff9900, 0x00ccff],
        emojis: ["🌈", "✨", "🌈", "✨", "💫"]
    },

    moon: {
        name: "🌙 Mesačná noc",
        colors: [0x111133, 0x333366, 0x6666aa],
        emojis: ["🌙", "⭐", "🌌", "⭐", "✨"]
    },

    stars: {
        name: "⭐ Hviezdy",
        colors: [0x111111, 0x333366, 0x663399],
        emojis: ["⭐", "✨", "🌟", "💫", "⭐"]
    },

    meteor: {
        name: "☄️ Meteority",
        colors: [0x551100, 0xff6600, 0xffcc00],
        emojis: ["☄️", "🔥", "💥", "☄️", "✨"]
    },

    galaxy: {
        name: "💜 Galaxy",
        colors: [0x240046, 0x7209b7, 0x4361ee],
        emojis: ["💜", "🌌", "✨", "💫", "🌟"]
    },

    crystal: {
        name: "💎 Crystal",
        colors: [0x00ffff, 0x00aaff, 0x9966ff],
        emojis: ["💎", "🔷", "💠", "💎", "✨"]
    },

    forest: {
        name: "🌲 Les",
        colors: [0x14532d, 0x16a34a, 0x65a30d],
        emojis: ["🌲", "🍃", "🌿", "🌲", "✨"]
    },

    autumn: {
        name: "🍂 Jeseň",
        colors: [0xff6600, 0xcc3300, 0xffcc33],
        emojis: ["🍂", "🍁", "🍂", "🍁", "✨"]
    },

    spring: {
        name: "🌸 Jar",
        colors: [0xff99cc, 0xff66aa, 0x99ffcc],
        emojis: ["🌸", "🌺", "🌷", "🌸", "✨"]
    },

    halloween: {
        name: "🎃 Halloween",
        colors: [0xff6600, 0x663399, 0x111111],
        emojis: ["🎃", "👻", "🦇", "🎃", "💀"]
    },

    christmas: {
        name: "🎄 Vianoce",
        colors: [0xff0000, 0x00aa44, 0xffffff],
        emojis: ["🎄", "🎅", "❄️", "🎁", "✨"]
    },

    fireworks: {
        name: "🎆 Ohňostroj",
        colors: [0xff00ff, 0x00ffff, 0xffff00],
        emojis: ["🎆", "🎇", "✨", "💥", "🎆"]
    },

    sun: {
        name: "☀️ Slnko",
        colors: [0xffcc00, 0xff8800, 0xffff66],
        emojis: ["☀️", "🌞", "🔥", "☀️", "✨"]
    },

    eclipse: {
        name: "🌑 Zatmenie",
        colors: [0x111111, 0x333333, 0x663300],
        emojis: ["🌑", "🌘", "🌒", "🌑", "✨"]
    },

    desert: {
        name: "🏜️ Púšť",
        colors: [0xcc6600, 0xffaa33, 0xffdd88],
        emojis: ["🏜️", "🌵", "☀️", "🌵", "✨"]
    },

    tropical: {
        name: "🌺 Tropical",
        colors: [0x00cc88, 0x00ccff, 0xff66aa],
        emojis: ["🌺", "🌴", "🦜", "🌊", "✨"]
    }

};

// ======================================================
// SLASH COMMANDS
// ======================================================

const commands = [

    // --------------------------------------------------
    // ADD RANK
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription("Pridá rank test")

        .addUserOption(o =>
            o.setName("hráč")
                .setDescription("Hráč")
                .setRequired(true)
        )

        .addStringOption(o =>
            o.setName("gamemode")
                .setDescription("Gamemode - voľný text")
                .setRequired(true)
        )

        .addStringOption(o =>
            o.setName("rank")
                .setDescription("Rank")
                .setRequired(true)
                .addChoices(...ranks)
        )

        .addUserOption(o =>
            o.setName("tester")
                .setDescription("Tester")
                .setRequired(false)
        )

        .addStringOption(o =>
            o.setName("poznámka")
                .setDescription("Poznámka")
                .setRequired(false)
        )

        .addStringOption(o =>
            o.setName("dôkaz")
                .setDescription("Link na dôkaz")
                .setRequired(false)
        )

        .addIntegerOption(o =>
            o.setName("hodnotenie")
                .setDescription("Hodnotenie 1-10")
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)
        )

        .addStringOption(o =>
            o.setName("status")
                .setDescription("Zmena ranku")
                .setRequired(false)
                .addChoices(
                    {
                        name: "🟢 Rank Up",
                        value: "up"
                    },
                    {
                        name: "🔴 Rank Down",
                        value: "down"
                    },
                    {
                        name: "⚪ Same Rank",
                        value: "same"
                    }
                )
        )

        .addStringOption(o =>
            o.setName("predosly_rank")
                .setDescription("Predošlý rank")
                .setRequired(false)
                .addChoices(...ranks)
        ),

    // --------------------------------------------------
    // EMBED
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Vytvorí animovaný Discord embed")

        .addUserOption(o =>
            o.setName("hráč")
                .setDescription("Koho má embed označiť")
                .setRequired(false)
        ),

    // --------------------------------------------------
    // 8BALL
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Opýtaj sa magickej 8-ball")

        .addStringOption(o =>
            o.setName("otázka")
                .setDescription("Tvoja otázka")
                .setRequired(true)
        ),

    // --------------------------------------------------
    // COINFLIP
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Hodí mincou"),

    // --------------------------------------------------
    // DICE
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Hodí kockou"),

    // --------------------------------------------------
    // ROLL
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Náhodné číslo")

        .addIntegerOption(o =>
            o.setName("maximum")
                .setDescription("Maximum")
                .setMinValue(2)
                .setMaxValue(1000000)
                .setRequired(false)
        ),

    // --------------------------------------------------
    // RPS
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Kameň papier nožnice")

        .addStringOption(o =>
            o.setName("voľba")
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

    // --------------------------------------------------
    // SLOTS
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Zahraj si sloty"),

    // --------------------------------------------------
    // CHOOSE
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("choose")
        .setDescription("Vyberie jednu možnosť")

        .addStringOption(o =>
            o.setName("možnosti")
                .setDescription("Možnosti oddelené čiarkou")
                .setRequired(true)
        ),

    // --------------------------------------------------
    // RATE
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("rate")
        .setDescription("Náhodné hodnotenie")

        .addStringOption(o =>
            o.setName("čo")
                .setDescription("Čo má bot hodnotiť?")
                .setRequired(true)
        ),

    // --------------------------------------------------
    // SHIP
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("ship")
        .setDescription("Kompatibilita dvoch hráčov")

        .addUserOption(o =>
            o.setName("hráč1")
                .setDescription("Prvý hráč")
                .setRequired(true)
        )

        .addUserOption(o =>
            o.setName("hráč2")
                .setDescription("Druhý hráč")
                .setRequired(true)
        ),

    // --------------------------------------------------
    // HELP
    // --------------------------------------------------

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí všetky príkazy")

].map(c => c.toJSON());

// ======================================================
// REGISTER COMMANDS
// ======================================================

async function registerCommands() {

    console.log("Registrujem slash príkazy...");

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

        console.log(
            "Slash príkazy boli úspešne zaregistrované!"
        );

    } catch (error) {

        console.error(
            "Chyba pri registrácii:",
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

    if (!interaction.member) {
        return false;
    }

    return interaction.member.roles.cache.some(
        role => role.name === RANK_EDITOR_ROLE
    );
}

// ======================================================
// STATUS
// ======================================================

function statusText(status) {

    if (status === "up") {
        return "🟢 **RANK UP**";
    }

    if (status === "down") {
        return "🔴 **RANK DOWN**";
    }

    return "⚪ **SAME RANK**";
}

// ======================================================
// RANK EMBED
// ======================================================

function createRankEmbed(interaction) {

    const player =
        interaction.options.getUser("hráč");

    const tester =
        interaction.options.getUser("tester")
        || interaction.user;

    const gamemode =
        interaction.options.getString("gamemode");

    const rank =
        interaction.options.getString("rank");

    const note =
        interaction.options.getString("poznámka")
        || "Bez poznámky";

    const evidence =
        interaction.options.getString("dôkaz");

    const rating =
        interaction.options.getInteger("hodnotenie");

    const status =
        interaction.options.getString("status")
        || "same";

    const previousRank =
        interaction.options.getString("predosly_rank")
        || "Neuvedené";

    const embed =
        new EmbedBuilder()

            .setColor(
                status === "up"
                    ? 0x57F287
                    : status === "down"
                        ? 0xED4245
                        : 0x5865F2
            )

            .setTitle("🏆 RANK TEST")

            .setDescription(
                `## 👤 ${player.username}\n` +
                `> ${statusText(status)}`
            )

            .setThumbnail(
                player.displayAvatarURL()
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
                    value:
                        rating
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
                text:
                    "Minecraft Rank System • Rank Editor"
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
// EMBED SELECT MENU
// ======================================================

function createThemeMenu() {

    const menu =
        new StringSelectMenuBuilder()
            .setCustomId("embed_theme")
            .setPlaceholder(
                "🎨 Vyber animovanú tému..."
            )
            .addOptions(
                Object.entries(themes)
                    .map(([id, theme]) => ({
                        label:
                            theme.name
                                .replace(/^.\s/, ""),
                        value: id,
                        emoji:
                            theme.name.substring(0, 2)
                    }))
            );

    return new ActionRowBuilder()
        .addComponents(menu);
}

// ======================================================
// ANIMOVANÝ EMBED
// ======================================================

function createAnimatedEmbed(
    theme,
    title,
    description,
    footer,
    mention,
    frame
) {

    const themeData =
        themes[theme];

    const color =
        themeData.colors[
            frame %
            themeData.colors.length
        ];

    const emoji =
        themeData.emojis[
            frame %
            themeData.emojis.length
        ];

    const background =
        `${emoji} ${emoji} ${emoji} ${emoji} ${emoji}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n`;

    return new EmbedBuilder()

        .setColor(color)

        .setTitle(
            `${emoji} ${title}`
        )

        .setDescription(
            background +
            (mention
                ? `### 👤 ${mention}\n\n`
                : "") +
            description +
            `\n\n━━━━━━━━━━━━━━━━━━━━\n` +
            `${emoji} ${themeData.name} ${emoji}`
        )

        .setFooter({
            text:
                footer ||
                `Animated Embed • ${themeData.name}`
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

        if (
            interaction.isChatInputCommand()
        ) {

            try {

                // ==========================================
                // ADD RANK
                // ==========================================

                if (
                    interaction.commandName ===
                    "addrank"
                ) {

                    if (
                        !isRankEditor(interaction)
                    ) {

                        return interaction.reply({
                            content:
                                "❌ Tento príkaz môže používať iba **Rank editor**.",
                            ephemeral: true
                        });
                    }

                    const embed =
                        createRankEmbed(
                            interaction
                        );

                    return interaction.reply({
                        content:
                            "🏆 **Nový rank test**",
                        embeds: [embed]
                    });
                }

                // ==========================================
                // EMBED
                // ==========================================

                if (
                    interaction.commandName ===
                    "embed"
                ) {

                    return interaction.reply({

                        content:
                            "🎨 **Embed Creator**\n\nVyber si tému pre svoj embed:",

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
                    interaction.commandName ===
                    "8ball"
                ) {

                    const answers = [

                        "Áno! 🟢",
                        "Určite! 🟢",
                        "Vyzerá to dobre! 🟢",
                        "Skôr áno. 🟢",
                        "Neviem... 🤔",
                        "Možno. 🤔",
                        "Skôr nie. 🔴",
                        "Nie. 🔴",
                        "Určite nie. 🔴",
                        "Osud zatiaľ mlčí... 🌌"

                    ];

                    const answer =
                        answers[
                            Math.floor(
                                Math.random()
                                * answers.length
                            )
                        ];

                    const question =
                        interaction.options.getString(
                            "otázka"
                        );

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
                    interaction.commandName ===
                    "coinflip"
                ) {

                    const result =
                        Math.random() < 0.5
                            ? "🪙 **HLAVA**"
                            : "🪙 **ZNAK**";

                    return interaction.reply({
                        embeds: [

                            new EmbedBuilder()

                                .setColor(0xF1C40F)

                                .setTitle(
                                    "🪙 Hod mincou"
                                )

                                .setDescription(
                                    `# ${result}`
                                )
                        ]
                    });
                }

                // ==========================================
                // DICE
                // ==========================================

                if (
                    interaction.commandName ===
                    "dice"
                ) {

                    const result =
                        Math.floor(
                            Math.random() * 6
                        ) + 1;

                    return interaction.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(0x95A5A6)

                                .setTitle(
                                    "🎲 Hod kockou"
                                )

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
                    interaction.commandName ===
                    "roll"
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

                                .setTitle(
                                    "🎲 Random Roll"
                                )

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
                    interaction.commandName ===
                    "rps"
                ) {

                    const player =
                        interaction.options.getString(
                            "voľba"
                        );

                    const choices = [
                        "rock",
                        "paper",
                        "scissors"
                    ];

                    const bot =
                        choices[
                            Math.floor(
                                Math.random()
                                * choices.length
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
                    }

                    else if (

                        (player === "rock" &&
                            bot === "scissors") ||

                        (player === "paper" &&
                            bot === "rock") ||

                        (player === "scissors" &&
                            bot === "paper")

                    ) {

                        result = "🏆 Vyhral si!";

                    }

                    else {

                        result = "💀 Vyhral bot!";

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
                                        name:
                                            "👤 Ty",
                                        value:
                                            names[player],
                                        inline: true
                                    },

                                    {
                                        name:
                                            "🤖 Bot",
                                        value:
                                            names[bot],
                                        inline: true
                                    },

                                    {
                                        name:
                                            "🏆 Výsledok",
                                        value:
                                            result,
                                        inline: false
                                    }

                                )

                        ]
                    });
                }

                // ==========================================
                // SLOTS
                // ==========================================

                if (
                    interaction.commandName ===
                    "slots"
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
                                Math.random()
                                * symbols.length
                            )
                        ];

                    const b =
                        symbols[
                            Math.floor(
                                Math.random()
                                * symbols.length
                            )
                        ];

                    const c =
                        symbols[
                            Math.floor(
                                Math.random()
                                * symbols.length
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

                                .setTitle(
                                    "🎰 SLOTS"
                                )

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
                    interaction.commandName ===
                    "choose"
                ) {

                    const input =
                        interaction.options.getString(
                            "možnosti"
                        );

                    const options =
                        input
                            .split(",")
                            .map(x => x.trim())
                            .filter(Boolean);

                    if (
                        options.length < 2
                    ) {

                        return interaction.reply({

                            content:
                                "❌ Napíš aspoň 2 možnosti oddelené čiarkou.",

                            ephemeral: true
                        });
                    }

                    const chosen =
                        options[
                            Math.floor(
                                Math.random()
                                * options.length
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
                    interaction.commandName ===
                    "rate"
                ) {

                    const what =
                        interaction.options.getString(
                            "čo"
                        );

                    const rating =
                        Math.floor(
                            Math.random() * 101
                        );

                    return interaction.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(
                                    rating >= 80
                                        ? 0x57F287
                                        : rating >= 50
                                            ? 0xFEE75C
                                            : 0xED4245
                                )

                                .setTitle(
                                    "⭐ Hodnotenie"
                                )

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
                    interaction.commandName ===
                    "ship"
                ) {

                    const a =
                        interaction.options.getUser(
                            "hráč1"
                        );

                    const b =
                        interaction.options.getUser(
                            "hráč2"
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

                    return interaction.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(0xFF69B4)

                                .setTitle(
                                    "❤️ Love Calculator"
                                )

                                .setDescription(

                                    `<@${a.id}> ❤️ <@${b.id}>\n\n` +

                                    `# ${percent}%\n` +

                                    `${bar}\n\n` +

                                    (
                                        percent >= 80
                                            ? "🔥 Dokonalý match!"
                                            : percent >= 50
                                                ? "💕 Celkom dobré!"
                                                : "💀 Toto bude ťažké..."
                                    )

                                )

                        ]
                    });
                }

                // ==========================================
                // HELP
                // ==========================================

                if (
                    interaction.commandName ===
                    "help"
                ) {

                    return interaction.reply({

                        embeds: [

                            new EmbedBuilder()

                                .setColor(0x5865F2)

                                .setTitle(
                                    "🤖 CZ/SK/EN Bot"
                                )

                                .setDescription(
                                    "Všetky dostupné príkazy:"
                                )

                                .addFields(

                                    {
                                        name:
                                            "🏆 Rank System",
                                        value:
                                            "`/addrank` — pridá rank test"
                                    },

                                    {
                                        name:
                                            "🎨 Embed Creator",
                                        value:
                                            "`/embed` — vytvorí animovaný embed"
                                    },

                                    {
                                        name:
                                            "🎮 Hry",
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
                                        name:
                                            "❤️ Fun",
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
            }

            catch (error) {

                console.error(
                    "Interaction error:",
                    error
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    return interaction.followUp({
                        content:
                            "❌ Nastala chyba.",
                        ephemeral: true
                    });

                }

                return interaction.reply({
                    content:
                        "❌ Nastala chyba.",
                    ephemeral: true
                });
            }
        }

        // ==================================================
        // SELECT MENU
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

            const theme =
                interaction.values[0];

            const themeData =
                themes[theme];

            const modal =
                new ModalBuilder()
                    .setCustomId(
                        `embed_modal_${theme}`
                    )
                    .setTitle(
                        `🎨 ${themeData.name}`
                    );

            const title =
                new TextInputBuilder()
                    .setCustomId("title")
                    .setLabel("Nadpis")
                    .setStyle(
                        TextInputStyle.Short
                    )
                    .setPlaceholder(
                        "Napíš nadpis..."
                    )
                    .setRequired(true)
                    .setMaxLength(256);

            const description =
                new TextInputBuilder()
                    .setCustomId(
                        "description"
                    )
                    .setLabel("Text embedu")
                    .setStyle(
                        TextInputStyle.Paragraph
                    )
                    .setPlaceholder(
                        "Napíš text..."
                    )
                    .setRequired(true)
                    .setMaxLength(4000);

            const footer =
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
                    .addComponents(title);

            const row2 =
                new ActionRowBuilder()
                    .addComponents(description);

            const row3 =
                new ActionRowBuilder()
                    .addComponents(footer);

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
        // MODAL
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

            const theme =
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

            const themeData =
                themes[theme];

            await interaction.reply({

                embeds: [

                    createAnimatedEmbed(
                        theme,
                        title,
                        description,
                        footer,
                        null,
                        0
                    )

                ]

            });

            // ==================================================
            // ANIMÁCIA
            // ==================================================

            let frame = 1;

            const message =
                await interaction.fetchReply();

            const animation =
                setInterval(
                    async () => {

                        try {

                            const embed =
                                createAnimatedEmbed(
                                    theme,
                                    title,
                                    description,
                                    footer,
                                    null,
                                    frame
                                );

                            await message.edit({
                                embeds: [embed]
                            });

                            frame++;

                        }

                        catch {
                            clearInterval(
                                animation
                            );
                        }

                    },
                    1800
                );

            // Animácia beží 30 sekúnd
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
// READY
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
        "❌ DISCORD_TOKEN nie je nastavený!"
    );

    process.exit(1);
}

registerCommands();

client.login(TOKEN);
```
