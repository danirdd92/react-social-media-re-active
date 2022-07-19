import { format } from 'date-fns';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api';
import { Activity, ActivityFormValues } from '../models/activity';
import { Profile } from '../models/profile';
import { store } from './store';

type ActivityMap = {
	[key: string]: Activity[];
};

export default class ActivityStore {
	activityRegistry = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = false;
	loadingInitial = false;

	constructor() {
		makeAutoObservable(this);
	}

	get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
	}

	get groupedActivities() {
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				const date = format(activity.date!, 'dd MMM yyyy');

				activities[date] = activities[date] ? [...activities[date], activity] : [activity];

				return activities;
			}, {} as ActivityMap)
		);
	}

	loadActivities = async () => {
		this.loadingInitial = true;
		try {
			const activities = await agent.activities.list();

			for (const activity of activities) {
				this.setActivity(activity);
			}

			this.setLoadingInitial(false);
		} catch (error) {
			console.error(error);
			this.setLoadingInitial(false);
		}
	};

	loadActivity = async (id: string) => {
		let activity = this.getActivity(id);

		if (activity) {
			this.selectedActivity = activity;
			return activity;
		}

		this.loadingInitial = true;
		try {
			activity = await agent.activities.details(id);
			this.setActivity(activity);
			runInAction(() => {
				this.selectedActivity = activity;
			});
			this.setLoadingInitial(false);
			return activity;
		} catch (error) {
			console.error(error);
			this.setLoadingInitial(false);
		}
	};

	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	};

	createActivity = async (activity: ActivityFormValues) => {
		const user = store.userStore.user;
		const attendee = new Profile(user!);

		try {
			await agent.activities.create(activity);
			const newActivity = new Activity(activity);
			newActivity.hostUserName = user!.userName;
			newActivity.attendees = [attendee];
			this.setActivity(newActivity);
			runInAction(() => {
				this.selectedActivity = newActivity;
			});
		} catch (error) {
			console.error(error);
		}
	};

	updateActivity = async (activity: ActivityFormValues) => {
		try {
			await agent.activities.update(activity);
			runInAction(() => {
				if (activity.id) {
					let updatedActivity = { ...this.getActivity(activity.id), ...activity };
					this.activityRegistry.set(activity.id, updatedActivity as Activity);
					this.selectedActivity = updatedActivity as Activity;
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	deleteActivity = async (id: string) => {
		this.loading = true;

		try {
			await agent.activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
				this.loading = false;
			});
		} catch (error) {
			console.error(error);
			runInAction(() => {
				this.loading = false;
			});
		}
	};

	updateAttendance = async () => {
		const user = store.userStore.user;
		this.loading = true;
		try {
			await agent.activities.attend(this.selectedActivity!.id);
			runInAction(() => {
				if (this.selectedActivity?.isGoing) {
					this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
						(a) => a.userName !== user?.userName
					);
					this.selectedActivity.isGoing = false;
				} else {
					const attendee = new Profile(user!);
					this.selectedActivity?.attendees?.push(attendee);
					this.selectedActivity!.isGoing = true;
				}

				this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
			});
		} catch (error) {
			console.error(error);
		} finally {
			runInAction(() => (this.loading = false));
		}
	};

	cancelActivityToggle = async () => {
		this.loading = true;
		try {
			await agent.activities.attend(this.selectedActivity!.id);
			runInAction(() => {
				this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
				this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
			});
		} catch (error) {
			console.error(error);
		} finally {
			runInAction(() => (this.loading = false));
		}
	};

	clearSelectedActivity = () => {
		this.selectedActivity = undefined;
	};

	private getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	};

	private setActivity = (activity: Activity) => {
		const user = store.userStore.user;
		if (user) {
			activity.isGoing = activity.attendees!.some((a) => a.userName === user.userName);
			activity.isHost = activity.hostUserName === user.userName;
			activity.host = activity.attendees?.find((x) => x.userName === activity.hostUserName);
		}
		activity.date = new Date(activity.date!);
		this.activityRegistry.set(activity.id, activity);
	};
}
