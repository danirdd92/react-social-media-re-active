import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Grid, Loader as LoadingActivities } from 'semantic-ui-react';
import Loader from '../../../app/layout/Loader';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

const ActivityDashboard = () => {
	const { activityStore } = useStore();
	const { loadActivities, loadingInitial, activityRegistry, pagination, setPagingParams } = activityStore;
	const [loadingNext, setLoadingNext] = useState(false);

	useEffect(() => {
		if (activityRegistry.size <= 1) loadActivities();
	}, [activityStore]);

	const handleGetNext = () => {
		setLoadingNext(true);
		setPagingParams(new PagingParams(pagination!.currentPage + 1));
		loadActivities().then(() => setLoadingNext(false));
	};

	return (
		<Grid>
			<Grid.Column width='10'>
				{loadingInitial && !loadingNext ? (
					<>
						<ActivityListItemPlaceholder />
						<ActivityListItemPlaceholder />
					</>
				) : (
					<InfiniteScroll
						pageStart={0}
						loadMore={handleGetNext}
						hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
						initialLoad={false}>
						<ActivityList />
					</InfiniteScroll>
				)}
			</Grid.Column>
			<Grid.Column width='6'>
				<ActivityFilters />
			</Grid.Column>
			<Grid.Column width={10}>
				<LoadingActivities active={loadingNext} />
			</Grid.Column>
		</Grid>
	);
};

export default observer(ActivityDashboard);
