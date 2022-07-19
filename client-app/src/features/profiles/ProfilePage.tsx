import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Loader from '../../app/layout/Loader';
import { useStore } from '../../app/stores/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

const ProfilePage = () => {
	const { userName } = useParams<{ userName: string }>();
	const {
		profileStore: { profile, loadProfile, loadingProfile, setActiveTab },
	} = useStore();

	useEffect(() => {
		loadProfile(userName);

		return () => {
			setActiveTab(0);
		};
	}, [loadProfile, userName]);

	if (loadingProfile) return <Loader content='Loading profile...' />;

	return (
		<Grid>
			<Grid.Column width={16}>
				{profile && (
					<>
						<ProfileHeader profile={profile} />
						<ProfileContent profile={profile} />
					</>
				)}
			</Grid.Column>
		</Grid>
	);
};

export default observer(ProfilePage);
