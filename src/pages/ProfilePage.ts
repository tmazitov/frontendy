import { isAuthorized } from "../api/client";
import ProfilePageContent from "../components/content/profile-page-content/ProfilePageContent";
import DashboardComponent from "../layout/dashboard/DashboardLayout";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import router from "./router";


export default class ProfilePage extends FrontendyComponent {
    componentName: string = 'profile-page';
    
    
    template() {
        const dashboard = new DashboardComponent("Profile")
            .setSlot("content", new ProfilePageContent());
        
        return elem("div")
            .setProps({ id: "profile-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-4 pt-8" })
                .addChild(dashboard)    
        ])
    }
}