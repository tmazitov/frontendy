import Config from "../config";
import MMRS from "./mmrs";
import UMS from "./ums";

export default class API {
    public static readonly ums = new UMS(`http://${Config.umsAddr}/api/rest`);
    public static readonly mmrs = new MMRS(`http://${Config.mmrsAddr}/api/rest`)
}