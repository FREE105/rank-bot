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

const PORT = process.env.PORT || 10000;

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

client.on("error", error => {
    console.error("❌ Discord error:", error);
});

client.on("warn", warning => {
    console.warn("⚠️ Discord warning:", warning);
});

client.on("debug", debug => {
    console.log("🔎 Discord:", debug);
});

// ======================================================
// EMBED ŠTÝLY
// ======================================================

const STYLES = {
    aurora: {
        name: "Polárna žiara",
        emoji: "🌌",
        color: 0x57F287,
        description: "Aurora Borealis"
    },
    snow: {
        name: "Sneženie",
        emoji: "❄️",
        color: 0xDDEEFF,
        description: "Zimná snehová atmosféra"
    },
    fire: {
        name: "Oheň",
        emoji: "🔥",
        color: 0xFF4500,
        description: "Horúca ohnivá atmosféra"
    },
    ice: {
        name: "Ľad",
        emoji: "🧊",
        color: 0x00BFFF,
        description: "Mrazivá ľadová atmosféra"
    },
    ocean: {
        name: "Oceán",
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
        name: "Západ slnka",
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
        name: "Dúha",
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
        name: "Púšť",
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
        description: "Cyber World"
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
        description: "Golden Style"
    },
    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        description: "Minecraft Style"
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
        .setDescription("Pridá výsledok rank testu")
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
                .setDescription("Ľubovoľný gamemode")
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("previous_rank")
                .setDescription("Predošlý rank")
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
                .setName("poznamka")
                .setDescription("Voliteľná poznámka")
                .setRequired(false)
                .setMaxLength(1000)
        )
);

// ======================================================
// /embed
// ======================================================

const embedCommand = new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Vytvorí tematický embed")
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
            .setName("styl")
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
            .setMaxLength(1500)
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
// REGISTER COMMANDS
// ======================================================

async function registerCommands() {
    console.log("🔄 Registrujem slash príkazy...");

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    await rest.put(
        Routes.applicationGuildCommands(
            CLIENT_ID,
            GUILD_ID
        ),
        {
            body: commands.map(command => command.toJSON())
        }
    );

    console.log("✅ Slash príkazy zaregistrované!");
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
                    `Bot funguje správne!\n\n📡 Ping: ${client.ws.ping} ms`
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
                .setDescription("Minecraft Rank Test System")
                .addFields(
                    {
                        name: "🏆 Rank System",
                        value:
                            "`/addrank` — pridá výsledok rank testu\n" +
                            "`/embed` — vytvorí tematický embed"
                    },
                    {
                        name: "🛠️ Utility",
                        value:
                            "`/ping` — stav bota\n" +
                            "`/serverinfo` — informácie o serveri\n" +
                            "`/help` — pomoc"
                    },
                    {
                        name: "🎨 Embedy",
                        value:
                            "`/embed` obsahuje 20 tematických štýlov."
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
        // SERVERINFO
        // ==================================================

        if (interaction.commandName === "serverinfo") {

            if (!interaction.guild) {
                return interaction.reply({
                    content: "❌ Tento príkaz musíš použiť na serveri.",
                    ephemeral: true
                });
            }

            const guild = interaction.guild;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`🏰 ${guild.name}`)
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
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // ADMIN CHECK
        // ==================================================

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
                        "❌ Tento príkaz môže používať iba Administrator.",
                    ephemeral: true
                });
            }
        }

        // ==================================================
        // ADDRANK
        // ==================================================

        if (interaction.commandName === "addrank") {

            const player =
                interaction.options.getUser("hrac");

            const gamemode =
                interaction.options.getString("gamemode");

            const previousRank =
                interaction.options.getString("previous_rank");

            const newRank =
                interaction.options.getString("new_rank");

            const status =
                interaction.options.getString("status") || "SAME";

            const note =
                interaction.options.getString("poznamka");

            const tester =
                interaction.user;

            let statusText = "⚪ BEZ ZMENY";
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
                .setTitle("🏆 Rank Test")
                .setDescription(
                    `### 👤 ${player.username}\n` +
                    "Výsledok rank testu"
                )
                .setThumbnail(
                    player.displayAvatarURL()
                )
                .addFields(
                    {
                        name: "👤 Hráč",
                        value:
                            `<@${player.id}>\n\`${player.username}\``,
                        inline: true
                    },
                    {
                        name: "🎮 Gamemode",
                        value: gamemode,
                        inline: true
                    },
                    {
                        name: "🧪 Tester",
                        value:
                            `<@${tester.id}>\n\`${tester.username}\``,
                        inline: true
                    },
                    {
                        name: "📉 Previous Rank",
                        value: previousRank,
                        inline: true
                    },
                    {
                        name: "📈 New Rank",
                        value: newRank,
                        inline: true
                    },
                    {
                        name: "📊 Status",
                        value: statusText,
                        inline: true
                    }
                )
                .setFooter({
                    text: "Rank Bot • Rank Test System"
                })
                .setTimestamp();

            if (note) {
                embed.addFields({
                    name: "📝 Poznámka",
                    value: note,
                    inline: false
                });
            }

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // EMBED
        // ==================================================

        if (interaction.commandName === "embed") {

            const player =
                interaction.options.getUser("hrac");

            const styleKey =
                interaction.options.getString("styl");

            const customText =
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
                customText ||
                `${style.description}\n\n👤 Hráč: <@${player.id}>`;

            const embed = new EmbedBuilder()
                .setColor(style.color)
                .setTitle(
                    `${style.emoji} ${style.name}`
                )
                .setDescription(description)
                .setThumbnail(
                    player.displayAvatarURL()
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

        console.error("❌ Interaction error:");
        console.error(error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content:
                    "❌ Nastala chyba pri vykonávaní príkazu.",
                ephemeral: true
            });
        }
    }
});

// ======================================================
// READY
// ======================================================

client.once("ready", async () => {

    console.log(
        `🤖 BOT JE ONLINE ako ${client.user.tag}`
    );

    console.log(
        `🏠 Server ID: ${GUILD_ID}`
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
        console.error(error);
    }
});

// ======================================================
// RENDER HTTP SERVER
// ======================================================

http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Rank Bot is online!");

}).listen(PORT, "0.0.0.0", () => {

    console.log(
        `🌐 HTTP server beží na porte ${PORT}`
    );
});

// ======================================================
// LOGIN
// ======================================================

console.log("🔄 Skúšam pripojiť Discord...");

client.login(TOKEN)
    .then(() => {
        console.log("🔐 Discord login OK");
    })
    .catch(error => {
        console.error(
            "❌ Discord login zlyhal:"
        );
        console.error(error);
        process.exit(1);
    });
