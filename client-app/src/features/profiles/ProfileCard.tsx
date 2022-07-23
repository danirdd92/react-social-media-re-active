import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import { truncateString } from '../../app/utils/helpers';
import FollowButton from './FollowButton';

interface Props {
	profile: Profile;
}

const ProfileCard = ({ profile }: Props) => {
	const {
		commonStore: { assetImages },
	} = useStore();

	const userPlaceHolder = assetImages.get('user');

	return (
		<Card as={Link} to={`/profiles/${profile.userName}`}>
			<Image src={profile.image || userPlaceHolder} />
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
