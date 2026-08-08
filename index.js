
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
    console.error("CHYBA: DISCORD_TOKEN nie je nastaveny!");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});


// ======================================================
// RANKY
// ======================================================

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


// ======================================================
// EMBED STYLY
// ======================================================

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
        description: "Galaxy"
    },

    sunset: {
        name: "Zapad slnka",
        emoji: "🌅",
        color: 0xFF7675,
        description: "Golden Sunset"
    },

    storm: {
        name: "Búrka",
        emoji: "⛈️",
        color: 0x5865F2,
        description: "Thunderstorm"
    },

    rainbow: {
        name: "Duha",
        emoji: "🌈",
        color: 0xFF69B4,
        description: "Rainbow"
    },

    forest: {
        name: "Les",
        emoji: "🌲",
        color: 0x228B22,
        description: "Deep Forest"
    },

    desert: {
        name: "Pust",
        emoji: "🏜️",
        color: 0xE6A23C,
        description: "Desert"
    },

    volcano: {
        name: "Sopka",
        emoji: "🌋",
        color: 0xC0392B,
        description: "Volcano"
    },

    toxic: {
        name: "Toxic",
        emoji: "☢️",
        color: 0xA3FF12,
        description: "Toxic Zone"
    },

    cyber: {
        name: "Cyber",
        emoji: "💻",
        color: 0x00FFCC,
        description: "Cyber"
    },

    blood: {
        name: "Blood",
        emoji: "🩸",
        color: 0x8B0000,
        description: "Dark Blood"
    },

    shadow: {
        name: "Shadow",
        emoji: "🌑",
        color: 0x202020,
        description: "Dark Shadow"
    },

    diamond: {
        name: "Diamant",
        emoji: "💎",
        color: 0x00FFFF,
        description: "Diamond"
    },

    gold: {
        name: "Gold",
        emoji: "🏆",
        color: 0xFFD700,
        description: "Golden"
    },

    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        description: "Minecraft"
    }
};


// ======================================================
// COMMANDS
// ======================================================

const commands = [];

// ADDRANK

commands.push(
    new SlashCommandBuilder()
        .setName("addrank")
        .setDescription("Prida hracovi rank")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        )
        .addUserOption(function(option) {
            return option
                .setName("hrac")
                .setDescription("Hrac")
                .setRequired(true);
        })
        .addStringOption(function(option) {
            return option
                .setName("gamemode")
                .setDescription("Napis lubovolny gamemode")
                .setRequired(true)
                .setMaxLength(100);
        })
        .addStringOption(function(option) {
            return option
                .setName("rank")
                .setDescription("Vyber rank")
                .setRequired(true)
                .addChoices(
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
                );
        })
        .addStringOption(function(option) {
            return option
                .setName("poznamka")
                .setDescription("Volitelna poznamka")
                .setRequired(false)
                .setMaxLength(1000);
        })
        .addStringOption(function(option) {
            return option
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
                );
        })
);


// EMBED

const embedCommand = new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Vytvori stylovy embed")
    .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator.toString()
    )
    .addUserOption(function(option) {
        return option
            .setName("hrac")
            .setDescription("Hrac")
            .setRequired(true);
    })
    .addStringOption(function(option) {
        return option
            .setName("styl")
            .setDescription("Vyber styl")
            .setRequired(true);
    })
    .addStringOption(function(option) {
        return option
            .setName("text")
            .setDescription("Volitelny text")
            .setRequired(false)
            .setMaxLength(1000);
    });


// EMBED CHOICES

embedCommand.options[1].addChoices(
    { name: "🌌 Polarna ziara", value: "aurora" },
    { name: "❄️ Snezenie", value: "snow" },
    { name: "🔥 Ohen", value: "fire" },
    { name: "🧊 Lad", value: "ice" },
    { name: "🌊 Ocean", value: "ocean" },
    { name: "🚀 Vesmír", value: "space" },
    { name: "🌠 Galaxia", value: "galaxy" },
    { name: "🌅 Zapad slnka", value: "sunset" },
    { name: "⛈️ Búrka", value: "storm" },
    { name: "🌈 Duha", value: "rainbow" },
    { name: "🌲 Les", value: "forest" },
    { name: "🏜️ Pust", value: "desert" },
    { name: "🌋 Sopka", value: "volcano" },
    { name: "☢️ Toxic", value: "toxic" },
    { name: "💻 Cyber", value: "cyber" },
    { name: "🩸 Blood", value: "blood" },
    { name: "🌑 Shadow", value: "shadow" },
    { name: "💎 Diamant", value: "diamond" },
    { name: "🏆 Gold", value: "gold" },
    { name: "⛏️ Minecraft", value: "minecraft" }
);

commands.push(embedCommand);


// HELP

commands.push(
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazi pomoc")
);


// PING

commands.push(
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Skontroluje stav bota")
);


// SERVERINFO

commands.push(
    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Informacie o serveri")
);


