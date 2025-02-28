class VText {
    public value:string = '';

    constructor(value:any) {
        this.value = `${value}`;
    }

    print(level:number=0){
        console.log(`${"-".repeat(level)}> ${this.value}`)
    }
}

export default VText;