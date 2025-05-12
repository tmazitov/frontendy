import axios from "axios";
import type { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";
import type {TokenPair} from "./tokenPair";
import router from "../pages/router";

function cacheTokens(tokenPair:TokenPair){
	localStorage.setItem('access-token', tokenPair.accessToken)
	localStorage.setItem('refresh-token', tokenPair.refreshToken)
}

function removeTokens() {
	localStorage.removeItem('access-token')
	localStorage.removeItem('refresh-token')
}

function getTokens():TokenPair {
	return {
		accessToken: localStorage.getItem('access-token') || '', 
		refreshToken: localStorage.getItem('refresh-token') || '',
	}
}

function isAuthorized() {
	const tokens = getTokens()
	return !!tokens.accessToken && !!tokens.refreshToken
}

class AxiosClient {
	private axiosInstance;
	
	static isRefreshing = false;
	static requestQueue: Array<(token: string) => void> = [];
  
	constructor(baseUrl:string) {
		this.axiosInstance  = axios.create({
			baseURL: baseUrl,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		})
		// Перехватчик для всех запросов
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
	
		// Перехватчик для всех ответов
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

				// Если процесс обновления токенов уже идет, добавляем запрос в очередь
				if (AxiosClient.isRefreshing) {
					return new Promise((resolve, reject) => {
						AxiosClient.requestQueue.push((token: string) => {
							originalRequest.headers['Authorization'] = `${token}`;
							this.axiosInstance(originalRequest).then(resolve).catch(reject);
						});
					});
				}

				// Начинаем процесс обновления токенов
				AxiosClient.isRefreshing = true;

				try {
					const newTokens = await this.refreshTokens();

					// Выполняем все запросы из очереди с новым токеном
					AxiosClient.requestQueue.forEach((callback) => callback(newTokens.accessToken));
					AxiosClient.requestQueue = [];

					// Возвращаем исходный запрос с новым токеном
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
  
	// Функция для обновления токенов
	private async refreshTokens(): Promise<TokenPair> {
		// Сделайте запрос на обновление токенов здесь (замените на реальный эндпоинт)


		const response = await this.refresh();
	
		return response.data as TokenPair;
	}
  
	// Функция для выполнения запросов через клиент
	public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
		try {
			return await this.axiosInstance(config);
		} catch (error: any) {
			// AxiosClient.toast?.add({
			// 	severity: "error",
			// 	summary: "Ошибка соединения",
			// 	detail: "Сервер не отвечает. Попробуйте позже.",
			// });
			return Promise.reject(error);
		}
	}

	private async refresh(): Promise<AxiosResponse> {
		// const authServicePrefix = import.meta.env["VITE_AUTH_PREFIX"]
		const tokens = getTokens()
		console.log('old tokens :>> ', tokens);

		try {
			const response = await axios.request({
				method: "POST",
				url: "/token/refresh",
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Authorization': `${tokens.accessToken}`
				},
				data: {
					"refreshToken" : tokens.refreshToken 
				}
			})
			if (response && response.data) {
				cacheTokens(response.data)
			}
			console.log('new tokens :>> ', response.data);
			return response
		} catch (error: any) {
			if (error.response && error.response.status == 401) {
				router.push('auth');
			}
			return error.response
		}
	}
}
  
export default AxiosClient;

export {
	isAuthorized,
	cacheTokens,
	removeTokens,
}