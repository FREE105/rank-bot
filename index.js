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
const CLIENT_ID = process.env.CLIENT_ID || "1535978914843729970";
const GUILD_ID = process.env.GUILD_ID || "1523657617698984038";
const PORT = process.env.PORT || 3000;

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
// 20 EMBED THEMES
// ======================================================

const THEMES = {
    aurora: {
        name: "Polárna žiara",
        emoji: "🌌",
        color: 0x57F287,
        image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=80"
    },

    snow: {
        name: "Sneženie",
        emoji: "❄️",
        color: 0xDDEEFF,
        image: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1600&q=80"
    },

    fire: {
        name: "Oheň",
        emoji: "🔥",
        color: 0xFF4500,
        image: "https://images.unsplash.com/photo-1475598322381-0f8b6f9f5f2f?auto=format&fit=crop&w=1600&q=80"
    },

    ice: {
        name: "Ľad",
        emoji: "🧊",
        color: 0x00BFFF,
        image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=80"
    },

    ocean: {
        name: "Oceán",
        emoji: "🌊",
        color: 0x0077FF,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
    },

    space: {
        name: "Vesmír",
        emoji: "🚀",
        color: 0x6C5CE7,
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80"
    },

    galaxy: {
        name: "Galaxia",
        emoji: "🌠",
        color: 0x9B59B6,
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80"
    },

    sunset: {
        name: "Západ slnka",
        emoji: "🌅",
        color: 0xFF7675,
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80"
    },

    storm: {
        name: "Búrka",
        emoji: "⛈️",
        color: 0x5865F2,
        image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1600&q=80"
    },

    rainbow: {
        name: "Dúha",
        emoji: "🌈",
        color: 0xFF69B4,
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
    },

    forest: {
        name: "Les",
        emoji: "🌲",
        color: 0x228B22,
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80"
    },

    desert: {
        name: "Púšť",
        emoji: "🏜️",
        color: 0xE6A23C,
        image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=80"
    },

    volcano: {
        name: "Sopka",
        emoji: "🌋",
        color: 0xC0392B,
        image: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=1600&q=80"
    },

    toxic: {
        name: "Toxic",
        emoji: "☢️",
        color: 0xA3FF12,
        image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80"
    },

    cyber: {
        name: "Cyber",
        emoji: "💻",
        color: 0x00FFCC,
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80"
    },

    blood: {
        name: "Blood",
        emoji: "🩸",
        color: 0x8B0000,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80"
    },

    shadow: {
        name: "Shadow",
        emoji: "🌑",
        color: 0x202020,
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80"
    },

    diamond: {
        name: "Diamant",
        emoji: "💎",
        color: 0x00FFFF,
        image: "https://images.unsplash.com/photo-1615655114865-4ccf2e5b2f6b?auto=format&fit=crop&w=1600&q=80"
    },

    gold: {
        name: "Gold",
        emoji: "🏆",
        color: 0xFFD700,
        image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80"
    },

    minecraft: {
        name: "Minecraft",
        emoji: "⛏️",
        color: 0x55AA55,
        image: "https://images.unsplash.com/photo-1607513746994-51f730a44832?auto=format&fit=crop&w=1600&q=80"
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
                .setDescription("Predošlý rank – voľný text")
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("new_rank")
                .setDescription("Nový rank – voľný text")
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("status")
                .setDescription("Výsledok testu")
                .setRequired(true)
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

        .addIntegerOption(option =>
            option
                .setName("rating")
                .setDescription("Hodnotenie testu 1–10")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)
        )

        .addIntegerOption(option =>
            option
                .setName("rounds")
                .setDescription("Počet kôl")
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(999)
        )

        .addIntegerOption(option =>
            option
                .setName("wins")
                .setDescription("Počet výhier")
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(999)
        )

        .addIntegerOption(option =>
            option
                .setName("losses")
                .setDescription("Počet prehier")
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(999)
        )

        .addIntegerOption(option =>
            option
                .setName("score")
                .setDescription("Skóre")
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(999999)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription("Poznámka k testu")
                .setRequired(false)
                .setMaxLength(1000)
        )

        .addStringOption(option =>
            option
                .setName("tema")
                .setDescription("Štýl embedu")
                .setRequired(false)
                .addChoices(
                    ...Object.entries(THEMES).map(([value, theme]) => ({
                        name: `${theme.emoji} ${theme.name}`,
                        value
                    }))
                )
        )
        .toJSON()
);

// ======================================================
// /embed
// ======================================================

commands.push(
    new SlashCommandBuilder()
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
                .setName("tema")
                .setDescription("Vyber tému")
                .setRequired(true)
                .addChoices(
                    ...Object.entries(THEMES).map(([value, theme]) => ({
                        name: `${theme.emoji} ${theme.name}`,
                        value
                    }))
                )
        )

        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Text embedu")
                .setRequired(false)
                .setMaxLength(1500)
        )
        .toJSON()
);

// ======================================================
// /ping
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Skontroluje stav bota")
        .toJSON()
);

// ======================================================
// /help
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí pomoc")
        .toJSON()
);

