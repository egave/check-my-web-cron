import { SessionData } from './SessionData'
import type { Context, SessionFlavor } from 'grammy'
import { FluentContextFlavor } from "@grammyjs/fluent";

type CustomContext = ( 
    & Context 
    & FluentContextFlavor 
    & SessionFlavor<SessionData>
  );

export type { CustomContext }