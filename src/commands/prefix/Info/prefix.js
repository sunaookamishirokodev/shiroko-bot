const { Message, PermissionsBitField } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: {
    name: "prefix",
    description: "Get/Set prefix",
    aliases: [],
    permissions: "",
    cooldown: 5000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    if (!config.handler?.mongodb?.toggle) {
      await message.reply({
        content: "Database is not ready, this command cannot be executed.",
      });

      return;
    }

    const type = args[0];
    let data = await GuildSchema.findOne({ guild: message.guildId });

    if (!data) {
      data = new GuildSchema({
        guild: message.guildId,
      });
    }

    switch (type) {
      case "set": {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return await message.reply({
            content: config.messageSettings.notHasPermissionMessage,
          });
        }
        if (!args[1]) {
          return await message.reply({
            content: "You need to provide the prefix as a second parameter.",
          });
        }

        data.prefix = args[1];

        await data.save();

        await message.reply({
          content: `The prefix has been changed to \`${args[1]}\`.`,
        });

        break;
      }

      case "reset": {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return await message.reply({
            content: config.messageSettings.notHasPermissionMessage,
          });
        }
        data.prefix = config.handler.prefix;

        await data.save();

        await message.reply({
          content: `The prefix has been reseted to \`${config.handler.prefix}\`.`,
        });

        break;
      }

      default: {
        await message.reply({
          content: `The server's current prefix is \`${data?.prefix}\``,
        });

        break;
      }
    }
  },
};
