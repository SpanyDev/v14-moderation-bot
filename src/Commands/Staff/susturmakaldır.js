const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`susturma-kaldır`)
        .setDescription(`Kullanıcının susutmasını kaldırırsınız.`)
        .addUserOption(option => option.setName(`kullanıcı`).setDescription(`Susturulacak kullanıcıyı seçin.`).setRequired(true))
        .addStringOption(option => option.setName(`sebep`).setDescription(`Susturma sebebini belirtin.`).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    run: async (client, interaction) => {
        const { options, user } = interaction;
        const member = options.getUser(`kullanıcı`);
        const reason = options.getString(`sebep`);

        const timeMember = interaction.guild.members.cache.get(member.id);
        const botMember = interaction.guild.members.cache.get(client.user.id);

        if (!timeMember) return interaction.reply({ embeds: [client.embed(`Bu kullanıcı sunucuda bulunmuyor.`, `hatalı`)] });
        if (interaction.member.roles.highest.position <= timeMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi sizden daha üst role sahip olduğu için bunu yapamazsınız.`, `hatalı`)] });
        if (botMember.roles.highest.position <= timeMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi botun rolünden daha üst role sahip olduğu için bunu yapamam.`, `hatalı`)] });

        await timeMember.timeout(null, reason).then(() => {
            interaction.reply({
                embeds: [client.embed(`Başarıyla ${member} adlı kullanıcının susturması kaldırıldı..`, `başarılı`)],
            })
        })
    },
};
