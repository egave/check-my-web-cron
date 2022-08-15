import { Router } from '@grammyjs/router'
import { Context, Keyboard } from 'grammy'
import type { CustomContext } from '../types/CustomContext'
import { CHECK_TYPE } from '../config'
import { validURL } from '../utils/validURL'
import { Result, getWebResourceInfo } from '../utils/getWebResourceInfo'
import { FluentVariable } from '@fluent/bundle'

var result: Result;

const router = new Router<CustomContext>(ctx => ctx.session.route)

router.route('add-url', async ctx => {
    const urlToAdd = String(ctx.msg?.text)
    // Check if submitted URL is valid
    if (!validURL(urlToAdd)) {
        ctx.session.route = 'idle'
        await ctx.reply(ctx.t('invalid-url'));
        return;
    }

    // Check if URL is already in the list of URLs to be monitored
    const urlInLIst:boolean = ctx.session.urlData.some(({ url }) => url === urlToAdd);
    if (urlInLIst === true) {
        ctx.session.route = 'idle'
        await ctx.reply(ctx.t('url-already-listed'));
        return;
    }

    ctx.session.urlToAdd = urlToAdd;

    result = await getWebResourceInfo(ctx.session.urlToAdd);
    // Error in the GET
    if (result.error?.valueOf() ) {
        console.log(`/add URL ${ctx.session.urlToAdd} failed with error: ${result.error}`)
        await ctx.reply(ctx.t('get-web-resource-failed', {
            url: ctx.session.urlToAdd,
            error: result.error
        }));
        ctx.session.route = "idle";
        ctx.session.urlToAdd = "";

        return;
    }
    else {
        if (result.status != 200) {
            // GET did not returned a 200 HTTP status code  
            console.log(`/add URL ${ctx.session.urlToAdd} failed. GET request returned status: ${result.status}`)
            await ctx.reply(ctx.t('get-bad-status', {
                url: ctx.session.urlToAdd,
                status: result.status ? result.status : -1 
                })
            );
            ctx.session.route = "idle";
            ctx.session.urlToAdd = "";

            return;
        } 
        else {
            ctx.session.route = 'add-check-type';
            await ctx.reply(ctx.t('ask-check-type'), {
                reply_markup: {
                one_time_keyboard: true,
                keyboard: new Keyboard()
                .text(CHECK_TYPE[0]).text(CHECK_TYPE[1]).row()
                .text(CHECK_TYPE[2]).text(CHECK_TYPE[3]).build(),
                },
            });
        }
    }
})
 
router.route('add-check-type', async ctx => {
    // Should not happen, unless session data is corrupted.
    const urlToAdd = ctx.session.urlToAdd;
    if (urlToAdd === undefined) {
        await ctx.reply(ctx.t('missing-url'));
        ctx.session.route = "add-url";
        return;
    }

    // Check type is not a valid type.
    const checkType = CHECK_TYPE.indexOf(String(ctx.msg?.text));
    if (checkType === -1) {
        await ctx.reply(ctx.t('wrong-check-type'));
        ctx.session.route = "add-check-type";

        return;
      }

    ctx.session.checkType = checkType;    
    // Check given type needs a 'sentence' (word) parameter.
    if ((ctx.session.checkType === 2) || (ctx.session.checkType === 3)) {
        ctx.session.route = 'add-sentence';
        await ctx.reply(ctx.t('ask-sentence'), {
            reply_markup: { remove_keyboard: true }
        });
    } else {
        ctx.session.urlData.push({ 'url': ctx.session.urlToAdd, 'check_type': CHECK_TYPE[ctx.session.checkType], 'content_type': result.contentType, 'last_status': result.status, 'last_md5': result.bodyMD5 })
        console.log(`/add URL ${ctx.session.urlToAdd} suceeded`)
            
        await ctx.reply(ctx.t('added-url', {
            url: ctx.session.urlToAdd,
            contentType: (result.contentType != undefined)?result.contentType:"undefined",
            status: (result.status != undefined)?result.status:"undefined",
            md5: (result.bodyMD5 != undefined)?result.bodyMD5:"undefined"
        }),  {
            reply_markup: { remove_keyboard: true }
        });
        ctx.session.route = "idle";
        ctx.session.urlToAdd = "";
        ctx.session.checkType = -1;
    }
})

