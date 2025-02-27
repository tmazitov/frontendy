// import Component from "pkg/internal/component/Component";
// import Counter from "./Counter";

// export default class InputField extends Component {
    
//     static name: string = 'input-field';
    
//     static components = [
//         Counter
//     ]

//     data() {
//         return {
//             value: ""
//         }
//     }

//     onMounted(){
//         this.shadowRoot!.querySelector("input")?.addEventListener("input", this.methods.update);
//     }
    
//     onUnmounted() {
//         this.shadowRoot!.querySelector("input")?.removeEventListener("input", this.methods.update);
//     }

//     methods = {
//         update: (e: Event) => {
//             console.log("this.state.value", this.state.value)
//             this.state.value = (e.target as HTMLInputElement).value;
//         },
//         length: () => {
//             return this.state.value.length;
//         }
//     }

//     template() {
//         return `
//             <style>
//                 input { padding: 10px; border: 1px solid #ccc; }
//             </style>
//             <input value="${this.state.value}">
//             <counter-button count="${this.methods.length()}"></counter-button>
//         `;
//     }
// }