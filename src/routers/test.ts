import { Router } from '@grammyjs/router'
import type { CustomContext } from '../types/CustomContext'
import { validURL } from '../utils/validURL'
import { getWebResourceInfo } from '../utils/getWebResourceInfo'

const router = new Router<CustomContext>(ctx => ctx.session.route)

router.route('test-url', async ctx => {
    ctx.session.route = 'idle'

    const url = String(ctx.msg?.text)
    if (!validURL(url)) {
        await ctx.reply(ctx.t('invalid-url', {
            name: ctx.from?ctx.from.first_name:'inconnu'
          }));
        return;
    }

    const result = await getWebResourceInfo(url);

    if (result.error?.valueOf()) {
        console.log('request failed')
        await ctx.reply(url+' is a valid URL.');
        await ctx.reply('But GET request failed with error: "' + result.error + '"');
    }
    else {
        console.log('request suceeded')
        await ctx.reply(url+' is a valid URL.\nContent-Type=' + result.contentType + '\nStatus=' + result.status + '\nbodyMD5='+result.bodyMD5);
    }
})

export { router }