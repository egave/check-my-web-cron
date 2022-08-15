import { SessionDb } from '../service/SessionDb';
import { UrlData } from '../types/UrlData';
import { notifBot } from '../notifBot';
import { getWebResourceInfo } from '../utils/getWebResourceInfo';
import { CHECK_TYPE } from '../config';

export async function doTask():Promise<string> {
    try {
        const result = await SessionDb.find({});
        console.log("Db 'session' contains:" + result.count + " 'Check-My-Web Bot' session(s)")
        // For Each Check-My-Web Bot Chat-Id represented by the session 'key'

        // WARNING: DON'T USE foreach loop
        // as Async/await doesn't work in the forEach loop (because it works in parallel)
        for (let j = 0; j< result.items.length; j++) {
            let myUrlData:UrlData[] = <UrlData[]>result.items[j].urlData;
            console.log("* * *\nsession for key: '" + result.items[j].key + "' has " + myUrlData.length + " items")
            
            // WARNING: DON'T USE foreach loop
            // as Async/await doesn't work in the forEach loop (because it works in parallel)
            for (let i = 0; i < myUrlData.length; i++) {
                console.log("Checking URL : " + myUrlData[i].url)
                const checkResult = await getWebResourceInfo(myUrlData[i].url);
                if (checkResult.error?.valueOf()) {
                    console.log('=> Request failed')
                    console.log('Content-Type=' + checkResult.contentType + '\nStatus=' + checkResult.status + '\nbodyMD5='+checkResult.bodyMD5);
                    // await ctx.reply('But GET request failed with error: "' + result.error + '"');
                }
                else {
                    //console.log('Request suceeded')
                    //console.log('Content-Type=' + checkResult.contentType + '\nStatus=' + checkResult.status + '\nbodyMD5='+checkResult.bodyMD5);
                    // FOR Testing PURPOSE //await notifBot.api.sendMessage(result.items[j].key, 'Content-Type=' + checkResult.contentType + '\nStatus=' + checkResult.status + '\nbodyMD5='+checkResult.bodyMD5);
                    //let notifMessage:string = "";
                    switch (myUrlData[i].check_type) {
                        // CHECK-STATUS
                        case CHECK_TYPE[0]:
                            if (checkResult.status != 200) {
                                //notifMessage = "check-status-failed"
                                console.log('check-status-failed');
                                await notifBot.api.sendMessage(result.items[j].key, 
                                        `CHECK-STATUS ERROR: URL : ${myUrlData[i].url}, status: ${checkResult.status}`)
                            }
                            break;
                        // CHECK-MD5
                        case CHECK_TYPE[1]:
                            if (checkResult.bodyMD5 != myUrlData[i].last_md5) {
                                //notifMessage = "check-md5-failed"
                                console.log('check-md5-failed');
                                await notifBot.api.sendMessage(result.items[j].key, 
                                    `CHECK-MD5 ERROR: URL : ${myUrlData[i].url}, md5: ${checkResult.bodyMD5}`)
                            }
                            break;
                        
                        // CHECK-WORD-HIT
                        case CHECK_TYPE[2]:
                            if (checkResult.data.search(myUrlData[i].sentence) == -1) {
                                //notifMessage = "check-word-hit-failed"
                                console.log('check-word-hit-failed');
                                await notifBot.api.sendMessage(result.items[j].key, 
                                    `CHECK-WORD-HIT ERROR: URL : ${myUrlData[i].url}, md5: ${checkResult.bodyMD5}, body does not contains sentence "${myUrlData[i].sentence}""`)
                            }
                            break;
                    
                        // CHECK-WORD-MISS
                        case CHECK_TYPE[2]:
                            if (checkResult.data.search(myUrlData[i].sentence) != -1) {
                                //notifMessage = "check-word-miss-failed"
                                console.log('check-word-miss-failed');
                                await notifBot.api.sendMessage(result.items[j].key, 
                                    `CHECK-WORD-MISS ERROR: URL : ${myUrlData[i].url}, md5: ${checkResult.bodyMD5}, body should not contains sentence "${myUrlData[i].sentence}""`)
                            }
                            break;
                        default:
                            break;
                    } (myUrlData[i].check_type)
                }
            }
        }
        return "doTask completed"
    }
    catch (error){
        return "An error occured in doTask() :"+error
    }
}