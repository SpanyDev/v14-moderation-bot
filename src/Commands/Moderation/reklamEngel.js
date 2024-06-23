const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const { QuickDB, JSONDriver } = require("quick.db");
const jsonDriver = new JSONDriver();
const db = new QuickDB({ driver: jsonDriver });

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`reklamengel`)
        .setDescription(`Reklam engel sistemini açar veya kapatır.`)
        .addBooleanOption(option => option.setName(`durum`).setDescription(`Reklam engel durumunu belirtin.`).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async (client, interaction) => {
        const { options, user, guild } = interaction;
        const status = options.getBoolean(`durum`);

        if (status) {
            await db.set(`reklamEngel.${guild.id}`, true);
            interaction.reply({
                embeds: [client.embed(`Reklam engel sistemi başarıyla açıldı.`, `başarılı`)],
            });
        } else {
            await db.set(`kufurEngel.${guild.id}`, false);
            interaction.reply({
                embeds: [client.embed(`Reklam engel sistemi başarıyla kapatıldı.`, `başarılı`)],
            });
        }
    },
};
