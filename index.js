```javascript
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

// =====================================================
// CONFIG
// =====================================================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || "1535739014760632330";

if (!TOKEN) {
    console.error("❌ Chýba DISCORD_TOKEN v Environment Variables!");
    process.exit(1);
}

// =====================================================
// DISCORD CLIENT
// =====================================================

// Používame iba Guilds.
// Žiadne MessageContent, Members ani Presence intenty.
// Preto netreba zapínať Privileged Gateway Intents.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// =====================================================
// RANKY
// =====================================================

const RANKS = [
    "LT1",
    "LT2",
    "LT3",
    "LT4",
    "LT5",
    "HT1",
    "HT2",
    "HT3",
    "HT4",
    "HT5"
];

// =====================================================
// EMBED ŠTÝLY
// =====================================================

const EMBED_STYLES = {
    aurora: {
        name: "🌌 Polárna žiara",
        color: 0x57F287,
        emoji: "🌌",
        title: "POLÁRNA ŽIARA",
        description: "✨ Aurora Borealis • Northern Lights ✨"
    },

    snow: {
        name: "❄️ Sneženie",
        color: 0xDDEEFF,
        emoji: "❄️",
        title: "SNEŽENIE",
        description: "❄️ Hory pokryté snehom"
    },

    fire: {
        name: "🔥 Oheň",
        color: 0xFF4500,
        emoji: "🔥",
        title: "FIRE",
        description: "🔥 Horúci a energický štýl"
    },

    ice: {
        name: "🧊 Ľad",
        color: 0x00BFFF,
        emoji: "🧊",
        title: "ICE",
        description: "🧊 Chladný ľadový štýl"
    },

    ocean: {
        name: "🌊 Oceán",
        color: 0x0077FF,
        emoji: "🌊",
        title: "OCEAN",
        description: "🌊 Deep Ocean"
    },

    space: {
        name: "🌌 Vesmír",
        color: 0x6C5CE7,
        emoji: "🌌",
        title: "SPACE",
        description: "🚀 Deep Space"
    },

    galaxy: {
        name: "🌠 Galaxia",
        color: 0x9B59B6,
        emoji: "🌠",
        title: "GALAXY",
        description: "🌠 Milky Way"
    },

    sunset: {
        name: "🌅 Západ slnka",
        color: 0xFF7675,
        emoji: "🌅",
        title: "SUNSET",
        description: "🌅 Golden sunset"
    },

    storm: {
        name: "⛈️ Búrka",
        color: 0x5865F2,
        emoji: "⛈️",
        title: "STORM",
        description: "⚡ Thunderstorm"
    },

    rainbow: {
        name: "🌈 Dúha",
        color: 0xFF69B4,
        emoji: "🌈",
        title: "RAINBOW",
        description: "🌈 Colorful vibes"
    },

    forest: {
        name: "🌲 Les",
        color: 0x228B22,
        emoji: "🌲",
        title: "FOREST",
        description: "🌲 Deep Forest"
    },

    desert: {
        name: "🏜️ Púšť",
        color: 0xE6A23C,
        emoji: "🏜️",
        title: "DESERT",
        description: "🏜️ Desert adventure"
    },

    volcano: {
        name: "🌋 Sopka",
        color: 0xC0392B,
        emoji: "🌋",
        title: "VOLCANO",
        description: "🌋 Erupting volcano"
    },

    toxic: {
        name: "☢️ Toxic",
        color: 0xA3FF12,
        emoji: "☢️",
        title: "TOXIC",
        description: "☢️ Toxic zone"
    },

    cyber: {
        name: "💻 Cyber",
        color: 0x00FFCC,
        emoji: "💻",
        title: "CYBER",
        description: "💻 Cyber atmosphere"
    },

    blood: {
        name: "🩸 Blood",
        color: 0x8B0000,
        emoji: "🩸",
        title: "BLOOD",
        description: "🩸 Dark blood style"
    },

    shadow: {
        name: "🌑 Shadow",
        color: 0x202020,
        emoji: "🌑",
        title: "SHADOW",
        description: "🌑 Dark mode"
    },

    diamond: {
        name: "💎 Diamant",
        color: 0x00FFFF,
        emoji: "💎",
        title: "DIAMOND",
        description: "💎 Legendary diamond"
    },

    gold: {
        name: "🏆 Gold",
        color: 0xFFD700,
        emoji: "🏆",
        title: "GOLD",
        description: "🏆 Golden rank"
    },

    minecraft: {
        name: "⛏️ Minecraft",
        color: 0x55AA55,
        emoji: "⛏️",
        title: "MINECRAFT",
        description: "⛏️ Minecraft Rank System"
    }
};

// =====================================================
// SLASH COMMANDS
// =====================================================

const commands = [

    // ===============================
    // /addrank
    // ===============================

    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription("Pridá hráčovi Minecraft rank.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč, ktorého si testoval.")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Napíš ľubovoľný gamemode.")
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("rank")
                .setDescription("Vyber rank.")
                .setRequired(true)
                .addChoices(
                    ...RANKS.map(rank => ({
                        name: rank,
                        value: rank
                    }))
                )
        )

        .addStringOption(option =>
            option
                .setName("poznámka")
                .setDescription("Voliteľná poznámka k testu.")
                .setRequired(false)
                .setMaxLength(1000)
        )

        .addStringOption(option =>
            option
                .setName("status")
                .setDescription("Ako dopadol rank?")
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
        ),

    // ===============================
    // /embed
    // ===============================

    new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Vytvorí štýlový Minecraft embed.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )

        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Komu sa má embed zobraziť.")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("styl")
                .setDescription("Vyber štýl embedu.")
                .setRequired(true)
                .addChoices(
                    ...Object.entries(EMBED_STYLES).map(
                        ([key, style]) => ({
                            name: style.name,
                            value: key
                        })
                    )
                )
        )

        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Voliteľný text.")
                .setRequired(false)
                .setMaxLength(1000)
        ),

    // ===============================
    // /help
    // ===============================

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí všetky príkazy."),

    // ===============================
    // /ping
    // ===============================

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Skontroluje odozvu bota."),

    // ===============================
    // /serverinfo
    // ===============================

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Zobrazí informácie o serveri.")

].map(command => command.toJSON());

// =====================================================
// REGISTER COMMANDS
// =====================================================

async function registerCommands() {

    console.log("Registrujem slash príkazy...");

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    try {

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: commands
            }
        );

        console.log("✅ Slash príkazy boli úspešne zaregistrované!");

    } catch (error) {

        console.error("❌ Chyba pri registrácii príkazov:");
        console.error(error);

    }
}

// =====================================================
// INTERACTIONS
// =====================================================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    try {

        // =================================================
        // /PING
        // =================================================

        if (interaction.commandName === "ping") {

            const ping = client.ws.ping;

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle("🏓 Pong!")
                .setDescription(
                    `Bot funguje správne.\n\n` +
                    `📡 Ping: **${ping}ms**`
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // =================================================
        // /HELP
        // =================================================

        if (interaction.commandName === "help") {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🤖 Rank Bot")
                .setDescription(
                    "Minecraft Discord Rank System"
                )
                .addFields(
                    {
                        name: "🏆 Rank System",
                        value:
                            "`/addrank` — pridá rank hráčovi\n" +
                            "`/embed` — vytvorí štýlový embed"
                    },
                    {
                        name: "🛠️ Utility",
                        value:
                            "`/ping` — skontroluje bota\n" +
                            "`/serverinfo` — informácie o serveri\n" +
                            "`/help` — táto pomoc"
                    },
                    {
                        name: "🏆 Dostupné ranky",
                        value:
                            RANKS.map(rank => `\`${rank}\``).join(" • ")
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

        // =================================================
        // /SERVERINFO
        // =================================================

        if (interaction.commandName === "serverinfo") {

            const guild = interaction.guild;

            if (!guild) {
                return interaction.reply({
                    content: "❌ Tento príkaz musíš použiť na serveri.",
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`🏰 ${guild.name}`)
                .setThumbnail(guild.iconURL())
                .addFields(
                    {
                        name: "👥 Členovia",
                        value: `${guild.memberCount}`,
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
                            `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
                        inline: true
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // =================================================
        // /ADDRANK
        // =================================================

        if (interaction.commandName === "addrank") {

            // Dodatočná kontrola oprávnenia.
            if (
                !interaction.memberPermissions?.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Tento príkaz môže používať iba **Administrátor**.",
                    ephemeral: true
                });
            }

            const user =
                interaction.options.getUser("hráč");

            const gamemode =
                interaction.options.getString("gamemode");

            const rank =
                interaction.options.getString("rank");

            const note =
                interaction.options.getString("poznámka") ||
                "Bez poznámky";

            const status =
                interaction.options.getString("status") ||
                "SAME";

            let statusText = "⚪ Bez zmeny";
            let statusColor = 0x5865F2;

            if (status === "UP") {
                statusText = "🟢 RANK UP";
                statusColor = 0x57F287;
            }

            if (status === "DOWN") {
                statusText = "🔴 RANK DOWN";
                statusColor = 0xED4245;
            }

            const embed = new EmbedBuilder()
                .setColor(statusColor)
                .setTitle(`🏆 ${rank} • Rank test`)
                .setDescription(
                    `### 👤 <@${user.id}>\n` +
                    `Rank test bol dokončený.`
                )
                .setThumbnail(user.displayAvatarURL())
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
                        name: "🏆 Rank",
                        value: `**${rank}**`,
                        inline: true
                    },
                    {
                        name: "📊 Status",
                        value: statusText,
                        inline: true
                    },
                    {
                        name: "🧪 Testoval",
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

        // =================================================
        // /EMBED
        // =================================================

        if (interaction.commandName === "embed") {

            if (
                !interaction.memberPermissions?.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Tento príkaz môže používať iba **Administrátor**.",
                    ephemeral: true
                });
            }

            const user =
                interaction.options.getUser("hráč");

            const styleKey =
                interaction.options.getString("styl");

            const customText =
                interaction.options.getString("text");

            const style =
                EMBED_STYLES[styleKey];

            if (!style) {

                return interaction.reply({
                    content: "❌ Tento štýl neexistuje.",
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(style.color)
                .setTitle(
                    `${style.emoji} ${style.title}`
                )
                .setDescription(
                    customText ||
                    `${style.description}\n\n` +
                    `👤 **Hráč:** <@${user.id}>\n` +
                    `✨ **Štýl:** ${style.name}`
                )
                .setThumbnail(user.displayAvatarURL())
                .setFooter({
                    text: `Minecraft • ${style.title}`
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

    } catch (error) {

        console.error("❌ Interaction error:");
        console.error(error);

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
    }
});

// =====================================================
// BOT READY
// =====================================================

client.once("clientReady", readyClient => {

    console.log(
        `✅ Bot je online ako ${readyClient.user.tag}!`
    );

    readyClient.user.setActivity(
        "Minecraft Rank System",
        {
            type: 0
        }
    );
});

// =====================================================
// RENDER WEB SERVER
// =====================================================

const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Rank Bot is online! 🟢");

}).listen(PORT, "0.0.0.0", () => {

    console.log(
        `🌐 Web server beží na porte ${PORT}`
    );
});

// =====================================================
// START
// =====================================================

async function start() {

    await registerCommands();

    console.log("🔌 Pripájam bota na Discord...");

    await client.login(TOKEN);
}

start().catch(error => {

    console.error("❌ Bot sa nepodarilo spustiť:");
    console.error(error);

    process.exit(1);
});
```

