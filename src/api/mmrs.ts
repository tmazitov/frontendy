import AxiosClient from "./client"

export default class MMRS {
	private client: AxiosClient
	constructor(baseUrl: string) {
		this.client = new AxiosClient(baseUrl)
    }

    public async userMatchStats() {
        const response = await this.client.request({
            method: "GET",
            url: "/stats",
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
}