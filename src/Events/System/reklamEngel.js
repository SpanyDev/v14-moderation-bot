const { EmbedBuilder, Colors, PermissionsBitField } = require('discord.js');
const ms = require('ms');

const { QuickDB, JSONDriver } = require("quick.db");
const jsonDriver = new JSONDriver();
const db = new QuickDB({ driver: jsonDriver });

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        try {
            const reklamEngel = await db.get(`reklamEngel.${message.guild.id}`);
            if (!reklamEngel) return;

            const linkler = [
                "http://",
                "https://",
                "www.",
                "discord.gg",
                "discord.com/invite",
            ];

            if (linkler.some(reklam => message.content.toLowerCase().includes(reklam))) {
                try {
                    const replyMessage = await message.reply(`${message.author}, Bu sunucuda reklam yapmak yasaktır`);
                    setTimeout(() => replyMessage.delete(), 5000);

                    await message.member.timeout(ms("10m"), "Reklam yaptığı için susturuldu.");
                    const timeoutMessage = await message.channel.send(`${message.author}, bu sunucuda reklam yapmak yasaktır! Reklam yaptığı için 10 dakika boyunca susturuldunuz.`);
                    setTimeout(() => timeoutMessage.delete(), 5000);

                    await message.delete();
                } catch (error) {
                    const errorMessage = await message.reply(`Reklam yapan kişiye ceza verilirken bir hata oluştu.`);
                    setTimeout(() => errorMessage.delete(), 5000);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}
