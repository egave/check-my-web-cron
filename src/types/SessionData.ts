import type { UrlData } from './UrlData';

interface SessionData {
    route: "idle" | "test-url" | "add-url" | "add-check-type" | "add-sentence"; // which step of the 'add' form we are on
    urlToAdd: string
    checkType: number
    sentence: string
    count: number
    urlData: UrlData[]
}

export { SessionData }