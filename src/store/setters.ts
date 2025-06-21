import { Axios, AxiosError } from "axios";
import API from "../api/api";
import { isAuthorized } from "../api/client";
import GameStat from "../types/GameStat";
import { MatchResultInfo } from "../types/MatchResultInfo";
import { MatchSceneInfo } from "../types/MatchSceneInfo";
import PlayersInfo from "../types/PlayersInfo";
import RatingChangeItem from "../types/RatingChangeItem";
import User from "../types/User";
import StoreState from "./state";
import FriendInvite from "../types/FriendInvite";

export default class StoreSetters {

    private state: StoreState;

    constructor(state: StoreState) {
        this.state = state;
    }

    async updateUserNickname(nickname: string) {
        const user = await this.state.user.getValue()
        if (!user) {
            return ;
        }
        user.nickname = nickname;
        this.state.user.setValue(user)
    }

    deleteUser() {
        this.state.user.clearValue()
    }

    async updateMatchResult(result: MatchResultInfo) {
        const sceneInfo = await this.state.gameSceneInfo.getValue()
        if (!sceneInfo) {
            return ;
        }  
        sceneInfo.result = result;
        this.state.gameSceneInfo.setValue(sceneInfo);
        console.log("match updated result")
    }

    async setupUser() {
        if (!isAuthorized()) {
            return ;
        }
        try
        {
            const response = await API.ums.userGetInfo()
            console.log({response, data :response.data})
            if (!response) {
                throw new Error("no response");
            }
            if (!response.data) {
                throw new Error("no user data in response");
            }
            this.state.user.setValue(new User(response.data));
        } catch (e) {
            console.error("Store error: can't get user data :", e);
        }
    }

    async setupGameStats(page:number) {
        if (!isAuthorized()) {
            return ;
        }
        try {
            const response = await API.mmrs.userMatchStats(page)
            if (!response) {
                throw new Error("no response");
            }
            if (response.status == 204) {
                this.state.gameStats.setValue([]);
            } else if (response.status == 200) {

                if (!response.data || response.data instanceof Array === false) {
                    throw new Error("no game stats data in response");
                }

                console.log("StoreSetters: setupGameStats response:", response.data);
                const gameStats = response.data.map((stat: any) => new GameStat(stat));
                this.state.gameStats.setValue(gameStats);
            } else {
                throw new Error("unexpected response status: " + response.status);
            }
        } catch (e) {
            console.error("Store error: can't get game stats :", e);
        }
    }

    async setupRatingChanges() {
        if (!isAuthorized()) {
            return ;
        }
        try {
            this.state.user.getValue(async(user: User | undefined) => {
                if (!user) {
                    console.error("no user!")
                    return ;
                }
               
                try{
                    const response = await API.mmrs.userRatingUpdates(user.id)
                    if (!response || !response.data) {
                        throw new Error("no response or data in response");
                    }
                    const data = response.data as {playedMatches: number, updates: Array<{date: string, rate: number}>};
                    if (!data || !data.updates || !Array.isArray(data.updates)) {
                        throw new Error("no updates in response data");
                    }

                    const values = data.updates
                    .map((update: {date: string, rate: number}) => {
                        return {date: new Date(update.date), rate: update.rate};
                    })
                    .sort((a, b) => a.date.getTime() - b.date.getTime())

                    this.state.ratingChanges.setValue({
                        playedMatches: data.playedMatches,
                        updates: values,
                    });
                } catch (e) {
                    console.error("StoreSetters: setupRatingChanges: error getting rating updates :", e);
                    return ;
                }
            });
        } catch (e) {
            console.error("Store error: can't get game stats :", e);
        }
    }

    async setupGamePlayersInfo(player1State: {id:number, score:number}, player2State: {id:number, score:number}) {
        if (!player1State || !player2State) {
            console.error("StoreSetters: setupGamePlayersInfo: playersIds length is not 2");
            return ;
        }
        
        let player1: User | undefined = undefined;
        try {
            const response = await API.ums.userGetInfo(player1State.id)
            const data = response.data;
            if (!data) {
                throw new Error("no user data in response");
            }
            player1 = new User(data);
        } catch (e) {
            console.error("StoreSetters: setupGamePlayersInfo: error getting player 1 info : ", e);
        }

        let player2: User | undefined = undefined;
        try {
            const response = await API.ums.userGetInfo(player2State.id)
            const data = response.data;
            if (!data) {
                throw new Error("no user data in response");
            }
            player2 = new User(data);
        } catch (e) {
            console.error("StoreSetters: setupGamePlayersInfo: error getting player 2 info : ", e);
        }

        if (!player1 || !player2) {
            console.error("StoreSetters: setupGamePlayersInfo: one of players is undefined");
            return ;
        }

        const info = new PlayersInfo(player1, player2, player1State.score, player2State.score)
        
        this.state.gamePlayersInfo.setValue(info);
    }

    async setupMatchSceneInfo(info: MatchSceneInfo) {
        this.state.gameSceneInfo.setValue(info);
    }

    async updateMatchOpponentDisconnected(timeLeft: number) {

        const currentInfo = await this.state.gameSceneInfo.getValue();
        if (!currentInfo) {
            console.error("StoreSetters: updateMatchOpponentDisconnected: currentInfo is undefined");
            return ;
        }
        currentInfo.isReady = false;
        currentInfo.timeLeft = timeLeft;
        this.state.gameSceneInfo.setValue(currentInfo);
    }

    async updateMatchOpponentConnected() {
        const currentInfo = await this.state.gameSceneInfo.getValue();
        if (!currentInfo) {
            console.error("StoreSetters: updateMatchOpponentConnected: currentInfo is undefined");
            return ;
        }
        currentInfo.isReady = true;
        currentInfo.timeLeft = 0;
        this.state.gameSceneInfo.setValue(currentInfo);
    }

