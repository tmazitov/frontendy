import ProfilePageContent from "../components/content/profile-page-content/ProfilePageContent";
import DashboardComponent from "../layouts/dashboard/DashboardLayout";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem } from "../pkg/frontendy/vdom/constructor";

export default class FriendProfilePage extends FrontendyComponent {
    componentName: string = 'friend-profile-page';

    template() {

        const isFriend = true

        const dashboard = new DashboardComponent("Profile")
            .setSlot("content", new ProfilePageContent(isFriend));
        
        return elem("div")
            .setProps({ id: "profile-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-4 pt-8" })
                .addChild(dashboard)    
        ])
    }
}