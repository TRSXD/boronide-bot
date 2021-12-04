const { Client, Intents } = require('discord.js');
const fetch = require('cross-fetch');

const main = require('../src/index');
const config = require('../config.json');

let settings = {
    '__VERSION__': '0.2.4',

    'Debug': false,
    'SkipMinify': false,
    'useRewriteGenerator': false,

    'BeautifyDebug': true,
    'PrintStep': false,
    'JIT': false,
    'Watermark': `Boronide, discord.gg/BZEjFbeUvk`,
    'Uid': createID(4),

    'AntiTamper': true,
    'MaximumSecurity': true,
    'UseSuperops': false
};

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: [
        "CHANNEL"
    ]
});

client.on('ready', () => {
    console.log('bot is online');
    client.user.setActivity('-obfuscate', { type: 'LISTENING' });
});

client.on('messageCreate', (message) => {
    if (message.content.startsWith('-obfuscate')) {
        if (message.attachments.size > 0) {
            // theres an attachment, fetch the file and obfuscate it

            var url = message.attachments.first().url;

            fetchAndObfuscate(url, message);
        } else {
            // no attachment, probably a code block. test the regex and if it fails tell the user

            var new_message = message.content;

            if (message.content.includes('```lua')) new_message = message.content.replace(/(```lua)/i, '```');

            // https://regexland.com/all-between-specified-characters/

            var reg = /(?<=```)[\S\s]*(?=```)/g;
            var code = reg.exec(new_message);

            if (code) {
                obfuscate(code.toString(), message);
            } else {
                message.channel.send('no file or code block');
            };
        };
    };
});

async function fetchAndObfuscate(url, message) {
    let response = await fetch(url);
    let script = await response.text();

    obfuscate(script, message);
};

async function obfuscate(content, message) {
    message.channel.send('obfuscating...');

    try {
        var obfuscated = await main.obfuscate(content, settings);
    } catch(err) {
        message.channel.send('failed to obfuscate');
        return;
    };

    message.channel.send({
        content: 'there u go',
        files: [ obfuscated[0] ]
    });

    return;
};

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function createID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    };
   
    return result;
};

client.login(config.token);
