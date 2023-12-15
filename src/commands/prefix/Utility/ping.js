const { Message } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: {
    name: "ping",
    description: "Replies with Pong!",
    aliases: [],
    cooldown: 5000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const apiLatency = Math.round(client.ws.ping);

    const dbStart = Date.now();
    await GuildSchema.findOne({ guild: message.guildId });
    const dbLatency = Date.now() - dbStart;

    const wsStart = Date.now();
    const mess = await message.reply(`${client.user.username} Preparing...`);
    const wsLatency = Date.now() - wsStart;

    await mess.edit(
      `**Pong** :ping_pong:` +
        "\n" +
        `> - Websocket Latency: \`${wsLatency}ms\`` +
        "\n" +
        `> - API Latency: \`${apiLatency}ms\`` +
        "\n" +
        `> - Database Latency: \`${dbLatency}ms\``
    );;
  },
};
