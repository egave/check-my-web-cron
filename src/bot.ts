import { apiThrottler } from '@grammyjs/transformer-throttler'
import { Bot, session } from 'grammy'
import { DetaAdapter } from '@grammyjs/storage-deta'
import { fluent } from './utils/i18n'
import { useFluent } from "@grammyjs/fluent"
import { composer } from './composers'
import { router as addRouter } from './routers/add'
import { router as testRouter } from './routers/test'
import type { SessionData } from './types/SessionData'
import type { CustomContext } from './types/CustomContext'

// 1. Create a bot with a token
export const bot = new Bot<CustomContext>(process.env.BOT_TOKEN || '')

bot.use(useFluent({
  fluent,
}));

// 2. Attach an api throttler transformer to the bot
bot.api.config.use(apiThrottler())

// 3. Attach a session middleware and specify the initial data
bot.use(
  session({
    initial: () => ({ 
      route: 'idle',
      urlToAdd: '',
      checkType: -1,
      sentence: '',
      urlData: [],
      count: 0 }),
    storage: new DetaAdapter<SessionData>({
      baseName: 'session', // <-- Base name - your choice.
      projectKey: process.env.DETA_PROJECT_KEY || '',
    }),
  }),
)

// 4. Attach all routers to the bot as middleware
bot.use(addRouter)
bot.use(testRouter)

// 5. Attach all composers to the bot as middleware
bot.use(composer)

// 6. Start the bot
//bot.start()
