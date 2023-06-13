const { SlashCommandBuilder } = require('discord.js');
const index = require("../../index.js");
const client = index.client;
const { Collection } = require('discord.js')
const { Events } = require('discord.js');
const { cooldowns } = client;

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Replies with createInvite!'),
	async execute(interaction) {
	for (const guild of guilds) {
          try {
            const invite = await guild.channels.cache
              .filter((channel) => channel.type === 'GUILD_TEXT')
              .first()
              .createInvite({ maxUses: 1, unique: true });
            await interaction.reply(
              `Invite link for ${guild.name}: ${invite.url}`
            );
          } catch (error) {
            console.error(`Failed to create invite for ${guild.name}: ${error}`);
          }
        }
	},
};
