const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`sustur`)
        .setDescription(`Kullanıcıyı susturur.`)
        .addUserOption(option => option.setName(`kullanıcı`).setDescription(`Susturulacak kullanıcıyı seçin.`).setRequired(true))
        .addStringOption(option => option.setName(`sebep`).setDescription(`Susturma sebebini belirtin.`).setRequired(true))
        .addStringOption(option => option.setName(`süre`).setDescription(`Susturma süresini belirtin.`).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    run: async (client, interaction) => {
        const { options, user } = interaction;
        const member = options.getUser(`kullanıcı`);
        const reason = options.getString(`sebep`);
        const time = options.getString(`süre`);

        const timeMember = interaction.guild.members.cache.get(member.id);
        const botMember = interaction.guild.members.cache.get(client.user.id);

        if (isNaN(ms(time))) return interaction.reply({ embeds: [client.embed(`Geçerli bir süre belirtmelisiniz.`, `hatalı`)] });

        const timeoutMS = ms(`${time}`);

        if (!timeMember) return interaction.reply({ embeds: [client.embed(`Bu kullanıcı sunucuda bulunmuyor.`, `hatalı`)] });
        if (timeMember.id === interaction.member.id) return interaction.reply({ embeds: [client.embed(`Kendinizi susturamazsınız.`, `hatalı`)] });
        if (timeMember.id === client.user.id) return interaction.reply({ embeds: [client.embed(`Botu susturamazsınız.`, `hatalı`)] });
        if (timeMember.communicationDisabledUntilTimestamp) return interaction.reply({ embeds: [client.embed(`Bu kullanıcı zaten susturulmuş durumda.`, `hatalı`)] });
        if (interaction.member.roles.highest.position <= timeMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi sizden daha üst role sahip olduğu için bunu yapamazsınız.`, `hatalı`)] });
        if (botMember.roles.highest.position <= timeMember.roles.highest.position) return interaction.reply({ embeds: [client.embed(`Kişi botun rolünden daha üst role sahip olduğu için bunu yapamam.`, `hatalı`)] });

        await timeMember.timeout(timeoutMS, reason).then(() => {
            interaction.reply({
                embeds: [client.embed(`Başarıyla ${member} adlı kullanıcı ${time} ${time} boyunca susturuldu.`, `başarılı`)],
            })
        })
    },
};
