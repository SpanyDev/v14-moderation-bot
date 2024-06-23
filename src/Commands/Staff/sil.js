const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`sil`)
        .setDescription(`Sunucuda kanaldaki mesajları siler`)
        .addIntegerOption(option => option.setName(`miktar`).setDescription(`Kaç mesaj silmek istersiniz?`).setRequired(true))
        .addChannelOption(option => option.setName(`kanal`).setDescription(`Hangi kanaldaki mesajları silmek istersiniz?`).setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    run: async (client, interaction) => {

        const { options } = interaction;
        const miktar = options.getInteger(`miktar`);
        const kanal = options.getChannel(`kanal`) || interaction.channel;

        if (miktar <= 0) return interaction.reply({ embeds: [client.embed(`0'dan büyük bir sayı girmelisin.`, `hatalı`)] });
        if (miktar > 100) return interaction.reply({ embeds: [client.embed(`100'den fazla mesaj silemezsin.`, `hatalı`)] });

        let fetchedMessagesSize;
        await kanal.messages.fetch({ limit: miktar }).then(async (fetchedMessages) => {
            fetchedMessagesSize = fetchedMessages.size || 0;
            const filteredMessages = fetchedMessages.filter(msg => (Date.now() - msg.createdTimestamp) <= ms("14d"));
            await kanal.bulkDelete(filteredMessages.size).then(async () => {
                await interaction.reply({
                    embeds: [client.embed(`Başarıyla ${filteredMessages.size} adet mesaj silindi.`, `başarılı`)],
                });
            });
        });
    },
};
