// import Component from "../../pkg/internal/component/Component";

// export default class Counter extends Component {
    
//     static name: string = 'counter-button';
    

//     data() {
//         return {
//             count: this.getAttribute("count") ?? 0,
//         }
//     }


//     // onMounted(){
//     //     this.shadowRoot!.querySelector("button")?.addEventListener("click", this.methods.increment);
//     // }
    
//     // onUnmounted() {
//     //     this.shadowRoot!.querySelector("button")?.removeEventListener("click", this.methods.increment);
//     // }

//     // methods = {
//     //     increment: () => {
//     //         console.log("Incrementing");
//     //         this.set("count", this.get("count") + 1);
//     //     }
//     // }


//     template() {
//         return `
//             <style>
//                 button { background: blue; color: white; padding: 10px; border: none; }
//             </style>
//             <div>${this.state.count}</div>
//         `;
//     }
// }