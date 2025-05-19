import ProfileSettingsPageContent from "../components/content/profile-settings-page-content/ProfileSettingsPageContent";
import ButtonComponent from "../components/inputs/ButtonComponent";
import DashboardComponent from "../layouts/dashboard/DashboardLayout";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text, } from "../pkg/frontendy/vdom/constructor";
import router from "./router";


export default class ProfileSettingsPage extends FrontendyComponent {
    componentName: string = 'profile-settings-page';
    
    
    template() {
        const dashboard = new DashboardComponent()
            .setSlot("content", new ProfileSettingsPageContent())
            .setSlot("header", elem("div")
                .setProps({ class : "flex gap-4 items-center mb-4" })
                .setChild([
                    new ButtonComponent({color: "gray", icon: "ti ti-arrow-left", type: 'blank', size: "small"})
                    .onClick(() => router.push("profile")),

                    elem("h1")
                    .setProps({ class : "text-2xl font-bold" })
                    .addChild(text("Profile settings")),
                ]))
        
        return elem("div")
            .setProps({ id: "profile-settings-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-4 pt-8" })
                .addChild(dashboard)
        ])
    }
}