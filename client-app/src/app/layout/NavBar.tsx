import { Button, Container, Menu } from 'semantic-ui-react';

interface Props {
	openForm: () => void;
}

const NavBar = ({ openForm }: Props) => {
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
					<Button onClick={openForm} positive content='Create Activity' />
				</Menu.Item>
			</Container>
		</Menu>
	);
};

export default NavBar;
