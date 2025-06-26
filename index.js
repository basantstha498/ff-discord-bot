const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on("ready", () => {
  console.log(`🤖 Bot is ready: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!ffinfo") || message.author.bot) return;

  const args = message.content.split(" ");
  const uid = args[1];
  const region = args[2] || "SG";

  if (!uid) return message.reply("❌ Usage: `!ffinfo <uid> [region]`");

  const infoURL = `https://ffdvinh09-info.vercel.app/player-info?region=${region}&uid=${uid}`;
  const outfitURL = `https://ffoutfitapis.vercel.app/outfit-image?uid=${uid}&region=${region}&key=99day`;

  try {
    const res = await axios.get(infoURL);
    const data = res.data;

    const reply = `🎮 **Player Info**
**Name:** ${data.nickname}
**UID:** ${uid}
**Level:** ${data.level}
**Region:** ${region}
**Likes:** ${data.likes || 0}
**Rank:** ${data.rank || "Unknown"}
`;

    await message.reply({ content: reply, files: [outfitURL] });
  } catch (err) {
    console.error(err);
    message.reply("⚠️ Failed to fetch info.");
  }
});

client.login(process.env.TOKEN);
