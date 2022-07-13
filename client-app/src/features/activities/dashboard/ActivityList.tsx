import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
	activities: Activity[];
	selctActivity: (id: string) => void;
	deleteActivity: (id: string) => void;
}

const ActivityList = ({ activities, selctActivity, deleteActivity }: Props) => {
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
									<Button onClick={() => deleteActivity(a.id)} floated='right' content='Delete' color='red' />
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
