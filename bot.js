const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// Read your Telegram Bot Token from environment variable
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Error: TELEGRAM_TOKEN is not set in environment variables.");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Load prize bond data
const prizebondFile = path.join(__dirname, 'prizebond.json');
const prizebondData = JSON.parse(fs.readFileSync(prizebondFile, 'utf-8'));

// Users saved numbers
const usersFile = path.join(__dirname, 'users.json');

// Helper to load user data
function loadUsers() {
  if (!fs.existsSync(usersFile)) return {};
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

// Helper to save user data
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Command: /store
bot.onText(/\/store (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const numbers = match[1].split(',').map(n => n.trim());

  const users = loadUsers();
  users[chatId] = numbers;
  saveUsers(users);

  bot.sendMessage(chatId, `✅ Stored your numbers: ${numbers.join(', ')}`);
});

// Command: /check
bot.onText(/\/check/, (msg) => {
  const chatId = msg.chat.id;
  const users = loadUsers();
  const savedNumbers = users[chatId];

  if (!savedNumbers || savedNumbers.length === 0) {
    bot.sendMessage(chatId, `ℹ️ You have not stored any numbers yet. Use /store command.`);
    return;
  }

  let results = [];

  for (const draw of prizebondData) {
    for (const prize in draw) {
      if (prize === 'DrawNo') continue;
      const drawNumbers = Array.isArray(draw[prize]) ? draw[prize] : [draw[prize]];
      const matched = savedNumbers.filter(num => drawNumbers.includes(num));
      if (matched.length > 0) {
        results.push(`Draw ${draw.DrawNo} - ${prize} Prize: ${matched.join(', ')}`);
      }
    }
  }

  if (results.length === 0) {
    bot.sendMessage(chatId, `❌ No match found for your stored numbers.`);
  } else {
    bot.sendMessage(chatId, `🎉 Matches found:\n\n${results.join('\n')}`);
  }
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
Welcome to Prize Bond Bot!

Commands:
/store <num1>, <num2>, ... - Save your numbers
/check - Check stored numbers against latest draws
/help - Show this help message
`;
  bot.sendMessage(chatId, helpMessage);
});
// Author command
bot.onText(/\/author/, (msg) => {
    const chatId = msg.chat.id;
    const author = `
**To Know About Author Visit Website:**
⚜️ https://prizebond.free.nf ⚜️
    `;
    bot.sendMessage(chatId, author);
});

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const start = `
**Type or press on 👉 /help 👈 to start**
    `;
    bot.sendMessage(chatId, start);
});

console.log("🤖 PrizeBond Bot is running...");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🤖 PrizeBond Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});





