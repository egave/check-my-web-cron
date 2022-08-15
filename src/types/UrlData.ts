import { CHECK_TYPE } from '../config'

type UrlData = {
    url: string
    check_type: string
    sentence?: string
    content_type: string | undefined
    last_status: number | undefined
    last_md5?: string | undefined
}

export { UrlData }