# prizebond-bot
Telegram bot to check Prize Bond numbers

# Prize Bond Telegram Bot

A simple Telegram bot to check Prize Bond numbers against official draw results.

## Features

- Users can check their Prize Bond number using a simple command:
  ```
  /check <your_number>
  ```
- Replies with the prize won (1st–5th prize) or "No match found".
- Easy to deploy on **Render** or other Node.js hosting platforms.
- Uses a JSON file to store draw numbers for quick matching.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/prizebond-bot.git
   cd prizebond-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Telegram Bot token as an environment variable:
   ```bash
   export BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"
   ```

4. Start the bot:
   ```bash
   npm start
   ```

## Deployment

- Recommended: Deploy on **Render Web Service**.
- Set `BOT_TOKEN` as an environment variable in Render.
- Start command: `npm start`.

## License

MIT License
