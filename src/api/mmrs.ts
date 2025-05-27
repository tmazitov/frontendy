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
}