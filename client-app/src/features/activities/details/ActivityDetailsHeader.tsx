import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { Category } from '../../../app/models/category';
import { useStore } from '../../../app/stores/store';

interface Props {
	activity: Activity;
}

const ActivityDetailsHeader = ({ activity }: Props) => {
	const {
		activityStore: { updateAttendance, loading, cancelActivityToggle },
		commonStore: { categoryImages },
	} = useStore();

	const category = categoryImages.get(activity.category as Category);

	return (
		<Segment.Group>
			<Segment basic attached='top' style={{ padding: '0' }}>
				{activity.isCancelled && (
					<Label
						style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
						ribbon
						color='red'
						content='Cancelled'
					/>
				)}
				<Image src={category} fluid style={activityImageStyle} />
				<Segment style={activityImageTextStyle} basic>
					<Item.Group>
						<Item>
							<Item.Content>
								<Header size='huge' content={activity.title} style={{ color: 'white' }} />
								<p>{format(activity.date!, 'dd MMM yyyy h:mm aa')}</p>
								<p>
									Hosted by{' '}
									<strong>
										<Link to={`/profiles/${activity.host?.userName}`}>{activity.host?.displayName}</Link>
									</strong>
								</p>
							</Item.Content>
						</Item>
					</Item.Group>
				</Segment>
			</Segment>
			<Segment clearing attached='bottom'>
				{activity.isHost ? (
					<>
						<Button
							onClick={cancelActivityToggle}
							color={activity.isCancelled ? 'green' : 'red'}
							floated='left'
							basic
							content={activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity'}
						/>
						<Button
							as={Link}
							to={`/manage/${activity.id}`}
							disabled={activity.isCancelled}
							color='orange'
							floated='right'>
							Manage Event
						</Button>
					</>
				) : activity.isGoing ? (
					<Button loading={loading} onClick={updateAttendance}>
						Cancel attendance
					</Button>
				) : (
					<Button disabled={activity.isCancelled} loading={loading} onClick={updateAttendance} color='teal'>
						Join Activity
					</Button>
				)}
			</Segment>
		</Segment.Group>
	);
};

export default observer(ActivityDetailsHeader);

const activityImageStyle = {
	filter: 'brightness(30%)',
};

const activityImageTextStyle = {
	position: 'absolute',
	bottom: '5%',
	left: '5%',
	width: '100%',
	height: 'auto',
	color: 'white',
};
