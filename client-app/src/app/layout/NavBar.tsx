import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

const NavBar = () => {
	const { activityStore } = useStore();
	const { openForm } = activityStore;
	return (
		<Menu inverted fixed='top'>
			<Container>
				<Menu.Item header>
					<img
						src='images/logo.png'
						alt='logo'
						style={{
							marginRight: '1.25rem',
						}}
					/>
					Reactivities
				</Menu.Item>
				<Menu.Item>Activities</Menu.Item>
				<Menu.Item>
					<Button onClick={() => openForm()} positive content='Create Activity' />
				</Menu.Item>
			</Container>
		</Menu>
	);
};

export default NavBar;
