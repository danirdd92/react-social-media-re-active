import { ChatComment } from '../models/comment';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { store } from './store';

export default class CommentStore {
	comments: ChatComment[] = [];
	hubConnection: HubConnection | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	createHubConnection = (activityId: string) => {
		if (store.activityStore.selectedActivity) {
			this.hubConnection = new HubConnectionBuilder()
				.withUrl('http://localhost:5000/chat?activityId=' + activityId, {
					accessTokenFactory: () => store.userStore.user?.token!,
				})
				.withAutomaticReconnect()
				.configureLogging(LogLevel.Information)
				.build();

			this.hubConnection.start().catch((error) => console.error(error));

			this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
				runInAction(() => {
					for (const comment of comments) {
						comment.createdAt = new Date(comment.createdAt + 'Z');
					}
					this.comments = comments;
				});
			});

			this.hubConnection.on('RecieveComment', (comment: ChatComment) => {
				runInAction(() => {
					comment.createdAt = new Date(comment.createdAt);
					this.comments = [comment, ...this.comments];
				});
			});
		}
	};

	stopHubConnection = () => {
		this.hubConnection?.stop().catch((error) => console.error(error));
	};

	clearComments = () => {
		this.comments = [];
		this.stopHubConnection();
	};

	addComment = async (values: any) => {
		values.activityId = store.activityStore.selectedActivity?.id;

		try {
			await this.hubConnection?.invoke('SendComment', values);
		} catch (error) {}
	};
}
