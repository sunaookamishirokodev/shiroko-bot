const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");
const config = require("../../config");

module.exports = {
  customId: "prefix-command",
  /**
   *
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.toggle) {
      try {
        const data = await GuildSchema.findOne({ guild: message.guildId });

        if (data && data?.prefix) prefix = data.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }

    const mapPreCmds = client.collection.prefixcommands.map(
      (v) =>
        `\`${prefix}${v.structure.name}\` (${
          v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(", ") : "None"
        }): ${v.structure.description || "(No description)"}`
    );

    const prefixEmbed = new EmbedBuilder()
      .setColor(config.embedSettings.color.default)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields({ name: "Prefix commands", value: `${mapPreCmds.join("\n")}` });

    await interaction.reply({
      embeds: [prefixEmbed],
      ephemeral: true,
    });
  },
};
