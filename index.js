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
// CONFIG
// ======================================================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || "1535739014760632330";

if (!TOKEN) {
    console.error("CHYBA: DISCORD_TOKEN nie je nastavený!");
    process.exit(1);
}

// ======================================================
// CLIENT
// ======================================================

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ======================================================
// EMBED STYLY
// ======================================================

const STYLES = {
    aurora: {
        name: "Polárna žiara",
        emoji: "🌌",
        color: 0x57F287,
        image: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
    },

    snow: {
        name: "Sneženie",
        emoji: "❄️",
        color: 0xDDEEFF,
        image: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif"
    },

    fire: {
        name: "Oheň",
        emoji: "🔥",
        color: 0xFF4500,
        image: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif"
    },

    ice: {
        name: "Ľad",
        emoji: "🧊",
        color: 0x00BFFF,
        image: "https://media.giphy.com/media/3o6Zt6D5rGQ2g/giphy.gif"
    },

    ocean: {
        name: "Oceán",
        emoji: "🌊",
        color: 0x0077FF,
        image: "https://media.giphy.com/media/l0MYKDrP3gZqFN8kE/giphy.gif"
    },

    space: {
        name: "Vesmír",
        emoji: "🚀",
        color: 0x6C5CE7,
        image: "https://media.giphy.com/media/3o7TKsWZbQJjQ/giphy.gif"
    },

    galaxy: {
        name: "Galaxia",
        emoji: "🌠",
        color: 0x9B59B6,
        image: "https://media.giphy.com/media/3o7TKsQ1l/giphy.gif"
    },

    sunset: {
        name: "Západ slnka",
        emoji: "🌅",
        color: 0xFF7675,
        image: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif"
    },

    storm: {
        name: "Búrka",
        emoji: "⛈️",
        color: 0x5865F2,
        image: "https://media.giphy.com/media/3o7TKBurg/giphy.gif"
    },

    rainbow: {
        name: "Dúha",
        emoji: "🌈",
        color: 0xFF69B4,
        image: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif"
    },

    forest: {
        name: "Les",
        emoji: "🌲",
        color: 0x228B22,
        image: "https://media.giphy.com/media/3o7TKU8RvQuomFfUUU/giphy.gif"
    },

    desert: {
        name: "Púšť",
        emoji: "🏜️",
        color: 0xE6A23C,
        image: "https://media.giphy.com/media/3o7TKqg/giphy.gif"
    },

    volcano: {
        name: "Sopka",
        emoji: "🌋",
        color: 0xC0392B,
        image: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif"
    },

    toxic: {
        name: "Toxic",
        emoji: "☢️",
        color: 0xA3FF12,
        image: "https://media.giphy.com/media/3o7TKMGpxx/giphy.gif"
    },

    cyber: {
        name: "Cyber",
        emoji: "💻",
        color: 0x00FFCC,
        image: "https://media.giphy.com/media/26tn33ai0/giphy.gif"
    },

    blood: {
        name: "Blood",
        emoji: "🩸",
        color: 0x8B0000,
        image: "https://media.giphy.com/media/3o7TKxV/giphy.gif"
    },

    shadow: {
        name: "Shadow",
        emoji: "🌑",
        color: 0x202020,
        image: "https://media.giphy.com/media/3o7TKxV/giphy.gif"
    },

    diamond: {
        name: "Diamant",
        emoji: "💎",
        color: 0x00FFFF,
        image: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif"
    },

    gold: {
        name: "Gold",
        emoji: "🏆",
        color: 0xFFD700,
        image: "https://media.giphy.com/media/3o7TKMef/giphy.gif"
    },

    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        image: "https://media.giphy.com/media/3o7TKz9b/giphy.gif"
    }
};

// ======================================================
// COMMAND HELPERS
// ======================================================

function adminCommand(command) {
    return command.setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator.toString()
    );
}

// ======================================================
// COMMANDS
// ======================================================

const commands = [];

// ======================================================
// /addrank
// ======================================================

commands.push(
    adminCommand(
        new SlashCommandBuilder()
            .setName("addrank")
            .setDescription("Pridá hráčovi rank")
            .addUserOption(option =>
                option
                    .setName("hráč")
                    .setDescription("Hráč")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("gamemode")
                    .setDescription("Ľubovoľný gamemode")
                    .setRequired(true)
                    .setMaxLength(100)
            )
            .addStringOption(option =>
                option
                    .setName("previous_rank")
                    .setDescription("Predchádzajúci rank")
                    .setRequired(true)
                    .setMaxLength(50)
            )
            .addStringOption(option =>
                option
                    .setName("new_rank")
                    .setDescription("Nový rank")
                    .setRequired(true)
                    .setMaxLength(50)
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
            .addStringOption(option =>
                option
                    .setName("poznámka")
                    .setDescription("Voliteľná poznámka")
                    .setRequired(false)
                    .setMaxLength(1000)
            )
    )
);

// ======================================================
// /embed
// ======================================================

const embedCommand = adminCommand(
    new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Vytvorí tematický embed")
        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("štýl")
                .setDescription("Vyber štýl")
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
                .setDescription("Voliteľný text")
                .setRequired(false)
                .setMaxLength(1000)
        )
);

