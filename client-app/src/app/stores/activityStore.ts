import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api';
import { Activity } from '../models/activity';

type ActivityMap = {
	[key: string]: Activity[];
};
export default class ActivityStore {
	activityRegistry = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = false;
	loadingInitial = true;

	constructor() {
		makeAutoObservable(this);
	}

	get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort(
			(a, b) => Date.parse(a.date) - Date.parse(b.date)
		);
	}

	get groupedActivities() {
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				const { date } = activity;

				activities[date] = activities[date]
					? [...activities[date], activity]
					: [activity];

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

	createActivity = async (activity: Activity) => {
		this.loading = true;
		try {
			await agent.activities.create(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
				this.loading = false;
			});
		} catch (error) {
			console.error(error);
			runInAction(() => {
				this.loading = false;
			});
		}
	};

	updateActivity = async (activity: Activity) => {
		this.loading = true;

		try {
			await agent.activities.update(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
				this.loading = false;
			});
		} catch (error) {
			console.error(error);
			runInAction(() => {
				this.loading = false;
			});
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

	private getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	};

	private setActivity = (activity: Activity) => {
		activity.date = activity.date.split('T')[0];
		this.activityRegistry.set(activity.id, activity);
	};
}
