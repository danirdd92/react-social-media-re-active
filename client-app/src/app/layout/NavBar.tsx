import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu, MenuItem } from 'semantic-ui-react';
import { useStore } from '../stores/store';

const NavBar = () => {
	const {
		userStore: { user, logout },
	} = useStore();
	return (
		<Menu inverted fixed='top'>
			<Container>
				<Menu.Item as={NavLink} to='/' exact header>
					<img
						src='/images/logo.png'
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
				<Menu.Item as={NavLink} to='/errors'>
					Errors
				</Menu.Item>

				<Menu.Item>
					<Button as={NavLink} to='/createActivity' positive content='Create Activity' />
				</Menu.Item>
				<Menu.Item position='right'>
					<Image src={user?.image || '/images/user.png'} avatar spaced='right' />
					<Dropdown pointing='top left' text={user?.displayName}>
						<Dropdown.Menu>
							<Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text='My Profile' icon='user' />

							<Dropdown.Item onClick={logout} text='Logout' icon='power' />
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>
			</Container>
		</Menu>
	);
};

export default observer(NavBar);
