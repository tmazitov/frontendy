import FrontendyRoute from "../pkg/frontendy/router/route";
import FrontendyRouter from "../pkg/frontendy/router/router";
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";

const routes:Array<FrontendyRoute> = [
    {name: "home", path: "/", component: HomePage},
    {name: "about", path: "/about", component: AboutPage},
]

const routerConfig = {
    NotFoundPage: NotFoundPage,
}
const router = new FrontendyRouter(routes, routerConfig)

export default router
