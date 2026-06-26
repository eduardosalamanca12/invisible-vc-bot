const express = require("express");
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const PORT = process.env.PORT || 3000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = '1484719511616884918';
const GUILD_ID = '1417454253139558433';

if (!DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN environment variable.');
  process.exit(1);
}

const app = express();
app.get('/', (req, res) => res.send('Bot is running 24/7'));
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

const client = new Client({ checkUpdate: false });

async function joinChannel() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.guild) {
      throw new Error('Voice channel not found.');
    }

    const existingConnection = getVoiceConnection(GUILD_ID);
    if (existingConnection) {
      console.log('Voice connection already active.');
      return;
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: GUILD_ID,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfMute: true,
      selfDeaf: true,
    });

    console.log('Joined voice channel successfully.');
  } catch (error) {
    console.error('VC error:', error.message);
  }
}

client.once('ready', async () => {
  console.log(`Success: ${client.user.tag} is online.`);
  client.user.setStatus('invisible');

  await joinChannel();
  setInterval(joinChannel, 86400000);
});

client.on('error', (error) => {
  console.error('Discord client error:', error);
});

client.login(DISCORD_TOKEN);
