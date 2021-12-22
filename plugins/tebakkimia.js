let fetch = require('node-fetch')

let timeout = 120000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {}
    let id = m.chat
    if (id in conn.tebakkimia) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkimia[id][0])
        throw false
    }
    let res = await fetch(API('amel', '/tebakkimia', {}, 'apikey'))
    if (!res.ok) throw eror
    let json = await res.json()
    if (!json.status) throw json
    let caption = `
Nama unsur dari lambang ${json.lambang} adalah...

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}teki untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebakkimia[id] = [
        await conn.sendButton(m.chat, caption, '© stikerin', 'Bantuan', '.teki', m),
        json, poin,
        setTimeout(async () => {
            if (conn.tebakkimia[id]) await conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.unsur}*`, '© stikerin', 'Tebak Kimia', '.tebakkimia', conn.tebakkimia[id][0])
            delete conn.tebakkimia[id]
        }, timeout)
    ]
}
handler.help = ['tebakkimia']
handler.tags = ['game']
handler.command = /^tebakkimia/i

module.exports = handler