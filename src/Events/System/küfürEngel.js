const { EmbedBuilder, Colors } = require('discord.js');
const ms = require('ms');

const { QuickDB, JSONDriver } = require("quick.db");
const jsonDriver = new JSONDriver();
const db = new QuickDB({ driver: jsonDriver });

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        try {
            if (message.author.bot) return;
            const küfürEngel = await db.get(`küfürEngel.${message.guild.id}`);
            if (!küfürEngel) return;

            const küfürler = [
                "oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amsk", "sikim", "sikiyim",
                "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "göt", "sik", "yarrak", "am",
                "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq", "amını", "anneni",
                "kaşar", "pezevenk", "yarak", "fuck", "ibne", "skim", "amına", "taşşak", "yarak", "yarra", "skiyim", "götveren"
            ];

            const regex = new RegExp(`\\b(${küfürler.join("|")})\\b`, "i");

            if (regex.test(message.content)) {
                try {
                    await message.member.timeout(ms("10m"), "Küfür ettiği için susturuldu.");
                    const replyMessage = await message.reply(`${message.author}, bu sunucuda küfür etmek yasaktır! Küfür ettiği için 10 dakika boyunca susturuldunuz.`);
                    setTimeout(() => replyMessage.delete(), 5000);
                    await message.delete();
                } catch (error) {
                    const errorMessage = await message.reply(`Küfür eden kişiye ceza verilirken bir hata oluştu.`);
                    setTimeout(() => errorMessage.delete(), 5000);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}
