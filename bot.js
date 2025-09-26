const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const token = process.env.BOT_TOKEN; // Use environment variable
const bot = new TelegramBot(token, { polling: true });

// Load prize bond draw data from JSON file
const prizeBondDraws = JSON.parse(fs.readFileSync('prizebond.json', 'utf8'));

// File to store user data
const userDataFile = 'userData.json';

// Load user data from file
let userData = {};
if (fs.existsSync(userDataFile)) {
    userData = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
}

// Function to save user data to file
function saveUserData() {
    fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));
}

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
    saveUserData();

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
        saveUserData();
        bot.sendMessage(chatId, "🗑️ All your stored prize bond numbers have been deleted.");
        return;
    }

    const numbersToDelete = input.split(',').map(num => num.trim());
    userData[chatId] = userData[chatId].filter(num => !numbersToDelete.includes(num));
    saveUserData();

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
📌 **To Know About Author Visit Website:**
https://prizebond.free.nf
    `;
    bot.sendMessage(chatId, author);
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
    `;
    bot.sendMessage(chatId, helpMessage);
});

console.log('Bot is running...');
