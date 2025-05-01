export default class NavBarLink {
    icon: string;
    label: string;
    routeName: string;

    constructor(label: string, routeName: string, icon: string) {
        this.label = label;
        this.routeName = routeName;
        this.icon = icon;
    }
}
