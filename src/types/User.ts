export default class User {
    id: number;
    nickname: string;
    rating: number;
    
    constructor(data: any) {
        this.id = data.id;
        this.nickname = data.nickname;
        this.rating = data.rating;
    }
}