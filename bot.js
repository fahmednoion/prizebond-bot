const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN; // Use environment variable
const bot = new TelegramBot(token, { polling: true });

// Store user data in memory (no file storage)
let userData = {};

// Prize bond draw data (directly included in the code)
const prizeBondDraws = [
    {
        drawNumber: "111th Draw (30th April 2023)",
        firstPrize: ["0640864"],
        secondPrize: ["0668190"],
        thirdPrize: ["0081755", "0268110"],
        fourthPrize: ["0655822", "0917742"],
        fifthPrize: [
            "0782390", "0562678", "0414644", "0182210", "0941923", "0687411", "0533659", "0412790", "0150417", "0922140",
            "0650541", "0511663", "0347624", "0149798", "0900429", "0647635", "0498330", "0315982", "0140508", "0889665",
            "0644469", "0477245", "0308101", "0138816", "0865063", "0609785", "0468351", "0300265", "0128885", "0863219",
            "0609362", "0435128", "0265689", "0128697", "0792259", "0606389", "0415945", "0236152", "0092201", "0971928",
            "007007", "008008"
        ]
    },
    {
        "drawNumber": "112th Draw (31st July 2023)",
        "firstPrize": ["0798890"],
        "secondPrize": ["0532775"],
        "thirdPrize": ["0249678", "0772708"],
        "fourthPrize": ["0029630", "0310793"],
        "fifthPrize": [
            "0006324", "0261741", "0456798", "0633273", "0768155", "0115516", "0266284", "0464285", "0649934", "0768366",
            "0149804", "0266453", "0486875", "0699783", "0816730", "0206160", "0267861", "0507545", "0709675", "0822593",
            "0207733", "0321431", "0523454", "0713057", "0839012", "0241663", "0407023", "0582777", "0716924", "0839427",
            "0244025", "0423266", "0589199", "0727136", "0856235", "0255893", "0425929", "0594099", "0740489", "0892160"
        ]
    },
    {
        "drawNumber": "113th Draw (31st October 2023)",
        "firstPrize": ["0858719"],
        "secondPrize": ["0726201"],
        "thirdPrize": ["0724491", "0766904"],
        "fourthPrize": ["0628145", "0767439"],
        "fifthPrize": [
            "0035886", "0194787", "0450356", "0636053", "0807629", "0036369", "0237396", "0463748", "0658382", "0839541",
            "0052042", "0268273", "0537239", "0680217", "0860581", "0090649", "0270641", "0567200", "0713663", "0908862",
            "0119212", "0283210", "0609344", "0732783", "0948519", "0120859", "0341873", "0613990", "0743091", "0978199",
            "0162534", "0343420", "0614669", "0744533", "0989480", "0169693", "0442475", "0631247", "0772639", "0991712"
        ]
    },
    {
        "drawNumber": "114th Draw (31st January 2024)",
        "firstPrize": ["0597954"],
        "secondPrize": ["0670408"],
        "thirdPrize": ["0264642", "0813480"],
        "fourthPrize": ["0197985", "0865974"],
        "fifthPrize": [
            "0039184", "0226848", "0447945", "0659084", "0847842", "0040976", "0273186", "0448025", "0704946", "0878478",
            "0060142", "0332662", "0454438", "0721411", "0885007", "0087043", "0400079", "0466540", "0723215", "0894327",
            "0118014", "0403984", "0474235", "0724774", "0906722", "0139952", "0417774", "0490872", "0731512", "0950254",
            "0157765", "0428102", "0641695", "0795650", "0950791", "0196386", "0429148", "0656164", "0801925", "0973821"
        ]
    },
    {
        "drawNumber": "115th Draw (30th April 2024)",
        "firstPrize": ["0721593"],
        "secondPrize": ["0305573"],
        "thirdPrize": ["0300970", "0668838"],
        "fourthPrize": ["0004190", "0307761"],
        "fifthPrize": [
            "0031454", "0274641", "0504179", "0676880", "0860554", "0048288", "0332921", "0515396", "0695845", "0864246",
            "0064960", "0339921", "0537541", "0750972", "0907822", "0078403", "0376394", "0578905", "0792212", "0911973",
            "0094299", "0435817", "0590496", "0803980", "0918781", "0115726", "0450349", "0617261", "0829360", "0936437",
            "0145231", "0479938", "0634216", "0834586", "0972887", "0152843", "0499348", "0659691", "0845683", "0996609"
        ]
    },
    {
        "drawNumber": "116th Draw (31st July 2024)",
        "firstPrize": ["0934077"],
        "secondPrize": ["0629220"],
        "thirdPrize": ["0012221", "0168018"],
        "fourthPrize": ["0101686", "0862250"],
        "fifthPrize": [
            "0029425", "0226320", "0473350", "0657768", "0855266", "0074311", "0270371", "0548389", "0665179", "0866547",
            "0110196", "0399628", "0575290", "0691825", "0867303", "0144336", "0412683", "0576068", "0741710", "0891318",
            "0154942", "0436441", "0607081", "0776305", "0936281", "0184697", "0446329", "0640419", "0806983", "0972155",
            "0185921", "0459167", "0646702", "0815755", "0975522", "0207173", "0468855", "0655056", "0835172", "0995907"
        ]
    },
    {
        "drawNumber": "117th Draw (31st October 2024)",
        "firstPrize": ["0806964"],
        "secondPrize": ["0144370"],
        "thirdPrize": ["0307973", "0922432"],
        "fourthPrize": ["0578366", "0989676"],
        "fifthPrize": [
            "0031115", "0199085", "0334282", "0544115", "0790431", "0041692", "0212176", "0335349", "0559713", "0796090",
            "0042836", "0219476", "0354277", "0580350", "0851242", "0151385", "0222210", "0355922", "0581634", "0876946",
            "0152150", "0239043", "0372905", "0613149", "0885628", "0154873", "0279532", "0376794", "0688838", "0897793",
            "0156832", "0296704", "0463634", "0738341", "0987119", "0184499", "0305082", "0485595", "0749936", "0997206"
        ]
    },
    {
        "drawNumber": "118th Draw (02nd February 2025)",
        "firstPrize": ["0603908"],
        "secondPrize": ["0829320"],
        "thirdPrize": ["0167719", "0334670"],
        "fourthPrize": ["0203607", "0219185"],
        "fifthPrize": [
            "0012470", "0208639", "0384465", "0606118", "0722348", "0017060", "0238522", "0433293", "0606877", "0744802",
            "0023212", "0243504", "0466126", "0651552", "0747863", "0053374", "0253201", "0516003", "0655990", "0787489",
            "0067929", "0275638", "0522279", "0663075", "0815623", "0095286", "0336917", "0537604", "0680041", "0860801",
            "0104409", "0347003", "0576262", "0680621", "0932887", "0205060", "0364202", "0583547", "0693251", "0939925"
        ]
    },
    {
        "drawNumber": "119th Draw (30th April 2025)",
        "firstPrize": ["0264255"],
        "secondPrize": ["0398068"],
        "thirdPrize": ["0239164", "0442958"],
        "fourthPrize": ["0158649", "0230224"],
        "fifthPrize": [
            "0012206", "0239310", "0390325", "0570285", "0793960", "0021222", "0243330", "0404149", "0591177", "0823850",
            "0048519", "0244004", "0419883", "0595220", "0829024", "0054216", "0281612", "0449867", "0616879", "0865432",
            "0064993", "0311139", "0473840", "0665147", "0879266", "0069796", "0343075", "0489933", "0726820", "0951538",
            "0087559", "0357484", "0494583", "0770782", "0963626", "0145490", "0375730", "0497141", "0783934", "0968653"
        ]
    },
    {
        "drawNumber": "120th Draw (31st July 2025)",
        "firstPrize": ["0544222"],
        "secondPrize": ["0241768"],
        "thirdPrize": ["0553845", "0964052"],
        "fourthPrize": ["0054382", "0197142"],
        "fifthPrize": [
            "0006754", "0193354", "0376423", "0657734", "0751165", "0031296", "0222095", "0403635", "0657994", "0755724",
            "0053811", "0222465", "0419614", "0665757", "0772580", "0067566", "0254940", "0524935", "0674524", "0824988",
            "0104334", "0298266", "0541734", "0689419", "0826754", "0111371", "0311885", "0582986", "0702696", "0841503",
            "0149992", "0323362", "0613704", "0708033", "0848137", "0164606", "0328122", "0629638", "0735102", "0870222"
        ]
    }
    // Add more draws here as needed
];

