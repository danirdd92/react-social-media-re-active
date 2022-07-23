import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

const HomePage = () => {
	const {
		userStore,
		modalStore,
		commonStore: { assetImages },
	} = useStore();
	const logo = assetImages.get('logo');
	return (
		<Segment inverted textAlign='center' vertical className='masthead'>
			<Container text>
				<Header as='h1' inverted style={{ marginRight: 20 }}>
					<Image size='massive' src={logo} alt='logo' style={{ marginBottom: 12 }} />
					Re.Active
				</Header>
				{userStore.isLoggedIn ? (
					<>
						<Header as='h2' inverted content='Join our soical activities' />
						<Button as={Link} to='/activities' size='huge' inverted>
							Go to Activities
						</Button>
					</>
				) : (
					<>
						<Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
							Login
						</Button>

						<Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
							Register
						</Button>
					</>
				)}
			</Container>
		</Segment>
	);
};

export default observer(HomePage);
