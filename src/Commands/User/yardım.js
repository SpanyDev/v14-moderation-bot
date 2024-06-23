const { SlashCommandBuilder, EmbedBuilder, Colors, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yardım')
        .setDescription('Botun komutlarının listesini atar.'),
    run: async (client, interaction) => {
        const uniqueId = `${interaction.id}-helpMenu`;

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(uniqueId)
                    .setPlaceholder('👉 Kategori Seç!')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Kullanıcı')
                            .setDescription('Kullanıcı komutlarını gösterir.')
                            .setValue('user'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Moderasyon')
                            .setDescription('Moderasyon komutlarını gösterir.')
                            .setValue('Moderation'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Yetkili')
                            .setDescription('Yetkili komutlarını gösterir.')
                            .setValue('Staff'),
                    )
            );

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setColor(Colors.Blue)
            .setThumbnail(client.user.displayAvatarURL())
            .setFields(
                { name: `__Bot Hakkında__`, value: `Merhaba, ben ${client.user.username}! Beni kullandığınız için teşekkür ederim.`, inline: false },
                { name: `__Bilgilendirme__`, value: `Bu menüden istediğiniz kategoriyi seçerek komutları görebilirsiniz.`, inline: false }
            )

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const filter = i => i.customId === uniqueId && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            const value = i.values[0];
            const category = value.toLowerCase();

            const files = fs.readdirSync(`./src/Commands/${category}`);
            const commands = files.map(file => {
                const command = require(`../${category}/${file}`);
                return `>  - [\`${command.data.name}\`](https://discord.gg/gkcYAyrmMd): ${command.data.description}`;
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setColor(Colors.Blue)
                .setThumbnail(client.user.displayAvatarURL())
                .setFields(
                    { name: `__${category.charAt(0).toUpperCase() + category.slice(1)} Komutları__`, value: commands.join("\n"), inline: false }
                )

            await i.update({
                embeds: [embed],
                components: [row],
            });
        })
    },
};