// Command to store prize bond numbers
bot.onText(/\/storeprizebond (.+)/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const inputNumbers = match[1].split(',').map(num => num.trim());
    const validNumbers = [];
    const invalidNumbers = [];
    inputNumbers.forEach(number => {
        if (/^\d{1,10}$/.test(number)) {
            validNumbers.push(number);
        } else {
            invalidNumbers.push(number);
        }
    });
    if (invalidNumbers.length > 0) {
        bot.sendMessage(chatId, `🚫 Invalid prize bond numbers (must be up to 10 digits): ${invalidNumbers.join(', ')}`);
    }
    if (validNumbers.length === 0) {
        bot.sendMessage(chatId, "🚫 No valid prize bond numbers provided.");
        return;
    }
    if (!userData[chatId]) {
        userData[chatId] = [];
    }
    if (userData[chatId].length + validNumbers.length > 100) {
        bot.sendMessage(chatId, "🚫 You can store a maximum of 100 prize bond numbers.");
        return;
    }
    userData[chatId] = [...new Set([...userData[chatId], ...validNumbers])];
    bot.sendMessage(chatId, `📝 Your prize bond numbers have been stored: ${validNumbers.join(', ')}`);
});

// Command to view stored prize bond numbers
bot.onText(/\/myprizebond/, (msg) => {
    const chatId = msg.chat.id.toString();
    if (!userData[chatId] || userData[chatId].length === 0) {
        bot.sendMessage(chatId, "😢 You have no stored prize bond numbers. Use `/storeprizebond <numbers>` to store some.");
        return;
    }
    bot.sendMessage(chatId, `📋 Your stored prize bond numbers:\n\n${userData[chatId].join(', ')}`);
});

