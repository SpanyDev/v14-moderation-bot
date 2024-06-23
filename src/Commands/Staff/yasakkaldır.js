const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`yasak-kaldır`)
        .setDescription(`Kullanıcının yasağını sunucudan kaldırırsınız.`)
        .addUserOption(option => option.setName(`kullanıcı`).setDescription(`Yasağı kaldırılacak kullanıcıyı seçin.`).setRequired(true))
        .addStringOption(option => option.setName(`sebep`).setDescription(`Yasakğı kaldırma sebebini belirtin.`).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    run: async (client, interaction) => {

        const { options, user, guild } = interaction;
        const member = options.getUser(`kullanıcı`);
        const reason = options.getString(`sebep`);

        const guildBans = await guild.bans.fetch();
        const bannedUser = guildBans.get(member.id);

        if (!bannedUser) return interaction.reply({ embeds: [client.embed(`Bu kullanıcı sunucuda yasaklı değil.`, `hatalı`)] });

        await guild.members.unban(member, { reason: reason }).then(() => {
            interaction.reply({
                embeds: [client.embed(`Başarıyla ${member} adlı kullanıcının yasağı kaldırıldı.`, `başarılı`)],
            })
        })
    },
};
