import Config from "../config";
import MMRS from "./mmrs";
import UMS from "./ums";

export default class API {
    
    public static readonly ums = new UMS(`${this.http()}://${Config.umsAddr}/api/rest`);
    public static readonly mmrs = new MMRS(`${this.http()}://${Config.mmrsAddr}/api/rest`)

    public static http() {
        if (Config.secure) {
            return "https";
        }
        return "http";
    }

    public static ws() {
        if (Config.secure) {
            return "wss";
        }
        return "ws";
    }
}