import { observer } from 'mobx-react-lite';
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import FollowButton from './FollowButton';

interface Props {
	profile: Profile;
}

const ProfileHeader = ({ profile }: Props) => {
	const {
		commonStore: { assetImages },
	} = useStore();

	const userPlaceHolder = assetImages.get('user');
	return (
		<Segment>
			<Grid>
				<Grid.Column width={12}>
					<Item.Group>
						<Item>
							<Item.Image avatar size='small' src={profile.image || userPlaceHolder} />
							<Item.Content verticalAlign='middle'>
								<Header as='h1' content={profile.displayName} />
							</Item.Content>
						</Item>
					</Item.Group>
				</Grid.Column>
				<Grid.Column width={4}>
					<Statistic.Group widths={2}>
						<Statistic label='Followers' value={profile.followersCount} />
						<Statistic label='Following' value={profile.followingCount} />
					</Statistic.Group>

					<Divider />

					<FollowButton profile={profile} />
				</Grid.Column>
			</Grid>
		</Segment>
	);
};

export default observer(ProfileHeader);
