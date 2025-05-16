export default class User {
    id: number;
    nickname: string;
    rating: number;
    avatarUrl: string | null = null;
    
    constructor(data: any) {
        this.id = data.id;
        this.nickname = data.nickname;
        this.rating = data.rating;
        this.avatarUrl = data.avatar_path || null;
    }
}