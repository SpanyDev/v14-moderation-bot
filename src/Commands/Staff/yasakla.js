const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`yasakla`)
        .setDescription(`Kullanıcıyı sunucudan yasaklarsınız`)
        .addUserOption(option => option.setName(`kullanıcı`).setDescription(`Yasaklanacak kullanıcıyı seçin.`).setRequired(true))
        .addStringOption(option => option.setName(`sebep`).setDescription(`Yasaklama sebebini belirtin.`).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    run: async (client, interaction) => {
        const { options, user, guild } = interaction;
        const member = options.getUser(`kullanıcı`);
        const reason = options.getString(`sebep`);

        const banMember = interaction.guild.members.cache.get(member.id);
        const botMember = interaction.guild.members.cache.get(client.user.id);

        if (banMember.id === interaction.member.id) return interaction.reply({ embeds: [client.embed(`Kendinizi yasaklayamazsınız.`, `hatalı`)] });
        if (banMember.id === client.user.id) return interaction.reply({ embeds: [client.embed(`Botu yasaklamazsın.`, `hatalı`)] });

        if (banMember) {
            if (interaction.member.roles.highest.position <= banMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi sizden daha üst role sahip olduğu için bunu yapamazsınız.`, `hatalı`)] });
            if (botMember.roles.highest.position <= banMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi botun rolünden daha üst role sahip olduğu için bunu yapamam.`, `hatalı`)] });
        }

        await guild.members.ban(member, { reason: reason }).then(() => {
            member.send(`**${guild.name}** adlı sunucudan **${reason}** sebebiyle yasaklandınız.`).catch(() => { });
            interaction.reply({
                embeds: [client.embed(`Başarıyla ${member} adlı kullanıcı sunucudan yasaklandı.`, `başarılı`)],
            })
        })
    },
};
