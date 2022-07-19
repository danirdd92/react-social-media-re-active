import { observer } from 'mobx-react-lite';
import { SyntheticEvent } from 'react';
import { Reveal, Button } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
	profile: Profile;
}

const FollowButton = ({ profile }: Props) => {
	const { userStore, profileStore } = useStore();
	const { updateFollowing, loading } = profileStore;

	if (userStore.user?.userName === profile.userName) return null;

	const handleFollow = (e: SyntheticEvent, userName: string) => {
		e.preventDefault();
		profile.following ? updateFollowing(userName, false) : updateFollowing(userName, true);
	};

	return (
		<Reveal animated='move'>
			<Reveal.Content visible style={{ width: '100%' }}>
				<Button fluid color='teal' content={profile.following ? 'Following' : 'Not following'} />
			</Reveal.Content>

			<Reveal.Content hidden style={{ width: '100%' }}>
				<Button
					fluid
					basic
					color={true ? 'red' : 'green'}
					content={profile.following ? 'Unfollow' : 'Follow'}
					loading={loading}
					onClick={(e) => handleFollow(e, profile.userName)}
				/>
			</Reveal.Content>
		</Reveal>
	);
};

export default observer(FollowButton);