// TODO: 
router.route('add-sentence', async ctx => {
    // Should not happen, unless session data is corrupted.
    const urlToAdd = ctx.session.urlToAdd;
    if (urlToAdd === undefined) {
        await ctx.reply(ctx.t('missing-url'));
        ctx.session.route = "add-url";
        return;
    }
    // Should not happen, unless session data is corrupted.
    const checkType = ctx.session.checkType;
    if (checkType === undefined) {
        await ctx.reply(ctx.t('missing-check-type'));
        ctx.session.route = "add-check-type";
        return;
    }

    // TODO : check if sentence is or is not present according to checkType

    // Get 'sentence' parameter 
    const sentence = String(ctx.msg?.text)
    if ( sentence === "" )
    {
        ctx.session.route = 'add-sentence';
        await ctx.reply(ctx.t('missing-sentence'));
    }
    else {
        ctx.session.sentence = sentence
        ctx.session.urlData.push({ 'url': ctx.session.urlToAdd, 'check_type': CHECK_TYPE[ctx.session.checkType], 'sentence': ctx.session.sentence, 'content_type': result.contentType, 'last_status': result.status, 'last_md5': result.bodyMD5 })
        console.log(`/add URL ${ctx.session.urlToAdd} suceeded`)
            
        await ctx.reply(ctx.t('added-url', {
            url: ctx.session.urlToAdd,
            contentType: (result.contentType != undefined)?result.contentType:"undefined",
            status: (result.status != undefined)?result.status:"undefined",
            md5: (result.bodyMD5 != undefined)?result.bodyMD5:"undefined"
        }));
        ctx.session.route = "idle";
        ctx.session.urlToAdd = "";
        ctx.session.checkType = -1;
        ctx.session.sentence = "";
    }
})

async function storeWatchScenario(_ctx: CustomContext) {
   // GET the Web resource
   const result = await getWebResourceInfo(_ctx.session.urlToAdd);
   // Error in the GET
   if (result.error?.valueOf() ) {
       console.log(`/add URL ${_ctx.session.urlToAdd} failed with error: ${result.error}`)
       await _ctx.reply(_ctx.t('get-web-resource-failed', {
           url: _ctx.session.urlToAdd,
           error: result.error
       }));
   }
   else {
       if (result.status != 200) {
           // GET did not returned a 200 HTTP status code  
           console.log(`/add URL ${_ctx.session.urlToAdd} failed. GET request returned status: ${result.status}`)
           await _ctx.reply(_ctx.t('get-bad-status', {
                        url: _ctx.session.urlToAdd,
                        status: result.status ? result.status : -1 
                        })
            );
       } 
       else {
           // GET returned a 200 HTTP status code. We can add the URL to the list.
          
           // if (ctx.session.url.length == 0)
           //     ctx.session.url = []
           //const urlData:UrlData = { url, ACTION['PING'], -1 }
           _ctx.session.urlData.push({ 'url': _ctx.session.urlToAdd, 'check_type': CHECK_TYPE[_ctx.session.checkType], 'sentence': _ctx.session.sentence, 'content_type': result.contentType, 'last_status': result.status, 'last_md5': result.bodyMD5 })
           console.log(`/add URL ${_ctx.session.urlToAdd} suceeded`)
           await _ctx.reply(_ctx.t('added-url', {
               url: _ctx.session.urlToAdd,
               contentType: (result.contentType != undefined)?result.contentType:"undefined",
               status: result.status,
               md5: (result.bodyMD5 != undefined)?result.bodyMD5:"undefined"
           }),  {
               reply_markup: { remove_keyboard: true }
           });
           //await ctx.reply(url+' is a valid URL.\nContent-Type=' + result.contentType + '\nStatus=' + result.status + '\nbodyMD5='+result.bodyMD5);
       }
   }
   _ctx.session.urlToAdd = "";
   _ctx.session.checkType = -1;
   _ctx.session.sentence = "";
   _ctx.session.route = "idle";
}

export { router }