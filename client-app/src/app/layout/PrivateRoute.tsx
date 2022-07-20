import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { useStore } from '../stores/store';

interface Props extends RouteProps {
	component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

const PrivateRoute = ({ component: Component, ...rest }: Props) => {
	const {
		userStore: { isLoggedIn },
	} = useStore();

	return <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to='/' />)} />;
};

export default PrivateRoute;
