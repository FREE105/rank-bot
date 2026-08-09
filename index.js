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
const GUILD_ID = "1523657617698984038";
const PORT = process.env.PORT || 10000;

if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN chýba!");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});
client.on("debug", info => {
  console.log("🔎 DISCORD DEBUG:", info);
});

client.on("error", error => {
  console.error("❌ DISCORD ERROR:", error);
});

client.on("warn", info => {
  console.warn("⚠️ DISCORD WARN:", info);
});

// ===============================
// ŠTÝLY
// ===============================

const styles = {
  aurora: ["🌌 Polárna žiara", 0x57F287],
  snow: ["❄️ Sneženie", 0xDDEEFF],
  fire: ["🔥 Oheň", 0xFF4500],
  ice: ["🧊 Ľad", 0x00BFFF],
  ocean: ["🌊 Oceán", 0x0077FF],
  space: ["🚀 Vesmír", 0x6C5CE7],
  galaxy: ["🌠 Galaxia", 0x9B59B6],
  sunset: ["🌅 Západ slnka", 0xFF7675],
  storm: ["⛈️ Búrka", 0x5865F2],
  rainbow: ["🌈 Dúha", 0xFF69B4],
  forest: ["🌲 Les", 0x228B22],
  desert: ["🏜️ Púšť", 0xE6A23C],
  volcano: ["🌋 Sopka", 0xC0392B],
  toxic: ["☢️ Toxic", 0xA3FF12],
  cyber: ["💻 Cyber", 0x00FFCC],
  blood: ["🩸 Blood", 0x8B0000],
  shadow: ["🌑 Shadow", 0x202020],
  diamond: ["💎 Diamant", 0x00FFFF],
  gold: ["🏆 Gold", 0xFFD700],
  minecraft: ["⛏️ Minecraft", 0x55AA55]
};

// ===============================
// PRÍKAZY
// ===============================

const commands = [

  new SlashCommandBuilder()
    .setName("addrank")
    .setDescription("Pridá výsledok rank testu")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator.toString()
    )
    .addUserOption(o =>
      o.setName("hrac")
        .setDescription("Hráč")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("gamemode")
        .setDescription("Ľubovoľný gamemode")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("previous_rank")
        .setDescription("Predošlý rank")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("new_rank")
        .setDescription("Nový rank")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("status")
        .setDescription("Výsledok")
        .setRequired(true)
        .addChoices(
          { name: "🟢 Rank UP", value: "UP" },
          { name: "🔴 Rank DOWN", value: "DOWN" },
          { name: "⚪ Bez zmeny", value: "SAME" }
        )
    )
    .addUserOption(o =>
      o.setName("tester")
        .setDescription("Tester")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("poznamka")
        .setDescription("Poznámka")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Vytvorí tematický embed")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator.toString()
    )
    .addUserOption(o =>
      o.setName("hrac")
        .setDescription("Hráč")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("styl")
        .setDescription("Štýl")
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
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Text embedu")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Skontroluje bota"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Zobrazí pomoc"),

  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Informácie o serveri"),

  new SlashCommandBuilder()
    .setName("styles")
    .setDescription("Zobrazí štýly")
];

// ===============================
// REGISTRÁCIA
// ===============================

async function registerCommands() {

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
        body: commands.map(c => c.toJSON())
      }
    );

    console.log("✅ Príkazy zaregistrované!");

  } catch (error) {

    console.error("❌ Registrácia zlyhala:", error);

  }
}

// ===============================
// INTERACTIONS
// ===============================

