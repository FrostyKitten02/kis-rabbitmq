import {directQueue} from "../main.mjs";
import {sendMessage} from "./direct-msg.mjs";


sendMessage("Hello world!", directQueue)