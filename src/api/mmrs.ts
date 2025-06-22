import AxiosClient from "./client"

export default class MMRS {
	private client: AxiosClient
	constructor(baseUrl: string) {
		this.client = new AxiosClient(baseUrl)
    }

    public async userMatchStats(page:number, userId?: number) {
        
        if (userId) {
            const response = await this.client.request({
                method: "GET",
                url: `/stats/${userId}?p=${page}`,
            });

            return response;
        }

        const response = await this.client.request({
            method: "GET",
            url: `/stats?p=${page}`,
        });

        return response;
    }

    public async userRatingUpdates(userId: number) {
        const response = await this.client.request({
            method: "GET",
            url: `/rating/updates/${userId}`,
        });

        return response;
    }

    public async userReconnect() {
        const response = await this.client.request({
            method: "GET",
            url: `/reconnect`,
        });
        
        return response;
    }
}