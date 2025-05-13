import StoreGetters from "./getters";
import StoreSetters from "./setters";
import StoreState from "./state";


export default class Store {
    private static state:StoreState = new StoreState()

    public static setters:StoreSetters = new StoreSetters(this.state);
    public static getters:StoreGetters = new StoreGetters(this.state);
}   