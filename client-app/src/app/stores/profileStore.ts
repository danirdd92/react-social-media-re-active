import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent, { Predicate } from '../api';
import { Photo, Profile } from '../models/profile';
import { store } from './store';

export default class ProfileStore {
	profile: Profile | null = null;
	loadingProfile = false;
	uploading = false;
	loading = false;
	activeTab = 0;

	followings: Profile[] = [];
	loadingFollowings = false;

	constructor() {
		makeAutoObservable(this);

		reaction(
			() => this.activeTab,
			(activeTab) => {
				if (activeTab === 3 || activeTab === 4) {
					const predicate = activeTab === 3 ? 'followers' : 'following';
					this.loadFollowings(predicate);
				} else {
					this.followings = [];
				}
			}
		);
	}

	get isCurrentUser() {
		if (store.userStore.user && this.profile) return store.userStore.user.userName === this.profile.userName;

		return false;
	}

	loadProfile = async (userName: string) => {
		this.loadingProfile = true;
		try {
			const profile = await agent.profiles.get(userName);
			runInAction(() => {
				this.profile = profile;
				this.loadingProfile = false;
			});
		} catch (error) {
			console.error(error);
			runInAction(() => (this.loadingProfile = false));
		}
	};

	setActiveTab = (activeTab: any) => {
		this.activeTab = activeTab;
	};

	uploadPhoto = async (file: Blob) => {
		this.uploading = true;

		try {
			const response = await agent.profiles.uploadPhoto(file);
			const photo = response.data;
			runInAction(() => {
				if (this.profile) {
					this.profile.photos?.push(photo);

					if (photo.isMain && store.userStore.user) {
						store.userStore.setImage(photo.url);
						this.profile.image = photo.url;
					}
				}
				this.uploading = false;
			});
		} catch (error) {
			console.error(error);
			runInAction(() => (this.uploading = false));
		}
	};

	setMainPhoto = async (photo: Photo) => {
		this.loading = true;
		try {
			await agent.profiles.setMainPhoto(photo.id);
			store.userStore.setImage(photo.url);
			runInAction(() => {
				if (this.profile && this.profile.photos) {
					this.profile.photos.find((p) => p.isMain)!.isMain = false;
					this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
					this.profile.image = photo.url;
					this.loading = false;
				}
			});
		} catch (error) {
			runInAction(() => (this.loading = false));
			console.log(error);
		}
	};

	deletePhoto = async (photo: Photo) => {
		this.loading = true;
		try {
			await agent.profiles.deletePhoto(photo.id);
			runInAction(() => {
				if (this.profile) {
					this.profile.photos = this.profile.photos?.filter((p) => p.id !== photo.id);
					this.loading = false;
				}
			});
		} catch (error) {
			console.error(error);
			runInAction(() => (this.loading = false));
		}
	};

	updateProfile = async (profile: Partial<Profile>) => {
		this.loading = true;
		try {
			await agent.profiles.updateProfile(profile);
			runInAction(() => {
				if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
					store.userStore.setDisplayName(profile.displayName);
				}
				this.profile = { ...this.profile, ...(profile as Profile) };
				this.loading = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => (this.loading = false));
		}
	};

	updateFollowing = async (userName: string, willFollow: boolean) => {
		this.loading = true;
		try {
			await agent.profiles.updateFollowing(userName);
			store.activityStore.updateAttendeeFollowing(userName);
			runInAction(() => {
				if (
					this.profile &&
					this.profile.userName !== store.userStore.user?.userName &&
					this.profile.userName === userName
				) {
					willFollow ? this.profile.followersCount++ : this.profile.followersCount--;
					this.profile.following = !this.profile.following;
				}

				if (this.profile && this.profile.userName === store.userStore.user?.userName) {
					willFollow ? this.profile.followingCount++ : this.profile.followingCount--;
				}
				this.followings.forEach((profile) => {
					if (profile.userName === userName) {
						profile.following ? profile.followersCount-- : profile.followersCount++;
						profile.following = !profile.following;
					}
				});
				this.loading = false;
			});
		} catch (error) {
			console.error(error);
			runInAction(() => (this.loading = false));
		}
	};

	loadFollowings = async (predicate: Predicate) => {
		this.loadingFollowings = true;
		try {
			const followings = await agent.profiles.listFollowings(this.profile!.userName, predicate);
			runInAction(() => {
				this.followings = followings;
				this.loadingFollowings = false;
			});
		} catch (error) {
			console.error(error);
			runInAction(() => (this.loadingFollowings = false));
		}
	};
}
