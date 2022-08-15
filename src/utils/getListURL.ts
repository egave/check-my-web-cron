import type { UrlData } from '../types/UrlData'

export function getListURL(_listUrlData: UrlData[]) : string {
  let stringifyURLs: string = "";
  _listUrlData.forEach(function(value: UrlData, index: number) {
    let url = value.url;
    let checkType = value.check_type;
    stringifyURLs = stringifyURLs + `${index+1}. ${checkType} - ${url} \n`
  })
  return stringifyURLs;
}