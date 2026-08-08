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

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || "1535739014760632330";

if (!TOKEN) {
    console.error("CHYBA: Chyba DISCORD_TOKEN!");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ==============================
// RANKY
// ==============================

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

// ==============================
// EMBED STYLY
// ==============================

const STYLES = {
    aurora: {
        name: "Polarna ziara",
        emoji: "🌌",
        color: 0x57F287,
        description: "Aurora Borealis"
    },

    snow: {
        name: "Snezenie",
        emoji: "❄️",
        color: 0xDDEEFF,
        description: "Zimna snehova atmosfera"
    },

    fire: {
        name: "Ohen",
        emoji: "🔥",
        color: 0xFF4500,
        description: "Horuca ohniva atmosfera"
    },

    ice: {
        name: "Lad",
        emoji: "🧊",
        color: 0x00BFFF,
        description: "Mraziva ladova atmosfera"
    },

    ocean: {
        name: "Ocean",
        emoji: "🌊",
        color: 0x0077FF,
        description: "Deep Ocean"
    },

    space: {
        name: "Vesmír",
        emoji: "🚀",
        color: 0x6C5CE7,
        description: "Deep Space"
    },

    galaxy: {
        name: "Galaxia",
        emoji: "🌠",
        color: 0x9B59B6,
        description: "Galaxy atmosphere"
    },

    sunset: {
        name: "Zapad slnka",
        emoji: "🌅",
        color: 0xFF7675,
        description: "Golden sunset"
    },

    storm: {
        name: "Búrka",
        emoji: "⛈️",
        color: 0x5865F2,
        description: "Thunderstorm"
    },

    rainbow: {
        name: "Dúha",
        emoji: "🌈",
        color: 0xFF69B4,
        description: "Colorful atmosphere"
    },

    forest: {
        name: "Les",
        emoji: "🌲",
        color: 0x228B22,
        description: "Deep Forest"
    },

    desert: {
        name: "Púšť",
        emoji: "🏜️",
        color: 0xE6A23C,
        description: "Desert adventure"
    },

    volcano: {
        name: "Sopka",
        emoji: "🌋",
        color: 0xC0392B,
        description: "Volcanic atmosphere"
    },

    toxic: {
        name: "Toxic",
        emoji: "☢️",
        color: 0xA3FF12,
        description: "Toxic zone"
    },

    cyber: {
        name: "Cyber",
        emoji: "💻",
        color: 0x00FFCC,
        description: "Cyber atmosphere"
    },

    blood: {
        name: "Blood",
        emoji: "🩸",
        color: 0x8B0000,
        description: "Dark blood style"
    },

    shadow: {
        name: "Shadow",
        emoji: "🌑",
        color: 0x202020,
        description: "Dark shadow style"
    },

    diamond: {
        name: "Diamant",
        emoji: "💎",
        color: 0x00FFFF,
        description: "Legendary diamond"
    },

    gold: {
        name: "Gold",
        emoji: "🏆",
        color: 0xFFD700,
        description: "Golden style"
    },

    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        description: "Minecraft atmosphere"
    }
};

// ==============================
// COMMANDS
// ==============================

const commands = [

    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription("Prida hracovi rank")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )
        .addUserOption(option =>
            option
                .setName("hrac")
                .setDescription("Hrac")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Libovolny gamemode")
                .setRequired(true)
                .setMaxLength(100)
        )
        .addStringOption(option =>
            option
                .setName("rank")
                .setDescription("Vyber rank")
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
                .setName("poznamka")
                .setDescription("Volitelna poznamka")
                .setRequired(false)
                .setMaxLength(1000)
        )
        .addStringOption(option =>
            option
                .setName("status")
                .setDescription("Vysledok testu")
                .setRequired(false)
                .addChoices(
                    {
                        name: "Rank UP",
                        value: "UP"
                    },
                    {
                        name: "Rank DOWN",
                        value: "DOWN"
                    },
                    {
                        name: "Bez zmeny",
                        value: "SAME"
                    }
                )
        ),

    new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Vytvori stylovy embed")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )
        .addUserOption(option =>
            option
                .setName("hrac")
                .setDescription("Hrac")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("styl")
                .setDescription("Styl embedu")
                .setRequired(true)
                .addChoices(
                    ...Object.entries(STYLES).map(([key, style]) => ({
                        name: `${style.emoji} ${style.name}`,
                        value: key
                    }))
                )
        )
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Volitelny text")
                .setRequired(false)
                .setMaxLength(1000)
        ),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazi pomoc"),

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Skontroluje stav bota"),

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Informacie o serveri")

].map(command => command.toJSON());

// ==============================
// REGISTRACIA PRIKAZOV
// ==============================

async function registerCommands() {

    console.log("Registrujem slash prikazy...");

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

        console.log("Slash prikazy boli uspesne zaregistrovane!");

    } catch (error) {

        console.error("Chyba pri registracii prikazov:");
        console.error(error);

    }
}