// ======================================================
// REGISTER
// ======================================================

async function registerCommands() {

    console.log("Registrujem slash prikazy...");

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    try {

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: commands.map(function(command) {
                    return command.toJSON();
                })
            }
        );

        console.log("Slash prikazy boli zaregistrovane!");

    } catch (error) {

        console.error("Chyba pri registracii:");
        console.error(error);

    }
}


// ======================================================
// INTERACTIONS
// ======================================================

client.on("interactionCreate", async function(interaction) {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    try {

        // =========================
        // PING
        // =========================

        if (interaction.commandName === "ping") {

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle("🏓 Pong!")
                .setDescription(
                    "Bot funguje!\n\n" +
                    "📡 Ping: " +
                    client.ws.ping +
                    "ms"
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }


        // =========================
        // HELP
        // =========================

        if (interaction.commandName === "help") {

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🤖 Rank Bot")
                .setDescription(
                    "Minecraft Rank System"
                )
                .addFields(
                    {
                        name: "🏆 Rank",
                        value:
                            "/addrank - pridat rank\n" +
                            "/embed - vytvorit stylovy embed"
                    },
                    {
                        name: "🛠️ Utility",
                        value:
                            "/ping - stav bota\n" +
                            "/serverinfo - informacie o serveri"
                    },
                    {
                        name: "🏆 Ranky",
                        value:
                            "LT1 • LT2 • LT3 • LT4 • LT5\n" +
                            "HT1 • HT2 • HT3 • HT4 • HT5"
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }


        // =========================
        // SERVERINFO
        // =========================

        if (interaction.commandName === "serverinfo") {

            if (!interaction.guild) {

                return interaction.reply({
                    content: "❌ Pouzi tento prikaz na serveri.",
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
                        name: "👥 Clenovia",
                        value: String(guild.memberCount),
                        inline: true
                    },
                    {
                        name: "🆔 ID",
                        value: guild.id,
                        inline: true
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }


        // =========================
        // PERMISSION CHECK
        // =========================

        if (
            interaction.commandName === "addrank" ||
            interaction.commandName === "embed"
        ) {

            if (
                !interaction.memberPermissions ||
                !interaction.memberPermissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:
                        "❌ Tento prikaz moze pouzivat iba Administrator.",
                    ephemeral: true
                });
            }
        }


        // =========================
        // ADDRANK
        // =========================

        if (interaction.commandName === "addrank") {

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
                .setTitle("🏆 " + rank + " • Rank Test")
                .setDescription(
                    "### 👤 " +
                    user.username +
                    "\nRank test bol dokončený."
                )
                .setThumbnail(
                    user.displayAvatarURL()
                )
                .addFields(
                    {
                        name: "👤 Hrac",
                        value: "<@" + user.id + ">",
                        inline: true
                    },
                    {
                        name: "🎮 Gamemode",
                        value: gamemode,
                        inline: true
                    },
                    {
                        name: "🏆 Rank",
                        value: "**" + rank + "**",
                        inline: true
                    },
                    {
                        name: "📊 Status",
                        value: statusText,
                        inline: true
                    },
                    {
                        name: "🧪 Testoval",
                        value: "<@" + interaction.user.id + ">",
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


        // =========================
        // EMBED
        // =========================

        if (interaction.commandName === "embed") {

            const user =
                interaction.options.getUser("hrac");

            const styleKey =
                interaction.options.getString("styl");

            const text =
                interaction.options.getString("text");

            const style =
                STYLES[styleKey];

            if (!style) {

                return interaction.reply({
                    content: "❌ Neznamy styl.",
                    ephemeral: true
                });
            }

            const description =
                text ||
                style.description +
                "\n\n👤 Hrac: <@" +
                user.id +
                ">";

            const embed = new EmbedBuilder()
                .setColor(style.color)
                .setTitle(
                    style.emoji +
                    " " +
                    style.name
                )
                .setDescription(description)
                .setThumbnail(
                    user.displayAvatarURL()
                )
                .setFooter({
                    text:
                        "Minecraft • " +
                        style.name
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

    } catch (error) {

        console.error("Interaction error:");
        console.error(error);

        if (!interaction.replied) {

            await interaction.reply({
                content:
                    "❌ Nastala chyba pri vykonavani prikazu.",
                ephemeral: true
            });

        }
    }
});


// ======================================================
// READY
// ======================================================

client.once("clientReady", function() {

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

http.createServer(function(req, res) {

    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Rank Bot is online!");

}).listen(PORT, "0.0.0.0", function() {

    console.log(
        "Web server bezi na porte " +
        PORT
    );
});


// ======================================================
// START
// ======================================================

async function start() {

    await registerCommands();

    console.log(
        "Pripajam bota na Discord..."
    );

    await client.login(TOKEN);
}

start().catch(function(error) {

    console.error(
        "BOT SA NEPODARILO SPUSTIT:"
    );

    console.error(error);

    process.exit(1);
});

