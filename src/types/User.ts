export default class User {
    id: number;
    nickname: string;
    rating: number;
    avatarUrl: string | null = null;
    isOnline: boolean; // 0 - Offline, 1 - Online

    constructor(data: any) {
        this.id = data.id;
        this.nickname = data.nickname;
        this.rating = data.rating;
        this.avatarUrl = data.avatar || null;
        this.isOnline = data.isOnline ?? data.is_online ?? false; // Default status to 0 (Offline) if not provided
    }
}