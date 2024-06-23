const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`at`)
        .setDescription(`Kullanıcıyı sunucudan atarsınız`)
        .addUserOption(option => option.setName(`kullanıcı`).setDescription(`Atılacak kullanıcıyı seçin.`).setRequired(true))
        .addStringOption(option => option.setName(`sebep`).setDescription(`Atılma sebebini belirtin.`).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    run: async (client, interaction) => {
        const { options, user, guild } = interaction;
        const member = options.getUser(`kullanıcı`);
        const reason = options.getString(`sebep`);

        const kickMember = interaction.guild.members.cache.get(member.id);
        const botMember = interaction.guild.members.cache.get(client.user.id);

        if (!kickMember) return interaction.reply({ embeds: [client.embed(`Bu kullanıcı sunucuda bulunmuyor.`, `hatalı`)] });
        if (kickMember.id === interaction.member.id) return interaction.reply({ embeds: [client.embed(`Kendinizi sunucudan atamazsınız.`, `hatalı`)] });
        if (kickMember.id === client.user.id) return interaction.reply({ embeds: [client.embed(`Botu sunucudan atamazsınız.`, `hatalı`)] });
        if (interaction.member.roles.highest.position <= kickMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi sizden daha üst role sahip olduğu için bunu yapamazsınız.`, `hatalı`)] });
        if (botMember.roles.highest.position <= kickMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi botun rolünden daha üst role sahip olduğu için bunu yapamam.`, `hatalı`)] });

        await guild.members.kick(member, { reason: reason }).then(() => {
            member.send(`**${guild.name}** adlı sunucudan **${reason}** sebebiyle yasaklandınız.`).catch(() => { });
            interaction.reply({
                embeds: [client.embed(`Başarıyla ${member} adlı kullanıcı sunucudan yasaklandı.`, `başarılı`)],
            })
        })
    },
};
