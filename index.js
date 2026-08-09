const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    REST,
    Routes
} = require("discord.js");

const http = require("http");

// ======================================================
// NASTAVENIE
// ======================================================

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || "1535978914843729970";
const GUILD_ID = process.env.GUILD_ID || "1523657617698984038";
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

        // ==================================================
        // ZÁKLAD
        // ==================================================

        .addUserOption(option =>
            option
                .setName("hrac")
                .setDescription("Hráč")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Gamemode - FREE TEXT")
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("previous_rank")
                .setDescription("Predošlý rank - FREE TEXT")
                .setRequired(true)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("new_rank")
                .setDescription("Nový rank - FREE TEXT")
                .setRequired(true)
                .setMaxLength(100)
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

        // ==================================================
        // HODNOTENIE
        // ==================================================

        .addStringOption(option =>
            option
                .setName("hodnotenie")
                .setDescription("Celkové hodnotenie, napr. 8.5/10")
                .setRequired(false)
                .setMaxLength(50)
        )

        // ==================================================
        // ĎALŠIE UŽITOČNÉ POLIA
        // ==================================================

        .addStringOption(option =>
            option
                .setName("typ_testu")
                .setDescription("Typ testu, napr. 1v1, FT5, Tournament")
                .setRequired(false)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("pocet_hier")
                .setDescription("Počet odohraných hier")
                .setRequired(false)
                .setMaxLength(50)
        )

        .addStringOption(option =>
            option
                .setName("vyhry")
                .setDescription("Počet výhier")
                .setRequired(false)
                .setMaxLength(50)
        )

        .addStringOption(option =>
            option
                .setName("prehry")
                .setDescription("Počet prehier")
                .setRequired(false)
                .setMaxLength(50)
        )

        .addStringOption(option =>
            option
                .setName("cas_testu")
                .setDescription("Dĺžka testu, napr. 30 min")
                .setRequired(false)
                .setMaxLength(50)
        )

        .addStringOption(option =>
            option
                .setName("vykon")
                .setDescription("Celkový výkon")
                .setRequired(false)
                .setMaxLength(100)
        )

        .addStringOption(option =>
            option
                .setName("silne_stranky")
                .setDescription("Silné stránky hráča")
                .setRequired(false)
                .setMaxLength(500)
        )

        .addStringOption(option =>
            option
                .setName("slabe_stranky")
                .setDescription("Slabé stránky hráča")
                .setRequired(false)
                .setMaxLength(500)
        )

        .addStringOption(option =>
            option
                .setName("dovod_ranku")
                .setDescription("Dôvod udelenia výsledného ranku")
                .setRequired(false)
                .setMaxLength(500)
        )

        .addStringOption(option =>
            option
                .setName("poznamka")
                .setDescription("Ďalšia poznámka")
                .setRequired(false)
                .setMaxLength(1000)
        )
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

        console.log("✅ Slash príkazy zaregistrované!");

    } catch (error) {

        console.error("❌ Registrácia príkazov zlyhala:");
        console.error(error);

    }
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
                    `Bot funguje správne!\n\n` +
                    `📡 Ping: **${client.ws.ping}ms**`
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
                            "`/serverinfo` — informácie o serveri"
                    },
                    {
                        name: "📝 FREE TEXT",
                        value:
                            "Gamemode, Previous Rank a New Rank " +
                            "môžu obsahovať ľubovoľný text."
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
                    content:
                        "❌ Tento príkaz musíš použiť na serveri.",
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

            // ZÁKLAD
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

            // HODNOTENIE
            const hodnotenie =
                interaction.options.getString("hodnotenie");

            // ĎALŠIE
            const typTestu =
                interaction.options.getString("typ_testu");

            const pocetHier =
                interaction.options.getString("pocet_hier");

            const vyhry =
                interaction.options.getString("vyhry");

            const prehry =
                interaction.options.getString("prehry");

            const casTestu =
                interaction.options.getString("cas_testu");

            const vykon =
                interaction.options.getString("vykon");

            const silneStranky =
                interaction.options.getString("silne_stranky");

            const slabeStranky =
                interaction.options.getString("slabe_stranky");

            const dovodRanku =
                interaction.options.getString("dovod_ranku");

            const poznamka =
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
            // EMBED
            // ==================================================

            const embed = new EmbedBuilder()

                .setColor(color)

                .setTitle("🏆 RANK TEST")

                .setDescription(
                    `### 👤 ${player.username}\n` +
                    `Výsledok rank testu`
                )

                .setThumbnail(
                    player.displayAvatarURL({
                        size: 256
                    })
                )

                .addFields(

                    // HRÁČ
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
                            `**${gamemode}**`,
                        inline: true
                    },

                    // TESTER
                    {
                        name: "🧪 Testoval",
                        value:
                            `<@${tester.id}>\n` +
                            `\`${tester.username}\``,
                        inline: true
                    },

                    // PREVIOUS
                    {
                        name: "📉 Predošlý rank",
                        value:
                            `\`${previousRank}\``,
                        inline: true
                    },

                    // NEW
                    {
                        name: "📈 Nový rank",
                        value:
                            `\`${newRank}\``,
                        inline: true
                    },

                    // STATUS
                    {
                        name: "📊 Výsledok",
                        value:
                            `**${statusText}**`,
                        inline: true
                    }

                );

            // ==================================================
            // HODNOTENIE
            // ==================================================

            if (hodnotenie) {

                embed.addFields({
                    name: "⭐ Hodnotenie",
                    value: `**${hodnotenie}**`,
                    inline: true
                });

            }

            // ==================================================
            // TEST INFO
            // ==================================================

            if (typTestu) {

                embed.addFields({
                    name: "🧪 Typ testu",
                    value: typTestu,
                    inline: true
                });

            }

            if (pocetHier) {

                embed.addFields({
                    name: "🎮 Počet hier",
                    value: pocetHier,
                    inline: true
                });

            }

            if (vyhry) {

                embed.addFields({
                    name: "🏆 Výhry",
                    value: vyhry,
                    inline: true
                });

            }

            if (prehry) {

                embed.addFields({
                    name: "❌ Prehry",
                    value: prehry,
                    inline: true
                });

            }

            if (casTestu) {

                embed.addFields({
                    name: "⏱️ Čas testu",
                    value: casTestu,
                    inline: true
                });

            }

            if (vykon) {

                embed.addFields({
                    name: "💪 Výkon",
                    value: vykon,
                    inline: true
                });

            }

            // ==================================================
            // SILNÉ / SLABÉ STRÁNKY
            // ==================================================

            if (silneStranky) {

                embed.addFields({
                    name: "💪 Silné stránky",
                    value: silneStranky,
                    inline: false
                });

            }

            if (slabeStr
