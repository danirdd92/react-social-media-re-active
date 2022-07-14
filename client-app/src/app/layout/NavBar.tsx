import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

const NavBar = () => {
	const { activityStore } = useStore();
	const { openForm } = activityStore;
	return (
		<Menu inverted fixed='top'>
			<Container>
				<Menu.Item as={NavLink} to='/' exact header>
					<img
						src='images/logo.png'
						alt='logo'
						style={{
							marginRight: '1.25rem',
						}}
					/>
					Reactivities
				</Menu.Item>
				<Menu.Item as={NavLink} to='/activities'>
					Activities
				</Menu.Item>
				<Menu.Item>
					<Button
						as={NavLink}
						to='/createActivity'
						positive
						content='Create Activity'
					/>
				</Menu.Item>
			</Container>
		</Menu>
	);
};

export default NavBar;
