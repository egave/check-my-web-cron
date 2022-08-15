require('dotenv/config')
import { bot } from './bot'

bot.catch(error => console.log("Catched error: "+error));
bot.start()
