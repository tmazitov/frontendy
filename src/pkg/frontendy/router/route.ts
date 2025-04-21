import FrontendyComponent from "../component/component";

type FrontendyRoute = {
    path : string;
    name : string;
    component : typeof FrontendyComponent;
}

export default FrontendyRoute;