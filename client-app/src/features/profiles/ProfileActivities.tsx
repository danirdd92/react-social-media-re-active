import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, GridColumn, Header, Tab, TabProps, Image } from 'semantic-ui-react';
import { Activity } from '../../app/models/activity';
import { Category } from '../../app/models/category';
import { useStore } from '../../app/stores/store';

const panes = [
	{ menuItem: 'Future Events', pane: { key: 'future' } },
	{ menuItem: 'Past Events', pane: { key: 'past' } },
	{ menuItem: 'Hosting', pane: { key: 'hosting' } },
];

const ProfileActivities = () => {
	const {
		profileStore: { profile, loadUserActivities, loadingActivities, userActivities },
		commonStore: { categoryImages },
	} = useStore();

	useEffect(() => {
		loadUserActivities(profile!.userName);
	}, [loadUserActivities, profile]);

	const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
		loadUserActivities(profile!.userName, panes[data.activeIndex as number].pane.key);
	};

	return (
		<Tab.Pane loading={loadingActivities}>
			<Grid>
				<Grid.Column width={16}>
					<Header floated='left' icon='calendar' content='Activities' />
				</Grid.Column>
				<GridColumn width={16}>
					<Tab
						panes={panes}
						menu={{ secondary: true, pointing: true }}
						onTabChange={(e, data) => handleTabChange(e, data)}
					/>
					<br />
					<Card.Group itemsPerRow={4}>
						{userActivities.map((activity) => (
							<Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
								<Image src={categoryImages.get(activity.category as Category)} style={imageStyle} />
								<Card.Content>
									<Card.Header textAlign='center'>{activity.titile}</Card.Header>
									<Card.Meta textAlign='center'>
										<div>{format(new Date(activity.date), 'do LLL')}</div>
										<div>{format(new Date(activity.date), 'h:mm a')}</div>
									</Card.Meta>
								</Card.Content>
							</Card>
						))}
					</Card.Group>
				</GridColumn>
			</Grid>
		</Tab.Pane>
	);
};

export default observer(ProfileActivities);

const imageStyle = {
	minHeight: 100,
	objectFit: 'cover',
};
