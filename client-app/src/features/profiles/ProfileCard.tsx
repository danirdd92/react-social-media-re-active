import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { truncateString } from '../../app/utils/helpers';
import FollowButton from './FollowButton';

interface Props {
	profile: Profile;
}

const ProfileCard = ({ profile }: Props) => {
	return (
		<Card as={Link} to={`/profiles/${profile.userName}`}>
			<Image src={profile.image || '/images/user.png'} />
			<Card.Content>
				<Card.Header>{profile.displayName}</Card.Header>
				<Card.Description>{truncateString(profile.bio)}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Icon name='user' />
				{profile.followersCount} followers
			</Card.Content>
			<FollowButton profile={profile} />
		</Card>
	);
};

export default observer(ProfileCard);
