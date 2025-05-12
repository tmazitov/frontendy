import UMS from "./ums";

export default class API {
    public static readonly ums = new UMS("http://localhost:5000/auth/api/rest");
}