import axios, { AxiosInstance } from "axios";
import SignUpForm from "../types/forms/registrationForm";
import SignInForm from "../types/forms/signInForm";
import AxiosClient, { cacheTokens, removeTokens } from "./client";
import { TokenPair } from "./tokenPair";

export default class UMS {
	private client: AxiosClient
    private instance: AxiosInstance
	constructor(baseUrl: string) {
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

        cacheTokens(response.data as TokenPair);

        return response;
    }

    public async signUp(form:SignUpForm) {
        const response = await this.instance.request({
            method: "POST",
            url: "/registration",
            data: form.toSubmit(),
        });

        cacheTokens(response.data as TokenPair);
        
        return response;
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
}