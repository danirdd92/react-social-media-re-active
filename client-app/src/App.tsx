import { useState, useEffect } from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Header, List } from 'semantic-ui-react';
function App() {
	const [activities, setActivities] = useState([]);

	useEffect(() => {
		const controller = new AbortController();
		axios
			.get('http://localhost:5000/api/activities', {
				signal: controller.signal,
			})
			.then((res) => {
				setActivities(res.data);
			});

		return () => controller.abort();
	}, []);

	return (
		<div>
			<Header as='h2' icon='users' content='Reactivities' />
			<List>
				{activities &&
					activities.map((a: any) => {
						return <List.Item key={a.id}>{a.title}</List.Item>;
					})}
			</List>
		</div>
	);
}

export default App;
