import { type } from "jquery"
import { RuntimeCommandType_CBC, RuntimeCommandType_PBP } from "../enum_store/linkedin_enums"

export type RunTimeMessage_PBP = {
    type: RuntimeCommandType_PBP,
    content?: any
} 

export type RunTimeMessage_CBC = {
    type: RuntimeCommandType_CBC,
    content?: any
} 

export type JobDetails_CB = {
    title: string | null,
    description: string | null
}