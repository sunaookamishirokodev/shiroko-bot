const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");
const config = require("../../config");

module.exports = {
  customId: "slash-command",
  /**
   *
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const mapIntCmds = client.applicationcommandsArray.map(
      (v) => `\`${v.type === 2 || v.type === 3 ? "" : "/"}${v.name}\`: ${v.description || "(No description)"}`
    );

    const prefixEmbed = new EmbedBuilder()
      .setColor(config.embedSettings.color.default)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields({ name: "Slash commands", value: `${mapIntCmds.join("\n")}` });

    await interaction.reply({
      embeds: [prefixEmbed],
      ephemeral: true,
    });
  },
};
