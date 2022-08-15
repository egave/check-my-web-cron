import { App, Deta } from 'deta'
import express from 'express'
import { doTask } from './tasks';
import { SessionDb } from './service/SessionDb';
import { bot } from './bot'
import { UrlData } from './types/UrlData';
import { getWebResourceInfo } from './utils/getWebResourceInfo';

const app = App(express());

//const deta = Deta(); 

app.lib.cron(async (event: any) => {
    const result:string = await doTask();
    return result
});

module.exports = app;
