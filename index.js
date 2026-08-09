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
const PORT = process.env.PORT || 10000;

if (!TOKEN) {
    console.error("❌ DISCORD_TOKEN nie je nastavený v Environment Variables!");
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

        // HRÁČ
        .addUserOption(option =>
            option
                .setName("hrac")
                .setDescription("Hráč, ktorý bol testovaný")
                .setRequired(true)
        )

        // GAMEMODE - FREE TEXT
        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Gamemode - ľubovoľný text")
                .setRequired(true)
                .setMaxLength(100)
        )

        // PREVIOUS RANK - FREE TEXT
        .addStringOption(option =>
            option
                .setName("previous_rank")
                .setDescription("Predošlý rank - ľubovoľný text")
                .setRequired(true)
                .setMaxLength(50)
        )

        // NEW RANK - FREE TEXT
        .addStringOption(option =>
            option
                .setName("new_rank")
                .setDescription("Nový rank - ľubovoľný text")
                .setRequired(true)
                .setMaxLength(50)
        )

        // STATUS
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

        // RATING
        .addIntegerOption(option =>
            option
                .setName("rating")
                .setDescription("Celkové hodnotenie 1-10")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)
        )

        // ROUNDS
        .addIntegerOption(option =>
            option
                .setName("rounds")
                .setDescription("Počet odohraných kôl")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(1000)
        )

        // TIME
        .addStringOption(option =>
            option
                .setName("cas")
                .setDescription("Čas testu, napr. 12:34")
                .setRequired(false)
                .setMaxLength(30)
        )

        // WINS
        .addIntegerOption(option =>
            option
                .setName("wins")
                .setDescription("Počet vyhraných kôl")
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(1000)
        )

        // LOSSES
        .addIntegerOption(option =>
            option
                .setName("losses")
                .setDescription("Počet prehratých kôl")
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(1000)
        )

        // SCORE
        .addStringOption(option =>
            option
                .setName("score")
                .setDescription("Skóre, napr. 5-2")
                .setRequired(false)
                .setMaxLength(30)
        )

        // POZNÁMKA
        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription("Poznámka testera")
                .setRequired(false)
                .setMaxLength(1000)
        )
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
// /help
// ======================================================

commands.push(
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí pomoc")
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
                    `Bot funguje správne!\n\n📡 Ping: **${client.ws.ping} ms**`
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
                        name: "🏆 Rank System",
                        value:
                            "`/addrank` — pridá výsledok rank testu"
                    },
                    {
                        name: "🛠️ Utility",
                        value:
                            "`/ping` — stav bota\n" +
                            "`/serverinfo` — informácie o serveri\n" +
                            "`/help` — pomoc"
                    },
                    {
                        name: "📊 Rank Test",
                        value:
                            "Gamemode, previous rank, new rank, " +
                            "status, rating, rounds, čas, wins, losses, score a poznámka."
                    }
                )
                .setFooter({
                    text: "Rank Bot • Rank Test System"
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

        if (interaction.commandName === "addrank") {

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

            const time =
                interaction.options.getString("cas");

            const wins =
                interaction.options.getInteger("wins");

            const losses =
                interaction.options.getInteger("losses");

            const score =
                interaction.options.getString("score");

            const note =
                interaction.options.getString("poznamka");

            const tester =
                interaction.user;

            // ==================================================
            // STATUS
            // ==================================================

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

            // ==================================================
            // RATING
            // ==================================================

            let ratingText = "Neuvedené";

            if (rating !== null) {

                const stars =
                    "⭐".repeat(rating);

                ratingText =
                    `${stars} **${rating}/10**`;

            }

            // ==================================================
            // RESULTS
            // ==================================================

            let resultsText = "";

            if (wins !== null) {
                resultsText += `🟢 Wins: **${wins}**\n`;
            }

            if (losses !== null) {
                resultsText += `🔴 Losses: **${losses}**\n`;
            }

            if (score) {
                resultsText += `🏆 Score: **${score}**\n`;
            }

            if (!resultsText) {
                resultsText = "Neuvedené";
            }

            // ==================================================
            // EMBED
            // ==================================================

            const embed =
                new EmbedBuilder()

                    .setColor(color)

                    .setTitle("🏆 RANK TEST")

                    .setDescription(
                        `## 👤 ${player.username}\n` +
                        `${statusText}`
                    )

                    .setThumbnail(
                        player.displayAvatarURL({
                            size: 256
                        })
                    )

                    // PLAYER
                    .addFields(
                        {
                            name: "👤 Hráč",
                            value:
                                `<@${player.id}>\n` +
                                `\`${player.username}\``,
                            inline: true
                        },

                        // GAMEMODE
                        {
                            name: "🎮 Gamemode",
                            value:
                                `\`${gamemode}\``,
                            inline: true
                        },

                        // TESTER
                        {
                            name: "🧪 Tester",
                            value:
                                `<@${tester.id}>`,
                            inline: true
                        },

                        // OLD RANK
                        {
                            name: "📉 Previous Rank",
                            value:
                                `\`${previousRank}\``,
                            inline: true
                        },

                        // NEW RANK
                        {
                            name: "📈 New Rank",
                            value:
                                `\`${newRank}\``,
                            inline: true
                        },

                        // STATUS
                        {
                            name: "📊 Status",
                            value:
                                statusText,
                            inline: true
                        },

                        // RATING
                        {
                            name: "⭐ Hodnotenie",
                            value:
                                ratingText,
                            inline: true
                        },

                        // ROUNDS
                        {
                            name: "🔄 Rounds",
                            value:
                                rounds !== null
                                    ? `**${rounds}**`
                                    : "Neuvedené",
                            inline: true
                        },

                        // TIME
                        {
                            name: "⏱️ Čas",
                            value:
                                time
                                    ? `**${time}**`
                                    : "Neuvedené",
                            inline: true
                        },

                        // RESULTS
                        {
                            name: "⚔️ Výsledky",
                            value:
                                resultsText,
                            inline: true
                        }
                    )

                    .setFooter({
                        text:
                            "CZ/SK/EN Tier Bot • Rank Test System"
                    })

                    .setTimestamp();

            // ==================================================
            // NOTE
            // ==================================================

            if (note) {

                embed.addFields({
                    name: "📝 Poznámka",
                    value: note,
                    inline: false
                });

            }

            // ==================================================
            // SEND
            // ==================================================

            return interaction.reply({
                embeds: [embed]
            });
        }

    } catch (error) {

        console.error("❌ Interaction error:");
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

    console.log("========================================");
    console.log("🤖 BOT JE ONLINE!");
    console.log(`👤 ${client.user.tag}`);
    console.log(`🆔 Client ID: ${CLIENT_ID}`);
    console.log(`🏠 Guild ID: ${GUILD_ID}`);
    console.log("========================================");

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
// HTTP SERVER
// ======================================================

http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type":
            "text/plain; charset=utf-8"
    });

    res.end(
        "CZ/SK/EN Tier Bot is online!"
    );

}).listen(
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