    async updateMatchScore(player1Score: number, player2Score: number) {
        const currentInfo = await this.state.gamePlayersInfo.getValue();
        if (!currentInfo) {
            console.error("StoreSetters: updateMatchScore: currentInfo is undefined");
            return ;
        }
        currentInfo.updateScore(player1Score, player2Score);
        this.state.gamePlayersInfo.setValue(currentInfo);
    }

    async setupFriends(){
        if (!isAuthorized()) {
            return ;
        }
        try {
            const response = await API.ums.friendList()
            if (!response) {
                throw new Error("no response or data in response");
            }

            const freinds = Array.from(response.data).map((friendData:any) => new User(friendData));
            console.log("StoreSetters: setupFriends response:", freinds);
            this.state.freinds.setValue(freinds);
        } catch (err) {
            console.error("StoreSetters: setupFriends: error getting friends list :", err);
            return ;
        }
    }

    async setupFriendsInvites() {
        if (!isAuthorized()) {
            return ;
        }
        try {
            const response = await API.ums.friendInviteList()
            if (!response) {
                throw new Error("no response or data in response");
            }

            const invites = Array.from(response.data).map((inviteData:any) => new FriendInvite(inviteData));
            this.state.friendsInvites.setValue(invites);
        } catch {
            console.error("StoreSetters: setupFriendsInvites: error getting friends invites list");
            return ;
        }
    }
    
    async sendFriendInvite(nickname: string) {
        if (!isAuthorized()) {
            return ;
        }
        try {
            const response = await API.ums.friendSendInvite(nickname);
            if (!response || response.status !== 201) {
                throw new Error("Failed to add friend: " + (response?.statusText || "Unknown error"));
            }

            this.setupFriendsInvites();
        } catch (err) {

            let errorMessage
            if (err instanceof AxiosError) {
                if (err.status == 400) {
                    errorMessage = "Invalid nickname."
                } else if (err.status == 404) {
                    errorMessage = "User not found."
                } else if (err.status == 409) {
                    errorMessage = "User already in friends list or invitation already exists."
                } else if (err.status == 500) { 
                    errorMessage = "Internal server error."
                }
            } else {
                errorMessage = "An unexpected error occurred while adding a friend.";
            }

            return errorMessage;
        }
    }

    async deleteFriendInvite(inviteId: number) {
        try {
            const respose = await API.ums.friendDeleteInvite(inviteId);
            if (!respose) {
                throw new Error("no response");
            }
            const currentInvites = await this.state.friendsInvites.getValue();
            if (!currentInvites) {
                return ;    
            }
            const newInvites = currentInvites.filter((invite: FriendInvite) => invite.id !== inviteId);
            this.state.friendsInvites.setValue(newInvites);
        } catch (e) {
            console.error("StoreSetters: deleteFriendInvite: error deleting invite:", e);
            return ;
        }
    }

    async acceptFriendInvite(inviteId: number) {
        try {
            const response = await API.ums.friendAcceptInvite(inviteId);
            if (!response || response.status !== 201) {
                throw new Error("Failed to accept friend invite: " + (response?.statusText || "Unknown error"));
            }
            const invites = await this.state.friendsInvites.getValue();
            if (!invites) {
                console.error("StoreSetters: acceptFriendInvite: invites is undefined");
                return ;
            }
            const newInvites = invites.filter((invite: FriendInvite) => invite.id !== inviteId);
            this.state.friendsInvites.setValue(newInvites);
            const friends = await this.state.freinds.getValue();
            if (friends === undefined) {
                console.error("StoreSetters: acceptFriendInvite: friends is undefined");
                return ;
            }
            const newFriend = [...friends, new User(response.data.senderUserBaseInfo)];
            this.state.freinds.setValue(newFriend);
        } catch (err) {
            console.error("StoreSetters: acceptFriendInvite: error accepting invite:", err);
            return ;
        }
    }

    async rejectFriendInvite(inviteId: number) {
        try {
            const response = await API.ums.friendRejectInvite(inviteId);
            if (!response || response.status !== 200) {
                throw new Error("Failed to accept friend invite: " + (response?.statusText || "Unknown error"));
            }
            const invites = await this.state.friendsInvites.getValue();
            if (!invites) {
                console.error("StoreSetters: acceptFriendInvite: invites is undefined");
                return ;
            }
            const newInvites = invites.filter((invite: FriendInvite) => invite.id !== inviteId);
            this.state.friendsInvites.setValue(newInvites);
        } catch (err) {
            console.error("StoreSetters: acceptFriendInvite: error accepting invite:", err);
            return ;
        }
    }

    async deleteFriend(userId: number) {
        try {
            const response = await API.ums.friendDelete(userId);
            if (!response || response.status !== 200) {
                throw new Error("Failed to delete friend: " + (response?.statusText || "Unknown error"));
            }
            const friends = await this.state.freinds.getValue();
            if (friends === undefined) {
                console.error("StoreSetters: deleteFriend: friends is undefined");
                return ;
            }
            const newFriends = friends.filter((friend: User) => friend.id !== userId);
            console.log("StoreSetters: deleteFriend: newFriends:", newFriends);
            this.state.freinds.setValue(newFriends);
        } catch (err) {
            console.error("StoreSetters: deleteFriend: error deleting friend:", err);
            return ;
        }
    }

    async removeGameSceneInfo() {
        this.state.gameSceneInfo.clearValue();
    }

    async removeGamePlayersInfo() {
        this.state.gamePlayersInfo.clearValue();
    }


}

