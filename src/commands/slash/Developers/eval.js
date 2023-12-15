const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder().setName("eval").setDescription("Execute some codes."),
  options: {
    developers: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const modal = new ModalBuilder()
        .setTitle("Type code!")
        .setCustomId("modal-eval")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setLabel("Type code here")
              .setCustomId("code")
              .setPlaceholder("Example: 1 + 1")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          )
        );

      await interaction.showModal(modal);
    } catch (err) {
      await interaction.reply(config.messageSettings.errorMessage);
    }
  },
};
