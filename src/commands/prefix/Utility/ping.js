const { Message } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");

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
    const mess = await message.reply(`${client.user.username} đang khởi động não...`);
    const ping = mess.createdTimestamp - message.createdTimestamp;
    const newMess = `API Latency: ${client.ws.ping}\n${client.user.username} Ping: ${ping}ms ${
      ping <= 150 ? ":green_circle:" : ping <= 500 ? ":yellow_circle:" : ":red_circle:"
    }`;
    await mess.edit({ content: newMess });
  },
};
