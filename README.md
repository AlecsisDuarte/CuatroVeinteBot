# CuatroVeinteBot
## A simple telegram-bot made to send 420 gifs at 4:20 :sun_with_face: or :new_moon_with_face: 

### Description
This [Telegram-bot](https://core.telegram.org/bots) named **CuatroVeinteBot** sends a random gif from [Giphy]() using the [giphy-api](https://github.com/austinkelleher/giphy-api) to the Telegram chat this bot is at, using the [telebot](https://github.com/mullwar/telebot) api.

### Installation
In order to get the bot up and running you would need to clone and install the solution
```bash
git clone https://github.com/AlecsisDuarte/CuatroVeinteBot.git
cd CuatroVeinteBot
npm install
```
then create the `.env` file in the root of the project
```bash
touch .env
```
inside the `.env` file we add this **keys**:
- `GIPHY_TOKEN`: And the Giphy token received when creating an app in [developers.giphy](https://developers.giphy.com/)
- `TELEGRAM_BOT_TOKEN`: Token received by [BotFather](https://core.telegram.org/bots#6-botfather) using Telegram

and finally just run the node
```bash
npm start
```

### Ideas
Even thought this is a simple and my first telegram-bot I'm thinking on improving the functionality in order to be used by many.

#### Todo:
- [x] Get a random gif
- [x] Send gifs to conversation at 4:20 :herb: am and pm 
- [] Add multi-timezone capability :earth_americas:
- [] Store data in SQLite file :scroll:
