//Required modules
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

//Identifying client
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
module.exports.client = client;

//Dynamic commands
client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//Events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('message', async (message) => {
  if (message.content === '!inviteall') {
    // Get an array of all the guilds the bot is in
    const guilds = client.guilds.cache.array();

    // Loop through each guild and generate an invitation link
    for (const guild of guilds) {
      try {
        const invite = await guild.channels.cache
          .find((c) => c.type === 'text')
          .createInvite({ maxUses: 1, unique: true });
        message.channel.send(`Invite link for ${guild.name}: ${invite.url}`);
      } catch (error) {
        console.error(`Failed to create invite for ${guild.name}: ${error}`);
      }
    }
  }
});

//Bot Token
client.login(token);