commands.push(embedCommand);

// ======================================================
// /help
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí pomoc")
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
// /avatar
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Zobrazí avatar hráča")
        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč")
                .setRequired(false)
        )
);

// ======================================================
// /userinfo
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Zobrazí informácie o hráčovi")
        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč")
                .setRequired(false)
        )
);

// ======================================================
// REGISTER COMMANDS
// ======================================================

async function registerCommands() {
    console.log("Registrujem slash príkazy...");

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: commands.map(command => command.toJSON())
            }
        );

        console.log("Slash príkazy boli úspešne zaregistrované!");
    } catch (error) {
        console.error("Chyba pri registrácii príkazov:");
        console.error(error);
    }
}

// ======================================================
// PERMISSION CHECK
// ======================================================

function isAdmin(interaction) {
    return (
        interaction.memberPermissions &&
        interaction.memberPermissions.has(
            PermissionFlagsBits.Administrator
        )
    );
}

// ======================================================
// INTERACTIONS
// ======================================================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    try {

        // ==================================================
        // PING
        // ==================================================

        if (interaction.commandName === "ping") {

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle("🏓 Pong!")
                .setDescription(
                    "Bot funguje správne!\n\n" +
                    "📡 Ping: `" +
                    client.ws.ping +
                    "ms`"
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // HELP
        // ==================================================

        if (interaction.commandName === "help") {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🤖 CZ/SK/EN Rank Bot")
                .setDescription(
                    "Minecraft Rank System + tematické Discord embedy"
                )
                .addFields(
                    {
                        name: "🏆 Rank systém",
                        value:
                            "`/addrank` — pridá rank hráčovi\n" +
                            "Previous Rank a New Rank sú **free text**.\n" +
                            "Gamemode je tiež **free text**."
                    },
                    {
                        name: "🎨 Embedy",
                        value:
                            "`/embed` — vytvorí tematický embed\n" +
                            "`/styles` — zobrazí všetky štýly"
                    },
                    {
                        name: "🛠️ Utility",
                        value:
                            "`/ping`\n" +
                            "`/serverinfo`\n" +
                            "`/userinfo`\n" +
                            "`/avatar`"
                    }
                )
                .setFooter({
                    text: "Minecraft Rank System"
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

            const styleText = Object.entries(STYLES)
                .map(([key, style]) =>
                    `${style.emoji} **${style.name}** — \`/${key}\``
                )
                .join("\n");

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🎨 Dostupné Embed Štýly")
                .setDescription(styleText)
                .setFooter({
                    text: `${Object.keys(STYLES).length} štýlov`
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // SERVERINFO
        // ==================================================

        if (interaction.commandName === "serverinfo") {

            if (!interaction.guild) {
                return interaction.reply({
                    content: "❌ Tento príkaz používaj na serveri.",
                    ephemeral: true
                });
            }

            const guild = interaction.guild;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🏰 " + guild.name)
                .setThumbnail(
                    guild.iconURL() || undefined
                )
                .addFields(
                    {
                        name: "👥 Členovia",
                        value: String(guild.memberCount),
                        inline: true
                    },
                    {
                        name: "🆔 Server ID",
                        value: guild.id,
                        inline: true
                    },
                    {
                        name: "📅 Vytvorený",
                        value:
                            `<t:${Math.floor(
                                guild.createdTimestamp / 1000
                            )}:D>`,
                        inline: false
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // AVATAR
        // ==================================================

        if (interaction.commandName === "avatar") {

            const user =
                interaction.options.getUser("hráč") ||
                interaction.user;

            const avatar =
                user.displayAvatarURL({
                    size: 1024,
                    extension: "png"
                });

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🖼️ Avatar — " + user.username)
                .setImage(avatar)
                .setURL(avatar)
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // USERINFO
        // ==================================================

        if (interaction.commandName === "userinfo") {

            const user =
                interaction.options.getUser("hráč") ||
                interaction.user;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("👤 " + user.username)
                .setThumbnail(
                    user.displayAvatarURL()
                )
                .addFields(
                    {
                        name: "🆔 ID",
                        value: user.id,
                        inline: true
                    },
                    {
                        name: "🤖 Bot",
                        value: user.bot ? "Áno" : "Nie",
                        inline: true
                    },
                    {
                        name: "📅 Účet vytvorený",
                        value:
                            `<t:${Math.floor(
                                user.createdTimestamp / 1000
                            )}:R>`,
                        inline: false
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // ADMIN COMMANDS
        // ==================================================

        if (
            interaction.commandName === "addrank" ||
            interaction.commandName === "embed"
        ) {

            if (!isAdmin(interaction)) {

                return interaction.reply({
                    content:
                        "❌ Tento príkaz môže používať iba Administrator.",
                    ephemeral: true
                });
            }
        }

        // ==================================================
        // ADDRANK
        // ==================================================

        if (interaction.commandName === "addrank") {

            const user =
                interaction.options.getUser("hráč");

            const gamemode =
                interaction.options.getString("gamemode");

            const previousRank =
                interaction.options.getString("previous_rank");

            const newRank =
                interaction.options.getString("new_rank");

            const note =
                interaction.options.getString("poznámka") ||
                "Bez poznámky";

            const status =
                interaction.options.getString("status") ||
                "SAME";

            let statusText = "⚪ BEZ ZMENY";
            let color = 0x5865F2;
            let statusEmoji = "⚪";

            if (status === "UP") {
                statusText = "🟢 RANK UP";
                statusEmoji = "🟢";
                color = 0x57F287;
            }

            if (status === "DOWN") {
                statusText = "🔴 RANK DOWN";
                statusEmoji = "🔴";
                color = 0xED4245;
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(
                    `${statusEmoji} Rank Test • ${user.username}`
                )
                .setDescription(
                    "🏆 **Výsledok testovania hráča**"
                )
                .setThumbnail(
                    user.displayAvatarURL()
                )
                .addFields(
                    {
                        name: "👤 Hráč",
                        value: `<@${user.id}>`,
                        inline: true
                    },
                    {
                        name: "🎮 Gamemode",
                        value: gamemode,
                        inline: true
                    },
                    {
                        name: "📊 Status",
                        value: statusText,
                        inline: true
                    },
                    {
                        name: "⬅️ Previous Rank",
                        value: `**${previousRank}**`,
                        inline: true
                    },
                    {
                        name: "➡️ New Rank",
                        value: `**${newRank}**`,
                        inline: true
                    },
                    {
                        name: "🧪 Tester",
                        value: `<@${interaction.user.id}>`,
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

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // EMBED
        // ==================================================

        if (interaction.commandName === "embed") {

            const user =
                interaction.options.getUser("hráč");

            const styleKey =
                interaction.options.getString("štýl");

            const text =
                interaction.options.getString("text");

            const style =
                STYLES[styleKey];

            if (!style) {

                return interaction.reply({
                    content: "❌ Neznámy štýl.",
                    ephemeral: true
                });
            }

            const description =
                text ||
                `${style.emoji} ${style.name}\n\n` +
                `👤 Hráč: <@${user.id}>`;

            const embed = new EmbedBuilder()
                .setColor(style.color)
                .setTitle(
                    `${style.emoji} ${style.name}`
                )
                .setDescription(description)
                .setThumbnail(
                    user.displayAvatarURL()
                )
                .setImage(style.image)
                .setFooter({
                    text:
                        `Minecraft • ${style.name}`
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

    } catch (error) {

        console.error("Interaction error:");
        console.error(error);

        try {

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp({
                    content:
                        "❌ Nastala chyba pri vykonávaní príkazu.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Nastala chyba pri vykonávaní príkazu.",
                    ephemeral: true
                });

            }

        } catch (replyError) {
            console.error(replyError);
        }
    }
});

// ======================================================
// READY
// ======================================================

client.once("clientReady", () => {

    console.log(
        "BOT JE ONLINE ako " +
        client.user.tag
    );

    client.user.setActivity(
        "Minecraft Rank System"
    );
});

// ======================================================
// RENDER WEB SERVER
// ======================================================

const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type":
            "text/plain; charset=utf-8"
    });

    res.end(
        "CZ/SK/EN Rank Bot is online!"
    );

}).listen(PORT, "0.0.0.0", () => {

    console.log(
        "Web server beží na porte " +
        PORT
    );
});

// ======================================================
// START
// ======================================================

async function start() {

    await registerCommands();

    console.log(
        "Pripájam bota na Discord..."
    );

    await client.login(TOKEN);
}

start().catch(error => {

    console.error(
        "BOT SA NEPODARILO SPUSTIŤ:"
    );

    console.error(error);

    process.exit(1);
});