// ======================================================
// /serverinfo
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Informácie o serveri")
        .toJSON()
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
            body: commands
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
                .setTitle("🤖 CZ/SK/EN Tier Bot")
                .setDescription(
                    "Minecraft Rank Test System"
                )
                .addFields(
                    {
                        name: "🏆 Rank Test",
                        value:
                            "`/addrank` — vytvorí výsledok rank testu"
                    },
                    {
                        name: "🎨 Embedy",
                        value:
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
                        name: "📊 Rank Test obsahuje",
                        value:
                            "Gamemode • Previous Rank • New Rank • Rating • Rounds • Wins • Losses • Score • Poznámka"
                    }
                )
                .setFooter({
                    text: "CZ/SK/EN Tier Bot"
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // SERVER INFO
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
                interaction.options.getString("status");

            const rating =
                interaction.options.getInteger("rating");

            const rounds =
                interaction.options.getInteger("rounds");

            const wins =
                interaction.options.getInteger("wins");

            const losses =
                interaction.options.getInteger("losses");

            const score =
                interaction.options.getInteger("score");

            const note =
                interaction.options.getString("poznamka");

            const themeKey =
                interaction.options.getString("tema") || "aurora";

            const theme =
                THEMES[themeKey];

            const tester =
                interaction.user;

            // STATUS

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

            // RATING

            let ratingText = "Neuvedené";

            if (rating !== null) {

                const fullStars =
                    "⭐".repeat(rating);

                const emptyStars =
                    "☆".repeat(10 - rating);

                ratingText =
                    `${fullStars}${emptyStars} **${rating}/10**`;
            }

            // SCORE

            let scoreText = "Neuvedené";

            if (score !== null) {
                scoreText = `🏆 **${score}**`;
            }

            // ROUNDS

            let roundsText = "Neuvedené";

            if (rounds !== null) {
                roundsText = `🔄 **${rounds}**`;
            }

            // WINS / LOSSES

            let winsText =
                wins !== null
                    ? `🟢 ${wins}`
                    : "Neuvedené";

            let lossesText =
                losses !== null
                    ? `🔴 ${losses}`
                    : "Neuvedené";

            // EMBED

            const embed =
                new EmbedBuilder()
                    .setColor(color)

                    .setTitle(
                        `${theme.emoji} Rank Test • ${theme.name}`
                    )

                    .setDescription(
                        `## 👤 ${player.username}\n` +
                        `${statusText}\n\n` +
                        `**🎮 Gamemode:** ${gamemode}`
                    )

                    .setThumbnail(
                        player.displayAvatarURL({
                            size: 256
                        })
                    )

                    .addFields(

                        {
                            name: "👤 Hráč",
                            value:
                                `<@${player.id}>\n\`${player.username}\``,
                            inline: true
                        },

                        {
                            name: "🧪 Tester",
                            value:
                                `<@${tester.id}>\n\`${tester.username}\``,
                            inline: true
                        },

                        {
                            name: "🎮 Gamemode",
                            value:
                                gamemode,
                            inline: true
                        },

                        {
                            name: "📉 Previous Rank",
                            value:
                                previousRank,
                            inline: true
                        },

                        {
                            name: "📈 New Rank",
                            value:
                                newRank,
                            inline: true
                        },

                        {
                            name: "📊 Status",
                            value:
                                statusText,
                            inline: true
                        },

                        {
                            name: "⭐ Hodnotenie",
                            value:
                                ratingText,
                            inline: false
                        },

                        {
                            name: "🔄 Rounds",
                            value:
                                roundsText,
                            inline: true
                        },

                        {
                            name: "🏆 Score",
                            value:
                                scoreText,
                            inline: true
                        },

                        {
                            name: "⚔️ Výhry",
                            value:
                                winsText,
                            inline: true
                        },

                        {
                            name: "💀 Prehry",
                            value:
                                lossesText,
                            inline: true
                        }
                    )

                    .setFooter({
                        text:
                            `CZ/SK/EN Tier Bot • ${theme.name}`
                    })

                    .setTimestamp();

            if (note) {

                embed.addFields({
                    name: "📝 Poznámka",
                    value: note,
                    inline: false
                });
            }

            // LARGE THEME IMAGE

            if (theme.image) {

                embed.setImage(
                    theme.image
                );
            }

            return interaction.reply({
                embeds: [embed]
            });
        }

        // ==================================================
        // EMBED COMMAND
        // ==================================================

        if (interaction.commandName === "embed") {

            const player =
                interaction.options.getUser("hrac");

            const themeKey =
                interaction.options.getString("tema");

            const customText =
                interaction.options.getString("text");

            const theme =
                THEMES[themeKey];

            if (!theme) {

                return interaction.reply({
                    content:
                        "❌ Neznáma téma.",
                    ephemeral: true
                });
            }

            const description =
                customText ||
                `${theme.name}\n\n👤 Hráč: <@${player.id}>`;

            const embed =
                new EmbedBuilder()
                    .setColor(theme.color)

                    .setTitle(
                        `${theme.emoji} ${theme.name}`
                    )

                    .setDescription(
                        description
                    )

                    .setThumbnail(
                        player.displayAvatarURL({
                            size: 256
                        })
                    )

                    .setImage(
                        theme.image
                    )

                    .setFooter({
                        text:
                            `CZ/SK/EN Tier Bot • ${theme.name}`
                    })

                    .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

    } catch (error) {

        console.error(
            "❌ Interaction error:"
        );

        console.error(error);

        if (
            !interaction.replied &&
            !interaction.deferred
        ) {

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
            "❌ Registrácia príkazov zlyhala:"
        );

        console.error(error);
    }
});

// ======================================================
// HTTP SERVER FOR RAILWAY
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
)
.listen(
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

client.login(TOKEN)
    .then(() => {

        console.log(
            "🔐 Discord login OK"
        );

    })
    .catch(error => {

        console.error(
            "❌ Discord login zlyhal:"
        );

        console.error(error);

        process.exit(1);
    });
