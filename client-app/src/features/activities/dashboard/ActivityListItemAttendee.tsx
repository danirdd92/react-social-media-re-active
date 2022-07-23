import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import { useStore } from '../../../app/stores/store';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
	attendees: Profile[];
}

const ActivityListItemAttendee = ({ attendees }: Props) => {
	const {
		commonStore: { assetImages },
	} = useStore();

	const userPlaceholder = assetImages.get('user');
	return (
		<List horizontal>
			{attendees.map((attendee) => (
				<Popup
					hoverable
					key={attendee.userName}
					trigger={
						<List.Item key={attendee.userName} as={Link} to={`/profiles/${attendee.userName}`}>
							<Image
								size='mini'
								circular
								src={attendee.image || userPlaceholder}
								bordered
								style={attendee.following ? followingStyle : null}
							/>
						</List.Item>
					}>
					<Popup.Content>
						<ProfileCard profile={attendee} />
					</Popup.Content>
				</Popup>
			))}
		</List>
	);
};

export default observer(ActivityListItemAttendee);

const followingStyle = {
	borderColor: 'orange',
	borderWidth: 2,
};
