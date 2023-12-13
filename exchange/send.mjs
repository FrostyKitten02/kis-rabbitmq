import {exchangeName} from "../main.mjs";
import {publishMessage} from "./publish-subscribe.mjs";


publishMessage("Hello World!", exchangeName);