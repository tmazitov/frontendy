import MMRS from "./mmrs";
import UMS from "./ums";

export default class API {
    public static readonly ums = new UMS("http://localhost:5000/auth/api/rest");
    public static readonly mmrs = new MMRS("http://localhost:5001/mmrs/api/rest")
}