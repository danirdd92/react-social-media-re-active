import { makeAutoObservable, runInAction } from 'mobx';
import { history } from '../../main';
import agent from '../api';
import { User, UserFormValues } from '../models/user';
import { store } from './store';

export default class UserStore {
	user: User | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	get isLoggedIn() {
		return !!this.user;
	}

	login = async (creds: UserFormValues) => {
		try {
			const user = await agent.account.login(creds);
			store.commonStore.setToken(user.token);
			runInAction(() => (this.user = user));
			history.push('/activities');
			store.modalStore.closeModal();
		} catch (error) {
			throw error;
		}
	};

	logout = () => {
		store.commonStore.setToken(null);
		localStorage.removeItem('jwt');
		this.user = null;
		history.push('/');
	};
	getUser = async () => {
		try {
			const user = await agent.account.current();
			runInAction(() => (this.user = user));
		} catch (error) {
			console.error(error);
		}
	};

	register = async (creds: UserFormValues) => {
		try {
			const user = await agent.account.register(creds);
			store.commonStore.setToken(user.token);
			runInAction(() => (this.user = user));
			history.push('/activities');
			store.modalStore.closeModal();
		} catch (error) {
			throw error;
		}
	};
}
