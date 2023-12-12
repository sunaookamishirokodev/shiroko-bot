const { Message, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: {
    name: "help",
    description: "View all the possible commands!",
    aliases: ["h"],
    cooldown: 15000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.toggle) {
      try {
        const data = await GuildSchema.findOne({ guild: message.guildId });

        if (data && data?.prefix) prefix = data.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }

    const mapIntCmds = client.applicationcommandsArray.map(
      (v) => `\`${v.type === 2 || v.type === 3 ? "" : "/"}${v.name}\`: ${v.description || "(No description)"}`
    );
    const mapPreCmds = client.collection.prefixcommands.map(
      (v) =>
        `\`${prefix}${v.structure.name}\` (${
          v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(", ") : "None"
        }): ${v.structure.description || "(No description)"}`
    );

    const embed = new EmbedBuilder()
      .setColor(config.embedSettings.color.default)
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTitle("Help command")
      .setDescription(
        `I am configured to use both slash command and prefix command!\nPlease select one to view details.\nFor more info on a specific command, use \`${prefix}help <command>\`\nNeed more help? Come join our [guild](${config.link.guild})`
      )
      .addFields([
        {
          name: "\u200B",
          value:
            `Currently I have a total \`${mapIntCmds.length + mapPreCmds.length}\` commands!` +
            "\n" +
            `Because this is a test version, the bot will encounter many errors :\(\(`,
        },
      ])
      .setTimestamp(new Date())
      .setFooter({
        text: `copyright @${client.application.owner.username}`,
        iconURL: client.user.displayAvatarURL(),
      });

    const prefixButton = new ButtonBuilder()
      .setCustomId("prefix-command")
      .setLabel(`${prefix} Prefix command`)
      .setStyle(ButtonStyle.Primary);
    const slashButton = new ButtonBuilder()
      .setCustomId("slash-command")
      .setLabel("/ Slash command")
      .setStyle(ButtonStyle.Primary);

    const inviteBotButton = new ButtonBuilder()
      .setLabel("Invite me")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);

    const initRow = new ActionRowBuilder().addComponents(prefixButton, slashButton, inviteBotButton);

    await message.channel.send({
      embeds: [embed],
      components: [initRow],
    });
  },
};
