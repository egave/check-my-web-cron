import Base from './base'
import { UrlData } from '../types/UrlData';

const Sessions = Base.use('session', true)

export class SessionDb {

    key: string;
    urlData?: UrlData[];
    
    // urlData?: {
    //     url: string
    //     action: number
    //     content_type: string
    //     last_status: number
    //     last_md5: string
    // }[]
    
    constructor(data: SessionDb) {
		this.key = data.key
        this.urlData = data.urlData
	}

    static async find(query: any = {}, limit?: number, lastId?: string) {
        const { items, count, last } = await Sessions.find(query, limit, lastId)

        if (!items) return { count: 0, last: undefined, items: [] }

        return { count, last, items: items.map((session: SessionDb) => new SessionDb(session)) }
    }
}