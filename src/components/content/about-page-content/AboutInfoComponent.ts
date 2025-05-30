import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";

export default class AboutInfoComponent extends FrontendyComponent {
    componentName: string = 'home-dashboard-component';

    template() {
        return elem("div")
            .setProps({ 
                id: "home-dashboard-component",
                class : "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6", 
            })
            .setChild([
                elem("h1")
                .setProps({ class : "text-2xl font-bold mb-4" })
                .addChild(text(`About us`)),
                
                elem("p")
                .setProps({ class : "text-gray-700 text-base mb-4" })
                .addChild(text("ft_transcendence is a project that aims to provide a platform for developers to learn and practice their skills in a collaborative environment.")),

                elem("h2")
                .setProps({ class : "text-xl font-bold mb-2" })
                .addChild(text("Our team:")),

                elem("ul")
                .setProps({ class : "list-disc list-inside mb-4" })
                .setChild([
                    elem("li").addChild("Timur Mazitov - Team Lead and Frontend developer"),
                    elem("li").addChild("Valeria Lomakina - Backend Developer"),
                    elem("li").addChild("Sofia Abdulkina - Backend Developer"),
                    elem("li").addChild("Dastan Abdygali - Game Developer"),
                    elem("li").addChild("Alban Medetbek - DevOps Engineer"),
                ]),
            ]);
    }
}