import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

type Obj = {
	[key: string]: any;
};

//simulate http request from far
const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async (response) => {
	try {
		await sleep(1000);
		return response;
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody),
	post: <T>(url: string, body: Obj) => axios.post<T>(url, body).then(responseBody),
	put: <T>(url: string, body: Obj) => axios.put<T>(url, body).then(responseBody),
	remove: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};
const activities = {
	list: () => requests.get<Activity[]>('/activities'),
	details: (id: string) => requests.get<Activity>(`/activities/${id}`),
	create: (activity: Activity) => requests.post('/activities', activity),
	update: (activity: Activity) => requests.put(`/activities/${activity.id}`, activity),
	delete: (id: string) => requests.remove(`/activities/${id}`),
};

const agent = {
	activities,
};

export default agent;
