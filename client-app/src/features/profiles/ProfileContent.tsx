import { observer } from 'mobx-react-lite';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import ProfileAbout from './ProfileAbout';
import ProfileActivities from './ProfileActivities';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';

interface Props {
	profile: Profile;
}

const ProfileContent = ({ profile }: Props) => {
	const {
		profileStore: { setActiveTab },
	} = useStore();
	const panes = [
		{ menuItem: 'About', render: () => <ProfileAbout /> },
		{ menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
		{ menuItem: 'Events', render: () => <ProfileActivities /> },
		{ menuItem: 'Followers', render: () => <ProfileFollowings /> },
		{ menuItem: 'Following', render: () => <ProfileFollowings /> },
	];

	return (
		<Tab
			onTabChange={(e, data) => setActiveTab(data.activeIndex)}
			menu={{ fluid: true, vertical: true }}
			menuPosition='right'
			panes={panes}
		/>
	);
};

export default observer(ProfileContent);
