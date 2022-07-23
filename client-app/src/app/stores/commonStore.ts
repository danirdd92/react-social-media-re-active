import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api';
import { BaseAsset } from '../models/baseAsset';
import { Category } from '../models/category';
import { ServerError } from '../models/serverError';

export default class CommonStore {
	error: ServerError | null = null;
	token: string | null = localStorage.getItem('jwt');
	appLoaded = false;
	assetImages = new Map<BaseAsset, string>();
	categoryImages = new Map<Category, string>();

	constructor() {
		makeAutoObservable(this);

		reaction(
			() => this.token,
			(token) => {
				if (token) {
					localStorage.setItem('jwt', token);
				} else {
					localStorage.removeItem('jwt');
				}
			}
		);
	}

	getInitialAssets = async () => {
		if (!localStorage.getItem('categories')) {
			const assetImages = await agent.common.getAssetImages();
			const categoryImages = await agent.common.getCategoryImages();
			runInAction(() => {
				assetImages.resources.forEach((image: { url: string }) => {
					const _key = image.url.split('/').at(-1);
					if (_key!.includes('user')) this.assetImages.set('user', image.url);
					else if (_key!.includes('logo')) this.assetImages.set('logo', image.url);
				});

				categoryImages.resources.forEach((image: { url: string }) => {
					const _key = image.url.split('/').at(-1);

					if (_key!.includes('drinks')) this.categoryImages.set('drinks', image.url);
					else if (_key!.includes('culture')) this.categoryImages.set('culture', image.url);
					else if (_key!.includes('film')) this.categoryImages.set('film', image.url);
					else if (_key!.includes('food')) this.categoryImages.set('food', image.url);
					else if (_key!.includes('music')) this.categoryImages.set('music', image.url);
					else if (_key!.includes('travel')) this.categoryImages.set('travel', image.url);

					localStorage.setItem('assets', JSON.stringify(this.assetImages));
					localStorage.setItem('categories', JSON.stringify(this.categoryImages));
				});
			});
		} else {
			const assetsArray = JSON.parse(localStorage.getItem('assets')!);
			const categoriesArray = JSON.parse(localStorage.getItem('categories')!);
			this.categoryImages = new Map(categoriesArray);
			this.assetImages = new Map(assetsArray);
		}
	};

	setServerError = (error: ServerError) => {
		this.error = error;
	};

	setToken = (token: string | null) => {
		this.token = token;
	};

	setAppLoaded = () => {
		this.appLoaded = true;
	};
}
