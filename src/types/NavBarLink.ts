export default class NavBarLink {
    label: string;
    routeName: string;

    constructor(label: string, routeName: string) {
        this.label = label;
        this.routeName = routeName;
    }
}
