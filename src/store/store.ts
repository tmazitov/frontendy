import API from "../api/api";
import { isAuthorized } from "../api/client";

export default class Store {


    public static async setupUser() {
        if (!isAuthorized()) {
            return ;
        }

        const user = await API.ums.userGetInfo()
        console.log({user})
    }

}