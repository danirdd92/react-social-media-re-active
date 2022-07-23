import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../../main';
import { Activity, ActivityFormValues } from '../models/activity';
import { PaginatedResult } from '../models/pagination';
import { Photo, Profile, UserActivity } from '../models/profile';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';

type Obj = {
	[key: string]: any;
};

export type Predicate = 'following' | 'followers';
//simulate http request from far
const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
	const token = store.commonStore.token;

	if (token) config.headers!.Authorization = `Bearer ${token}`;
	return config;
});

axios.interceptors.response.use(
	async (response) => {
		const pagination = response.headers['pagination'];
		if (pagination) {
			response.data = new PaginatedResult(response.data, JSON.parse(pagination));
			return response as AxiosResponse<PaginatedResult<any>>;
		}
		return response;
	},
	(error: AxiosError) => {
		const { data: d, status, config } = error.response!;
		// workaround for type unknown from AxiosError
		const data: any = d;
		switch (status) {
			case 400:
				if (typeof data === 'string') {
					toast.error(data);
				}

				if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
					history.push('/not-found');
				}
				if (data.errors) {
					const modalStateErrors = [];
					for (const key in data.errors) {
						if (data.errors[key]) {
							modalStateErrors.push(data.errors[key]);
						}
					}
					throw modalStateErrors.flat();
				}
				break;
			case 401:
				toast.error('Unauthorized');
				break;
			case 404:
				history.push('/not-found');
				break;
			case 500:
				store.commonStore.setServerError(data);
				history.push('/server-error');
				break;
		}
		return Promise.reject(error);
	}
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody),
	post: <T>(url: string, body: Obj) => axios.post<T>(url, body).then(responseBody),
	put: <T>(url: string, body: Obj) => axios.put<T>(url, body).then(responseBody),
	remove: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};
const activities = {
	list: (params: URLSearchParams) =>
		axios
			.get<PaginatedResult<Activity[]>>('/activities', {
				params,
			})
			.then(responseBody),
	details: (id: string) => requests.get<Activity>(`/activities/${id}`),
	create: (activity: ActivityFormValues) => requests.post('/activities', activity),
	update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
	delete: (id: string) => requests.remove(`/activities/${id}`),
	attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const account = {
	current: () => requests.get<User>('/account'),
	login: (user: UserFormValues) => requests.post<User>('/account/login', user),
	register: (user: UserFormValues) => requests.post<User>('/account/register', user),
};

const profiles = {
	get: (userName: string) => requests.get<Profile>(`/profiles/${userName}`),
	uploadPhoto: (file: Blob) => {
		const formData = new FormData();
		formData.append('File', file);
		return axios.post<Photo>('photos', formData, {
			headers: { 'Content-type': 'multipart/form-data' },
		});
	},
	setMainPhoto: (photoId: string) => requests.post(`/photos/${photoId}`, {}),
	deletePhoto: (photoId: string) => requests.remove(`/photos/${photoId}`),
	updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
	updateFollowing: (userName: string) => requests.post(`/follow/${userName}`, {}),
	listFollowings: (userName: string, predicate: Predicate) =>
		requests.get<Profile[]>(`/follow/${userName}?predicate=${predicate}`),
	listActivities: (userName: string, predicate: string) =>
		requests.get<UserActivity[]>(`/profiles/${userName}/activities?predicate=${predicate}`),
};

const common = {
	getCategoryImages: () => requests.get<any>('/photos/category'),
	getAssetImages: () => requests.get<any>('/photos/asset'),
};

const agent = {
	activities,
	account,
	profiles,
	common,
};

export default agent;