// Command to delete prize bond numbers
bot.onText(/\/delete (.+)/, (msg, match) => {
    const chatId = msg.chat.id.toString();
    const input = match[1].trim();
    if (!userData[chatId] || userData[chatId].length === 0) {
        bot.sendMessage(chatId, "😢 You have no stored prize bond numbers to delete.");
        return;
    }
    if (input.toLowerCase() === 'all') {
        userData[chatId] = [];
        bot.sendMessage(chatId, "🗑️ All your stored prize bond numbers have been deleted.");
        return;
    }
    const numbersToDelete = input.split(',').map(num => num.trim());
    userData[chatId] = userData[chatId].filter(num => !numbersToDelete.includes(num));
    bot.sendMessage(chatId, `🗑️ Deleted prize bond numbers: ${numbersToDelete.join(', ')}`);
});

// Command to check specific prize bond numbers against all draws
bot.onText(/\/check (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const inputNumbers = match[1].split(',').map(num => num.trim());
    let response = "";
    inputNumbers.forEach(number => {
        let foundInAnyDraw = false;
        let drawResponse = `📜 **Results for Prize Bond Number ${number}:**\n`;
        prizeBondDraws.forEach(draw => {
            let found = false;
            let prizeLevel = "";
            if (draw.firstPrize.includes(number)) {
                found = true;
                prizeLevel = "1st Prize";
            } else if (draw.secondPrize.includes(number)) {
                found = true;
                prizeLevel = "2nd Prize";
            } else if (draw.thirdPrize.includes(number)) {
                found = true;
                prizeLevel = "3rd Prize";
            } else if (draw.fourthPrize.includes(number)) {
                found = true;
                prizeLevel = "4th Prize";
            } else if (draw.fifthPrize.includes(number)) {
                found = true;
                prizeLevel = "5th Prize";
            }
            if (found) {
                foundInAnyDraw = true;
                drawResponse += `🎉 **${draw.drawNumber}**: **Match found!** (${prizeLevel})\n`;
            }
        });
        if (!foundInAnyDraw) {
            drawResponse += `😢 No match found in any draw.\n`;
        }
        response += drawResponse + "\n";
    });
    bot.sendMessage(chatId, response);
});

