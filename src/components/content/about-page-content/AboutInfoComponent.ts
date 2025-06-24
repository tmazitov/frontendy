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
                    elem("li").addChild("Timur Mazitov - Team Lead and Frontend Developer"),
                    elem("li").addChild("Valeria Lomakina - Backend Developer"),
                    elem("li").addChild("Sofia Abdulkina - Backend Developer and DevOps Engineer"),
                    elem("li").addChild("Dastan Abdygali - Game Developer"),
                    elem("li").addChild("Alban Medetbek - Game Developer"),
                ]),

                elem("h2")
                .setProps({ class : "text-xl font-bold mb-2" })
                .addChild(text("How to play?")),

                elem("p")
                .setProps({ class : "text-gray-700 text-base mb-4" })
                .addChild("The ping-pong game is a multiplayer game where players control paddles to hit a ball back and forth. The goal is to score points by getting the ball past the opponent's paddle."),

                elem("p")
                .setProps({ class : "text-gray-700 text-base mb-4" })
                .addChild("To start playing, you need to create an account and log in. Once logged in, you can create a game or join an existing one. The game will start automatically when both players are ready."),
                
                elem("p")
                .setProps({ class : "text-gray-700 text-base mb-4" })
                .setChild([
                    "To control your paddle, use the ",
                    elem("span").setProps({class: "text-blue-500 font-semibold"}).addChild("W"),
                    " and ",
                    elem("span").setProps({class: "text-blue-500 font-semibold"}).addChild("S"),
                    " keys to move it up and down. The game will end when one player reaches the score limit, which is set to 10 points by default."
                ]),
            ]);
    }
}