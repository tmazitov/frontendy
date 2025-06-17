export default class FriendInvite{
    public id: number;
    public userId: number;
    public authorId: number;
    public nickname: string;

    constructor(data:any) {
        this.id = data.id || data.recordId;
        this.userId = data.userId;
        this.authorId = data.authorId || data.senderId;
        this.nickname = data.nickname;
    }
}