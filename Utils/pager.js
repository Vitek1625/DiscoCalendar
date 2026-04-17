const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');

class PagerSystem {
    constructor(pageSize, backIcon = '⬅️', nextIcon = '➡️') {
    this.pageSize = pageSize;
    this.backIcon = backIcon;
    this.nextIcon = nextIcon;
  }

  /**
  * @param {Interaction<import('discord.js').CacheType>} interaction
  * @param {string[]} data  
  */
  async sendPaginatedMessage(interaction, data) {
    let page = 0;
    const maxPage = Math.max(Math.ceil(data.length / this.pageSize) - 1, 0);

    const getEmbed = () => {
        const start = page * this.pageSize;
        const items = data.slice(start, start + this.pageSize);

        return new EmbedBuilder()
        .setTitle(`Results (Page ${page + 1}/${maxPage + 1})`)
        .setDescription(items.length > 0 ? items.join('\n') : 'No results');
    };

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('back')
        .setLabel(this.backIcon)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
        new ButtonBuilder()
        .setCustomId('next')
        .setLabel(this.nextIcon)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(maxPage === 0)
    );

    const message = await interaction.reply({
        embeds: [getEmbed()],
        components: [row],
        fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
        time: 10 * 60_000,
        idle: 2.5 * 60_000 
    });

    collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'Not your menu!', ephemeral: true });
        }

        if (i.customId === 'next' && page < maxPage) page++;
        if (i.customId === 'back' && page > 0) page--;

        row.components[0].setDisabled(page === 0);
        row.components[1].setDisabled(page === maxPage);
        collector.resetTimer();

        await i.update({
        embeds: [getEmbed()],
        components: [row],
        });
    });

    collector.on('end', async () => {
        row.components.forEach(btn => btn.setDisabled(true));
        const expiredEmbed = EmbedBuilder.from(message.embeds[0])
        .setFooter({ text: 'Pagination expired' });


        await interaction.editReply({
            embeds: [expiredEmbed],
            components: [row],
        });
    });
  }
}

module.exports = {
  PagerSystem,
}