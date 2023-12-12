const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Execute some codes.")
    .addStringOption((option) => option.setName("code").setDescription("The code to be executed.").setRequired(true)),
  options: {
    developers: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction<true>} interaction
   */
  run: async (client, interaction, args) => {
    await interaction.deferReply();

    const code = interaction.options.getString("code");

    try {
      let executedEvalValue = eval(code);

      if (typeof executedEvalValue !== "string") executedEvalValue = require("util").inspect(executedEvalValue);

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Code executed")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Successfully executed the code, no errors were found.`)
            .setColor(config.embedSettings.color.default)
            .addFields({
              name: "Output:\n\u200B",
              value: `\`\`\`${executedEvalValue}\`\`\``,
            })
            .setTimestamp(new Date())
            .setFooter({
              text: `copyright @${client.application.owner.username}`,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    } catch (err) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Code executed")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Something went wrong while executing your code.`)
            .setColor(config.embedSettings.color.default)
            .addFields({
              name: "Output:\n\u200B",
              value: `\`\`\`${err}\`\`\``,
            })
            .setTimestamp(new Date())
            .setFooter({
              text: `copyright @${client.application.owner.username}`,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
        files: [new AttachmentBuilder(Buffer.from(`${err}`, "utf-8"), { name: "output.txt" })],
      });
    }
  },
};
