import axios from "axios";
import type { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";
import type {TokenPair} from "./tokenPair";
import router from "../pages/router";
import EventBroker from "../pkg/event-broker/eventBroker";
import API from "./api";
import Config from "../config";

function cacheTokens(tokenPair:TokenPair){
	localStorage.setItem('access-token', tokenPair.accessToken)
	localStorage.setItem('refresh-token', tokenPair.refreshToken)
	localStorage.setItem('last-update', new Date().toISOString())
}

function removeTokens() {
	localStorage.removeItem('access-token')
	localStorage.removeItem('refresh-token')
	localStorage.removeItem('last-update')
}

function getTokens():TokenPair {
	return {
		accessToken: localStorage.getItem('access-token') || '', 
		refreshToken: localStorage.getItem('refresh-token') || '',
		lastUpdate: new Date(localStorage.getItem('last-update') || ''),
	}
}

function isAuthorized() {
	const tokens = getTokens()
	return !!tokens.accessToken && !!tokens.refreshToken
}


class AxiosClient {
	private axiosInstance;
	
	
	static requestQueue: Array<(token: string) => void> = [];
	static isRefreshing: boolean = false;

	constructor(baseUrl:string) {
		this.axiosInstance  = axios.create({
			baseURL: baseUrl,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		})
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const controller = new AbortController();
				const tokens = getTokens()
				if (!tokens.accessToken) {
					controller.abort();
					router.push('home');
				}

				if (tokens.accessToken && config.headers) {
					config.headers['Authorization'] = tokens.accessToken;
				}

				return {
					...config,
					signal: controller.signal
				};
			},
			(error) => Promise.reject(error)
		);
	
		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error) => {
			const originalRequest = error.config;
			const tokens = getTokens()
			if (error.response 
				&& error.response.status === 401 
				&& tokens.accessToken
				&& !originalRequest._retry) {
				originalRequest._retry = true;

				if (AxiosClient.isRefreshing === true) {
					return new Promise((resolve, reject) => {
						AxiosClient.requestQueue.push((token: string) => {
							originalRequest.headers['Authorization'] = `${token}`;
							this.axiosInstance(originalRequest).then(resolve).catch(reject);
						});
					});
				}

				if (tokens.accessToken != originalRequest.headers['Authorization']) {
					originalRequest.headers['Authorization'] = tokens.accessToken;
					return this.axiosInstance(originalRequest);
				}

				AxiosClient.isRefreshing = true;

				try {
					const newTokens = await this.refreshTokens();

					AxiosClient.requestQueue.forEach((callback) => callback(newTokens.accessToken));
					AxiosClient.requestQueue = [];

					originalRequest.headers['Authorization'] = newTokens.accessToken;
					return this.axiosInstance(originalRequest);
				} catch (refreshError) {
					return Promise.reject(refreshError);
				} finally {
					AxiosClient.isRefreshing = false;
				}
			}

			return Promise.reject(error);
			}
		);
	}

	public addRefreshQueueItem(callback: (token: string) => void): boolean {
		if (AxiosClient.isRefreshing === false) {
			return false;
		}
		AxiosClient.requestQueue.push(callback);
		return true;
	}
  
	private async refreshTokens(): Promise<TokenPair> {


		const response = await this.refresh();
	
		return response.data as TokenPair;
	}
  
	public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
		try {
			return await this.axiosInstance(config);
		} catch (error: any) {
			return Promise.reject(error);
		}
	}


	public async getFreshAccessToken(): Promise<string> {
		if (AxiosClient.isRefreshing) {
			return new Promise<string>((resolve, reject) => {
				this.addRefreshQueueItem((token: string) => {
					if (token) {
						resolve(token);
					} else {
						reject(new Error("Access-token refresh failed"));
					}
				});
			});
		}

		const now = new Date()
		const lastUpdate = getTokens().lastUpdate;
		if (now.getTime() - lastUpdate.getTime() < 1000 * 5) {
			const tokens = getTokens();
			return tokens.accessToken;
		}
	
		AxiosClient.isRefreshing = true;
		try {
			const newPair = await this.refreshTokens();           // = { accessToken, refreshToken }
			AxiosClient.requestQueue.forEach(cb => cb(newPair.accessToken));
			AxiosClient.requestQueue = [];                       
			return newPair.accessToken;
		} catch (err) {
			AxiosClient.requestQueue.forEach(cb => cb(''));
			AxiosClient.requestQueue = [];
			throw err;
		} finally {
			AxiosClient.isRefreshing = false;                    
		}
	}
	

	public async refresh(): Promise<AxiosResponse> {
		const tokens = getTokens()
		try {
			const protocol = Config.secure ? 'https' : 'http';

			const response = await axios.request({
				method: "POST",
				url: `${protocol}://${Config.umsAddr}/api/rest/refresh`,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				data: {
					"refreshToken" : tokens.refreshToken 
				}
			})
			if (response && response.data) {
				cacheTokens(response.data)
			}
			return response
		} catch (error: any) {
			if (error.response && error.response.status == 401) {
				setTimeout(async () => {

					removeTokens()

					router.push("home")
					EventBroker.getInstance().emit("update-auth");
				})
			}
			return error.response
		}
	}
}
  
export default AxiosClient;

export {
	isAuthorized,
	cacheTokens,
	getTokens,
	removeTokens,
}