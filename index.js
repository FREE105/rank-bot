const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes
} = require("discord.js");

const fs = require("fs");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = "1535739014760632330";

// NÁZOV ROLE, KTORÁ MÔŽE EDITOVAŤ RANKY
const RANK_EDITOR_ROLE = "Rank editor";

const DB_FILE = "./ranks.json";

// =========================
// DATABASE
// =========================

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
}

function loadRanks() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    } catch {
        return {};
    }
}

function saveRanks(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// =========================
// CLIENT
// =========================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// =========================
// RANKY
// =========================

const rankChoices = [
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

// =========================
// SLASH COMMANDS
// =========================

const commands = [

    new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Zobrazí rank hráča")
        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("setrank")
        .setDescription("Nastaví rank hráča")
        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("gamemode")
                .setDescription("Gamemode")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("rank")
                .setDescription("Vyber rank")
                .setRequired(true)
                .addChoices(...rankChoices)
        )
        .addStringOption(option =>
            option
                .setName("poznámka")
                .setDescription("Poznámka k testu")
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("removerank")
        .setDescription("Odstráni rank hráča")
        .addUserOption(option =>
            option
                .setName("hráč")
                .setDescription("Hráč")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("ranks")
        .setDescription("Zobrazí všetkých hráčov s rankom")

].map(command => command.toJSON());

// =========================
// REGISTRÁCIA PRÍKAZOV
// =========================

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerCommands() {
    try {
        console.log("Registrujem slash príkazy...");

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log("Slash príkazy zaregistrované!");
    } catch (error) {
        console.error(error);
    }
}

// =========================
// KONTROLA ROLE
// =========================

function isRankEditor(interaction) {

    if (!interaction.guild) return false;

    const member = interaction.member;

    return member.roles.cache.some(
        role => role.name === RANK_EDITOR_ROLE
    );
}

// =========================
// READY
// =========================

client.once("ready", () => {

    console.log(`Bot je online ako ${client.user.tag}!`);

    client.user.setPresence({
        activities: [
            {
                name: "Minecraft Rank System",
                type: 0
            }
        ],
        status: "online"
    });
});

// =========================
// INTERACTIONS
// =========================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    // =========================
    // KONTROLA RANK EDITORA
    // =========================

    if (
        interaction.commandName === "setrank" ||
        interaction.commandName === "removerank"
    ) {

        if (!isRankEditor(interaction)) {

            return interaction.reply({
                content: "❌ Tento príkaz môže používať iba tím **Rank editor**.",
                ephemeral: true
            });
        }
    }

    const ranks = loadRanks();

    // =========================
    // /rank
    // =========================

    if (interaction.commandName === "rank") {

        const user = interaction.options.getUser("hráč");
        const data = ranks[user.id];

        if (!data) {

            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("❌ Rank nenájdený")
                .setDescription(
                    `Hráč **${user.username}** zatiaľ nemá nastavený rank.`
                )
                .setThumbnail(user.displayAvatarURL());

            return interaction.reply({
                embeds: [embed]
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("🏆 Minecraft Rank")
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                {
                    name: "👤 Hráč",
                    value: `<@${user.id}>`,
                    inline: true
                },
                {
                    name: "🎮 Gamemode",
                    value: data.gamemode,
                    inline: true
                },
                {
                    name: "🏆 Rank",
                    value: `**${data.rank}**`,
                    inline: true
                },
                {
                    name: "🧪 Testoval",
                    value: `<@${data.tester}>`,
                    inline: true
                },
                {
                    name: "📝 Poznámka",
                    value: data.note || "Bez poznámky",
                    inline: false
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

    // =========================
    // /setrank
    // =========================

    if (interaction.commandName === "setrank") {

        const user = interaction.options.getUser("hráč");
        const gamemode = interaction.options.getString("gamemode");
        const rank = interaction.options.getString("rank");

        const note =
            interaction.options.getString("poznámka") ||
            "Bez poznámky";

        ranks[user.id] = {
            username: user.username,
            gamemode: gamemode,
            rank: rank,
            note: note,
            tester: interaction.user.id,
            updatedAt: new Date().toISOString()
        };

        saveRanks(ranks);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("🏆 Rank test dokončený")
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
                text: "Minecraft Rank System • Rank editor"
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }

    // =========================
    // /removerank
    // =========================

    if (interaction.commandName === "removerank") {

        const user = interaction.options.getUser("hráč");

        if (!ranks[user.id]) {

            return interaction.reply({
                content: "❌ Tento hráč nemá uložený rank.",
                ephemeral: true
            });
        }

        delete ranks[user.id];

        saveRanks(ranks);

        const embed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle("🗑️ Rank odstránený")
            .setDescription(
                `Rank hráča **${user.username}** bol odstránený.`
            )
            .setThumbnail(user.displayAvatarURL());

        return interaction.reply({
            embeds: [embed]
        });
    }

    // =========================
    // /ranks
    // =========================

    if (interaction.commandName === "ranks") {

        const entries = Object.entries(ranks);

        if (entries.length === 0) {

            return interaction.reply({
                content: "📭 Zatiaľ nemá nikto nastavený rank."
            });
        }

        let description = "";

        for (const [userId, data] of entries) {

            description +=
                `👤 <@${userId}> — **${data.rank}** — ${data.gamemode}\n`;
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("🏆 Minecraft Ranky")
            .setDescription(description)
            .setFooter({
                text: `Počet hráčov: ${entries.length}`
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
});

// =========================
// START
// =========================

if (!TOKEN) {
    console.error("❌ DISCORD_TOKEN nie je nastavený!");
    process.exit(1);
}

registerCommands();
client.login(TOKEN);
