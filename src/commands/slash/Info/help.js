const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ComponentType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");
const GuildSchema = require("../../../schemas/GuildSchema");

module.exports = {
  structure: new SlashCommandBuilder().setName("help").setDescription("View all the possible commands!"),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.toggle) {
      try {
        const data = await GuildSchema.findOne({ guild: interaction.guildId });

        if (data && data?.prefix) prefix = data.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }

    const prefixButton = new ButtonBuilder()
      .setCustomId("prefix-command")
      .setLabel(`Prefix command`)
      .setStyle(ButtonStyle.Primary);

    const slashButton = new ButtonBuilder()
      .setCustomId("slash-command")
      .setLabel("Slash command")
      .setStyle(ButtonStyle.Primary);

    const inviteBotButton = new ButtonBuilder()
      .setLabel("Invite me")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);

    const returnButton = new ButtonBuilder().setCustomId("return").setLabel("Return").setStyle(ButtonStyle.Primary);

    const initRow = new ActionRowBuilder().addComponents(prefixButton, slashButton, inviteBotButton);
    const subRow = new ActionRowBuilder().addComponents(returnButton);

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
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle("Help command")
      .setDescription(
        `I am configured to use both slash command and prefix command!\nCurrently I have a total \`${
          mapIntCmds.length + mapPreCmds.length
        }\` commands!\nPlease select one to view details.\nNeed more help? Come join our [guild](${config.link.guild})`
      )
      .setTimestamp(new Date())
      .setFooter({
        text: `copyright @${client.application.owner.username}`,
        iconURL: client.user.displayAvatarURL(),
      });

    const prefixEmbed = new EmbedBuilder()
      .setColor(config.embedSettings.color.default)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields({ name: "Prefix commands", value: `${mapPreCmds.join("\n")}` });

    const slashEmbed = new EmbedBuilder()
      .setColor(config.embedSettings.color.default)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields({ name: "Slash commands", value: `${mapIntCmds.join("\n")}` });

    const response = await interaction.reply({
      embeds: [embed],
      components: [initRow],
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    // Event Collector Listener
    collector.on("collect", async (button) => {
      if (button.user.id !== interaction.user.id) return;
      switch (button.customId) {
        case "prefix-command":
          await button.update({
            embeds: [prefixEmbed],
            components: [subRow],
          });
          break;
        case "slash-command":
          await button.update({
            embeds: [slashEmbed],
            components: [subRow],
          });
          break;
        case "return":
          await button.update({
            embeds: [embed],
            components: [initRow],
          });
        default:
          break;
      }
    });
  },
};