// Command to check stored prize bond numbers against all draws
bot.onText(/\/checkmyprizebond/, (msg) => {
    const chatId = msg.chat.id.toString();
    if (!userData[chatId] || userData[chatId].length === 0) {
        bot.sendMessage(chatId, "😢 You have no stored prize bond numbers. Use `/storeprizebond <numbers>` to store some.");
        return;
    }
    let response = "";
    userData[chatId].forEach(number => {
        let foundInAnyDraw = false;
        let drawResponse = `📜 **Results for Prize Bond Number ${number}:**\n`;
        prizeBondDraws.forEach(draw => {
            let found = false;
            let prizeLevel = "";
            if (draw.firstPrize.includes(number)) {
                found = true;
                prizeLevel = "1st Prize";
            } else if (draw.secondPrize.includes(number)) {
                found = true;
                prizeLevel = "2nd Prize";
            } else if (draw.thirdPrize.includes(number)) {
                found = true;
                prizeLevel = "3rd Prize";
            } else if (draw.fourthPrize.includes(number)) {
                found = true;
                prizeLevel = "4th Prize";
            } else if (draw.fifthPrize.includes(number)) {
                found = true;
                prizeLevel = "5th Prize";
            }
            if (found) {
                foundInAnyDraw = true;
                drawResponse += `🎉 **${draw.drawNumber}**: **Match found!** (${prizeLevel})\n`;
            }
        });
        if (!foundInAnyDraw) {
            drawResponse += `😢 No match found in any draw.\n`;
        }
        response += drawResponse + "\n";
    });
    bot.sendMessage(chatId, response);
});

// Command to list all available draws
bot.onText(/\/draws/, (msg) => {
    const chatId = msg.chat.id;
    let response = "📜 **List of Prize Bond Draws:**\n\n";
    prizeBondDraws.forEach(draw => {
        response += `- ${draw.drawNumber}\n`;
    });
    bot.sendMessage(chatId, response);
});

// Command to view details of a specific draw
bot.onText(/\/draw (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const drawNumber = match[1].trim();
    const draw = prizeBondDraws.find(d => d.drawNumber.includes(`${drawNumber}th Draw`));
    if (!draw) {
        bot.sendMessage(chatId, "🚫 Draw not found. Use `/draws` to see available draws.");
        return;
    }
    let response = `📜 **${draw.drawNumber}**\n\n`;
    response += `🥇 **1st Prize:** ${draw.firstPrize.join(', ')}\n`;
    response += `🥈 **2nd Prize:** ${draw.secondPrize.join(', ')}\n`;
    response += `🥉 **3rd Prize:** ${draw.thirdPrize.join(', ')}\n`;
    response += `🏅 **4th Prize:** ${draw.fourthPrize.join(', ')}\n`;
    response += `🎖️ **5th Prize:** ${draw.fifthPrize.join(', ')}`;
    bot.sendMessage(chatId, response);
});

// Author command
bot.onText(/\/author/, (msg) => {
    const chatId = msg.chat.id;
    const author = `
**To Know About Author Visit Website:**
⚜️ https://prizebond.free.nf ⚜️
    `;
    bot.sendMessage(chatId, author, { parse_mode: 'Markdown' });
});

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const start = `
**Type or press on 👉 /help 👈 to start**
    `;
    bot.sendMessage(chatId, start);
});

// Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
📌 **Available Commands:**
/storeprizebond <numbers> - Store your prize bond numbers (comma-separated, up to 10 digits each).
/myprizebond - View your stored prize bond numbers.
/delete <numbers> - Delete specific prize bond numbers (comma-separated) or use "all" to delete all.
/checkmyprizebond - Check your stored prize bond numbers against all draws.
/check <numbers> - Check specific prize bond numbers (comma-separated, up to 10 digits each) against all draws.
/draws - List all available prize bond draws.
/draw <draw_number> - View details of a specific draw (e.g., /draw 111).
/author - Know about the author.
/help - Show this help message.
♻️ If you find the chatbot inactive, please visit 👉 https://prizebond-bot.onrender.com 👈 to activate it. ♻️
    `;
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

console.log('Bot is running...');

// Express server for Render.com
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Prize Bond Bot</title>
        </head>
        <body>
            <h1>🎉 Prize Bond Checker Bot</h1>
            <p>This bot is running and ready to check your prize bond numbers!</p>
            <p>Use it in Telegram: <a href="https://t.me/prizebondbot">@prizebondbot</a></p>
        </body>
        </html>
    `);
});

// Bind to 0.0.0.0 and the PORT environment variable
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

