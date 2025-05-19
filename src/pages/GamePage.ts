import GameComponent from "../components/content/game-page-content/GameComponent";
import ProfileSettingsPageContent from "../components/content/profile-settings-page-content/ProfileSettingsPageContent";
import ButtonComponent from "../components/inputs/ButtonComponent";
import DashboardComponent from "../layout/dashboard/DashboardLayout";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import router from "./router";

export default class GamePage extends FrontendyComponent {
    componentName: string = 'game-page';

    data() {
        return {}
    }

    template() {
        const dashboard = new DashboardComponent()
            .setSlot("content", new GameComponent())
        
        return elem("div")
            .setProps({ id: "game-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-4 pt-8" })
                .addChild(dashboard)
        ])
    }
}