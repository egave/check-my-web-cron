import axios from 'axios';
import { createHash } from 'crypto';

export interface Result {
  error?: string,
  status?: number,
  contentType?: string,
  bodyMD5?: string,
  data?: any
}

export async function getWebResourceInfo(url: string):Promise<Result>  {
  try {
    const res = await axios.get(url);

    let md5 = createHash('md5').update(res.data, 'utf8').digest('base64');

    const result:Result = {status: res.status, contentType: res.headers['content-type'], bodyMD5: md5, data: res.data};

    console.log('response status is: ', result.status);
    console.log('response content-type is: ', result.contentType);
    //console.log('response content-body is: ', res.data);
    console.log('response content-body MD5 is: ', result.bodyMD5 + '\n- - - -');
    
    return result;
  } catch (error) {
    var result:Result = {error:'An unexpected error occurred'};
    if (axios.isAxiosError(error)) {
      console.log('[getWebResourceInfo] Axios error message: ', error.message);
      result = {error:error.message, status: error.response?.status}
    } else {
      console.log('[getWebResourceInfo] Unexpected error: ', error);
    }
    return result;
  }
}