import { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
	activities: Activity[];
	selctActivity: (id: string) => void;
	deleteActivity: (id: string) => void;
	submitting: boolean;
}

const ActivityList = ({ activities, selctActivity, deleteActivity, submitting }: Props) => {
	const [target, setTarget] = useState('');

	const handleActivityDelete = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
		setTarget(e.currentTarget.name);
		deleteActivity(id);
	};

	return (
		<Segment>
			<Item.Group divided>
				{activities.map((a) => {
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
									<Button onClick={() => selctActivity(a.id)} floated='right' content='View' color='blue' />
									<Button
										name={a.id}
										onClick={(e) => handleActivityDelete(e, a.id)}
										floated='right'
										loading={submitting && target === a.id}
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
