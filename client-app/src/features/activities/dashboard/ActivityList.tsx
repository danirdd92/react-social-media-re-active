import { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

const ActivityList = () => {
	const { activityStore } = useStore();
	const { activitiesByDate, selectActivity, deleteActivity, loading } =
		activityStore;
	const [target, setTarget] = useState('');
	const handleActivityDelete = (
		e: SyntheticEvent<HTMLButtonElement>,
		id: string
	) => {
		setTarget(e.currentTarget.name);
		deleteActivity(id);
	};

	return (
		<Segment>
			<Item.Group divided>
				{activitiesByDate.map((a) => {
					return (
						<Item key={a.id}>
							<Item.Content>
								<Item.Header as='a'>{a.title}</Item.Header>
								<Item.Meta>{a.date}</Item.Meta>
								<Item.Description>
									<div>{a.description}</div>
									<div>
										{a.city}, {a.venue}
									</div>
								</Item.Description>

								<Item.Extra>
									<Button
										as={Link}
										to={`/activities/${a.id}`}
										floated='right'
										content='View'
										color='blue'
									/>
									<Button
										name={a.id}
										onClick={(e) => handleActivityDelete(e, a.id)}
										floated='right'
										loading={loading && target === a.id}
										content='Delete'
										color='red'
									/>
									<Label basic content={a.category} />
								</Item.Extra>
							</Item.Content>
						</Item>
					);
				})}
			</Item.Group>
		</Segment>
	);
};

export default ActivityList;
