import axios, { AxiosInstance } from "axios";
import SignUpForm from "../types/forms/registrationForm";
import SignInForm from "../types/forms/signInForm";
import AxiosClient, { cacheTokens, getTokens, removeTokens } from "./client";
import { TokenPair } from "./tokenPair";
import { GoogleOAuthPayload } from "./oauth/google";
import PasswordUpdateForm from "../types/forms/updatePasswordForm";
import router from "../pages/router";
import EventBroker from "../pkg/event-broker/eventBroker";
import { resolve } from "path";
import Store from "../store/store";
import API from "./api";

export default class UMS {
	private client: AxiosClient
    private instance: AxiosInstance
    private baseUrl: string;
	constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
		this.client = new AxiosClient(baseUrl)
        this.instance = axios.create({
			baseURL: baseUrl,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		})
    }


    public async signIn(form:SignInForm) {
        const response = await this.instance.request({
            method: "POST",
            url: "/login",
            data: form.toSubmit(),
        })

        return response;
    }

    public async signUp(form:SignUpForm) {
        const response = await this.instance.request({
            method: "POST",
            url: "/registration",
            data: form.toSubmit(),
        });
        return response;
    }

    public async loginWithGoogle(data:GoogleOAuthPayload) {
        const response = await this.instance.request({
            method: "POST",
            url: "/google/login",
            data: data,
        })
        return response;
    }

    public async veryfyOtpCode(code:string, key:string) {
        const response = await this.instance.request({
            method: "POST",
            url: "/verify_otp",
            data: {
                otp: code,
                uuid: key,
            }
        })
        cacheTokens(response.data as TokenPair);
        return response;
    }

    public async refresh() {
        return this.client.getFreshAccessToken();
    }
 
    public async signOut() {
        // let response
        // try {
        //     response = await this.instance.request({
        //         method: "POST",
        //         url: "/logout",
        //     });
        // } catch (error) {
        //     console.error("Error during sign out:", error);
        //     return response;
        // }

        removeTokens()

        return null;
    }

    public async userDelete() {

        try {
            const response = await API.mmrs.userReconnect()
            if (response.status === 200) {
                return false;
            }
        } catch (error) {
                        
        }

        const refreshToken = getTokens().refreshToken

        return await this.client.request({
            method: "DELETE",
            url: "/user",
            data: {
                refreshToken,
            }
        })
    }

    public async userGetInfo(id?:number) {
        
        if (id !== undefined) {
            return await this.client.request({
                method: "GET",
                url: `/user/${id}`,
            })
        }

        return await this.client.request({
            method: "GET",
            url: "/user",
        })
    }

    public async userUpdateAvatar(file:File){
        if (file.size > 2 * 1024 * 1024) {
            alert('File too large! Max 2MB');
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        return await this.client.request({
            method: "POST",
            url: "/user/avatar",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    public async userUpdatePassword(form: PasswordUpdateForm) {
        return await this.client.request({
            method: "PATCH",
            url: "/user/password",
            data: form.toSubmit(),
        })
    }

    public async userUpdateNickname(nickname: string) {
        return await this.client.request({
            method: "PATCH",
            url: "/user/nickname",
            data: {
                nickname,
            }
        })
    }

    public async leaderboard() {
        return await this.instance.request({
            method: "GET",
            url: "/rating/leader",
        })
    }

    private defaultAvatarUrl(): string {
        const baseURL = `${this.baseUrl}`.replace("api/rest", "")
        return `${baseURL}public/avatars/default.png`
    }
    private avatarWrapper(avatarPath:string):string {
        const baseURL = `${this.baseUrl}`.replace("api/rest", "")
        return `${baseURL}public/${avatarPath}`
    }

    public appropriateAvatar(avatarPath: string | null ) {
        if (!avatarPath) {
            return this.defaultAvatarUrl();
        }
        if (avatarPath.startsWith("http")) {
            return avatarPath;
        }
        return this.avatarWrapper(avatarPath);
    }

    public async friendList() {
        return await this.client.request({
            method: "GET",
            url: "/friends",
        });
    }

    public async friendInviteList(){
        return await this.client.request({
            method: "GET",
            url: "/friends/invite",
        });
    }

    public async friendSendInvite(nickname: string) {
        return await this.client.request({
            method: "POST",
            url: "/friends/invite",
            data: {
                nickname: nickname,
            }
        })
    }

    public async friendDeleteInvite(id: number) {
        return await this.client.request({
            method: "DELETE",
            url: `/friends/invite/${id}`,
        })  
    }

    public async friendAcceptInvite(id: number) {
        return await this.client.request({
            method: "PATCH",
            url: `/friends/invite/${id}/accept`,
        })  
    }
    public async friendRejectInvite(id: number) {
        return await this.client.request({
            method: "PATCH",
            url: `/friends/invite/${id}/reject`,
        })
    }

    public async friendDelete(userId: number) {
        return await this.client.request({
            method: "DELETE",
            url: `/friends/${userId}`,
        })
    }
}   