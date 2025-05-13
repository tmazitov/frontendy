import User from "../types/User";
import StoreField from "./field";

export default class StoreState{
    public user:StoreField<User> = new StoreField<User>();
}