client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  try {

    // PING
    if (interaction.commandName === "ping") {

      return interaction.reply({
        content: `🏓 Pong! ${client.ws.ping} ms`
      });

    }

    // HELP
    if (interaction.commandName === "help") {

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("🤖 Rank Bot")
            .setDescription(
              "`/addrank` — Rank test\n" +
              "`/embed` — Tematický embed\n" +
              "`/styles` — Štýly\n" +
              "`/ping` — Ping\n" +
              "`/serverinfo` — Server info"
            )
        ]
      });

    }

    // STYLES
    if (interaction.commandName === "styles") {

      const text = Object.entries(styles)
        .map(([key, value]) =>
          `${value[0]} → \`${key}\``
        )
        .join("\n");

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle("🎨 Dostupné štýly")
            .setDescription(text)
        ]
      });

    }

    // SERVERINFO
    if (interaction.commandName === "serverinfo") {

      const guild = interaction.guild;

      if (!guild) {
        return interaction.reply({
          content: "❌ Použi tento príkaz na serveri.",
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`🏰 ${guild.name}`)
            .addFields(
              {
                name: "👥 Členovia",
                value: `${guild.memberCount}`,
                inline: true
              },
              {
                name: "🆔 ID",
                value: guild.id,
                inline: true
              }
            )
        ]
      });

    }

    // ADDRANK
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

      const tester =
        interaction.options.getUser("tester");

      const note =
        interaction.options.getString("poznamka");

      let emoji = "⚪";
      let statusText = "Bez zmeny";
      let color = 0x99AAB5;

      if (status === "UP") {
        emoji = "🟢";
        statusText = "Rank UP";
        color = 0x57F287;
      }

      if (status === "DOWN") {
        emoji = "🔴";
        statusText = "Rank DOWN";
        color = 0xED4245;
      }

      const embed =
        new EmbedBuilder()
          .setColor(color)
          .setTitle("🏆 Rank Test")
          .setDescription(
            `${emoji} **${statusText}**`
          )
          .addFields(
            {
              name: "👤 Hráč",
              value: `${player}\n\`${player.username}\``,
              inline: true
            },
            {
              name: "🎮 Gamemode",
              value: gamemode,
              inline: true
            },
            {
              name: "🧪 Tester",
              value: `${tester}\n\`${tester.username}\``,
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
              value: `${emoji} ${statusText}`,
              inline: true
            }
          )
          .setThumbnail(
            player.displayAvatarURL({
              size: 256
            })
          )
          .setFooter({
            text: "Rank Bot • Rank Test System"
          })
          .setTimestamp();

      if (note) {
        embed.addFields({
          name: "📝 Poznámka",
          value: note
        });
      }

      return interaction.reply({
        embeds: [embed]
      });

    }

    // EMBED
    if (interaction.commandName === "embed") {

      const player =
        interaction.options.getUser("hrac");

      const styleKey =
        interaction.options.getString("styl");

      const customText =
        interaction.options.getString("text");

      const style =
        styles[styleKey];

      if (!style) {

        return interaction.reply({
          content: "❌ Neznámy štýl.",
          ephemeral: true
        });

      }

      const embed =
        new EmbedBuilder()
          .setColor(style[1])
          .setTitle(style[0])
          .setDescription(
            customText ||
            `✨ Tematický embed pre ${player}`
          )
          .setThumbnail(
            player.displayAvatarURL({
              size: 256
            })
          )
          .setFooter({
            text: "Rank Bot"
          })
          .setTimestamp();

      return interaction.reply({
        embeds: [embed]
      });

    }

  } catch (error) {

    console.error("❌ Interaction error:", error);

    if (!interaction.replied) {

      await interaction.reply({
        content: "❌ Nastala chyba.",
        ephemeral: true
      }).catch(() => {});

    }

  }

});

// ===============================
// RENDER SERVER
// ===============================

http.createServer((req, res) => {

  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Rank Bot is online!");

}).listen(PORT, "0.0.0.0", () => {

  console.log(`🌐 HTTP server beží na porte ${PORT}`);

});

// ===============================
// READY
// ===============================

client.once("ready", async () => {

  console.log(
    `🤖 Bot je online ako ${client.user.tag}`
  );

  await registerCommands();

});

// ===============================
// LOGIN
// ===============================

console.log("🔄 Skúšam pripojiť Discord...");

client.login(TOKEN)
  .then(() => {
    console.log("🔐 Discord login OK");
  })
  .catch(error => {
    console.error("❌ Discord login zlyhal:", error);
  });

setTimeout(() => {
  console.error("⏰ Discord login trvá príliš dlho.");
  console.error("Skontroluj DISCORD_TOKEN a pripojenie k Discordu.");
  process.exit(1);
}, 30000);
