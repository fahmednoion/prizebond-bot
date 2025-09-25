const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Replace with your actual Telegram bot token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Load prize bond data
const prizebondData = JSON.parse(fs.readFileSync('prizebond.json'));

// Helper function to check if a number exists in any draw
function checkPrizeBond(number) {
  const results = [];

  prizebondData.draws.forEach(draw => {
    let prizeCategory = null;

    for (const [category, numbers] of Object.entries(draw)) {
      if (category === "drawNo" || category === "date") continue;

      if (numbers.includes(number)) {
        prizeCategory = category;
        break;
      }
    }

    if (prizeCategory) {
      results.push({
        drawNo: draw.drawNo,
        date: draw.date,
        prize: prizeCategory
      });
    }
  });

  return results;
}

// Bot commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome! Send me a prize bond number to check if it has won.");
});

bot.onText(/\/check (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const number = match[1].trim();

  if (!/^\d+$/.test(number)) {
    bot.sendMessage(chatId, "Please enter a valid numeric prize bond number.");
    return;
  }

  const results = checkPrizeBond(number);

  if (results.length > 0) {
    let response = `🎉 Prize bond number ${number} has won in:\n`;
    results.forEach(res => {
      response += `Draw #${res.drawNo} (${res.date}) - ${res.prize} Prize\n`;
    });
    bot.sendMessage(chatId, response);
  } else {
    bot.sendMessage(chatId, `❌ No match found for ${number}.`);
  }
});
