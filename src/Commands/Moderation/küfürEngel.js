const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const { QuickDB, JSONDriver } = require("quick.db");
const jsonDriver = new JSONDriver();
const db = new QuickDB({ driver: jsonDriver });

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`küfürengel`)
        .setDescription(`Küfür engel sistemini açar veya kapatır.`)
        .addBooleanOption(option => option.setName(`durum`).setDescription(`Küfür engel durumunu belirtin.`).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async (client, interaction) => {
        const { options, user, guild } = interaction;
        const status = options.getBoolean(`durum`);

        if (status) {
            await db.set(`küfürEngel.${guild.id}`, true);
            interaction.reply({
                embeds: [client.embed(`Küfür engel sistemi başarıyla açıldı.`, `başarılı`)],
            });
        } else {
            await db.set(`küfürEngel.${guild.id}`, false);
            interaction.reply({
                embeds: [client.embed(`Küfür engel sistemi başarıyla kapatıldı.`, `başarılı`)],
            });
        }
    },
};
