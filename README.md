# [grammY](https://grammy.dev) on [Deta](https://deta.sh)

## What is this 'Check-My-Web' Cron about


## Preparation 'Bot Part'

See [README.md](https://github.com/egave/check-my-web-bot/blob/master/README.md) 

## Preparation 'Cron Part'

1. Change `.env` key values
    11. Put your bot token in the `.env` file under the BOT_TOKEN key
    12. Put your bot token removed of all special caracters in the `.env` file under the SECRET_PATH key
2. Run `deta update -e .env` to sync the token
3. Run `yarn install` to install dependencies
4. Run `yarn deploy` to deploy the project
5. Run `deta cron set "5 minutes"` to launch crontab every 5 minutes
6. Run `deta visor enable` to enable logging on deta dashboard

## Running the bot locally

Use `yarn dev` to run the bot locally for development.

Note that it will delete webhook url and you'll need to repeat the 3rd step to be able to run the bot on Deta (or you can use a different token).

Note that you'll have to manually provide `DETA_PROJECT_KEY` env in order for Deta Base session storage to work.
It can be obtained on the Project Settings page.