// ==============================
// INTERACTIONS
// ==============================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    try {

        // ==========================
        // PING
        // ==========================

        if (interaction.commandName === "ping") {

            const ping = client.ws.ping;

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle("🏓 Pong!")
                .setDescription(
                    "Bot funguje spravne.\n\n" +
                    `📡 Ping: **${ping}ms**`
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==========================
        // HELP
        // ==========================

        if (interaction.commandName === "help") {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🤖 Rank Bot")
                .setDescription(
                    "Minecraft Rank System"
                )
                .addFields(
                    {
                        name: "🏆 Rank System",
                        value:
                            "`/addrank` - prida rank\n" +
                            "`/embed` - stylovy embed"
                    },
                    {
                        name: "🛠️ Uzitocne",
                        value:
                            "`/ping` - stav bota\n" +
                            "`/serverinfo` - informacie o serveri\n" +
                            "`/help` - pomoc"
                    },
                    {
                        name: "🏆 Ranky",
                        value: RANKS
                            .map(rank => `\`${rank}\``)
                            .join(" • ")
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

        // ==========================
        // SERVERINFO
        // ==========================

        if (interaction.commandName === "serverinfo") {

            if (!interaction.guild) {

                return interaction.reply({
                    content: "❌ Tento prikaz pouzi na serveri.",
                    ephemeral: true
                });
            }

            const guild = interaction.guild;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`🏰 ${guild.name}`)
                .setThumbnail(
                    guild.iconURL() || null
                )
                .addFields(
                    {
                        name: "👥 Clenovia",
                        value: `${guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: "🆔 Server ID",
                        value: guild.id,
                        inline: true
                    },
                    {
                        name: "📅 Vytvoreny",
                        value:
                            `<t:${Math.floor(
                                guild.createdTimestamp / 1000
                            )}:D>`,
                        inline: true
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==========================
        // ADDRANK
        // ==========================

        if (interaction.commandName === "addrank") {

            if (
                !interaction.memberPermissions ||
                !interaction.memberPermissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Tento prikaz moze pouzivat iba **Administrator**.",
                    ephemeral: true
                });
            }

            const user =
                interaction.options.getUser("hrac");

            const gamemode =
                interaction.options.getString("gamemode");

            const rank =
                interaction.options.getString("rank");

            const note =
                interaction.options.getString("poznamka") ||
                "Bez poznamky";

            const status =
                interaction.options.getString("status") ||
                "SAME";

            let statusText = "⚪ Bez zmeny";
            let color = 0x5865F2;

            if (status === "UP") {
                statusText = "🟢 RANK UP";
                color = 0x57F287;
            }

            if (status === "DOWN") {
                statusText = "🔴 RANK DOWN";
                color = 0xED4245;
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`🏆 ${rank} • Rank Test`)
                .setDescription(
                    `### 👤 <@${user.id}>\n` +
                    "Rank test bol dokončený."
                )
                .setThumbnail(
                    user.displayAvatarURL()
                )
                .addFields(
                    {
                        name: "👤 Hrac",
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
                        name: "📝 Poznamka",
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

        // ==========================
        // EMBED
        // ==========================

        if (interaction.commandName === "embed") {

            if (
                !interaction.memberPermissions ||
                !interaction.memberPermissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Tento prikaz moze pouzivat iba **Administrator**.",
                    ephemeral: true
                });
            }

            const user =
                interaction.options.getUser("hrac");

            const styleKey =
                interaction.options.getString("styl");

            const customText =
                interaction.options.getString("text");

            const style = STYLES[styleKey];

            if (!style) {

                return interaction.reply({
                    content: "❌ Neznamy styl.",
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(style.color)
                .setTitle(
                    `${style.emoji} ${style.name}`
                )
                .setDescription(
                    customText ||
                    `${style.description}\n\n` +
                    `👤 Hrac: <@${user.id}>`
                )
                .setThumbnail(
                    user.displayAvatarURL()
                )
                .setFooter({
                    text: `Minecraft • ${style.name}`
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

    } catch (error) {

        console.error("Interaction error:");
        console.error(error);

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp({
                content:
                    "❌ Nastala chyba pri vykonavani prikazu.",
                ephemeral: true
            });

        } else {

            await interaction.reply({
                content:
                    "❌ Nastala chyba pri vykonavani prikazu.",
                ephemeral: true
            });
        }
    }
});

// ==============================
// BOT READY
// ==============================

client.once("clientReady", readyClient => {

    console.log(
        `Bot je online ako ${readyClient.user.tag}!`
    );

    readyClient.user.setActivity(
        "Minecraft Rank System"
    );
});

// ==============================
// RENDER SERVER
// ==============================

const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Rank Bot is online!");

}).listen(PORT, "0.0.0.0", () => {

    console.log(
        `Web server bezi na porte ${PORT}`
    );
});

// ==============================
// START
// ==============================

async function start() {

    await registerCommands();

    console.log(
        "Pripajam bota na Discord..."
    );

    await client.login(TOKEN);
}

start().catch(error => {

    console.error(
        "Bot sa nepodarilo spustit:"
    );

    console.error(error);

    process.exit(1);
});
```
