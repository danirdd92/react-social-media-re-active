import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import Loader from '../../../app/layout/Loader';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';

const ActivityForm = () => {
	const { activityStore } = useStore();
	const { createActivity, updateActivity, loading, loadingInitial, loadActivity } =
		activityStore;
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const [activity, setActivity] = useState<Activity>({
		id: '',
		title: '',
		category: '',
		description: '',
		date: '',
		city: '',
		venue: '',
	});

	useEffect(() => {
		const getActivity = async () => {
			if (id) {
				const _activity = await loadActivity(id);
				if (_activity) setActivity(_activity);
			}
		};

		getActivity();
	}, [id, loadActivity]);

	const onInputChanged = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setActivity({ ...activity, [name]: value });
	};

	const handleSubmit = () => {
		if (activity.id.length === 0) {
			const newActivity = {
				...activity,
				id: uuid(),
			};
			createActivity(newActivity).then(() =>
				history.push(`/activities/${newActivity.id}`)
			);
		} else {
			updateActivity(activity).then(() =>
				history.push(`/activities/${activity.id}`)
			);
		}
	};

	if (loadingInitial) return <Loader content='Loading content...' />;

	return (
		<Segment clearing>
			<Form autoComplete='off' onSubmit={handleSubmit}>
				<Form.Input
					placeholder='Title'
					onChange={onInputChanged}
					value={activity.title}
					name='title'
				/>
				<Form.TextArea
					placeholder='Description'
					onChange={onInputChanged}
					value={activity.description}
					name='description'
				/>
				<Form.Input
					placeholder='Category'
					onChange={onInputChanged}
					value={activity.category}
					name='category'
				/>
				<Form.Input
					type='date'
					placeholder='Date'
					onChange={onInputChanged}
					value={activity.date}
					name='date'
				/>
				<Form.Input
					placeholder='City'
					onChange={onInputChanged}
					value={activity.city}
					name='city'
				/>
				<Form.Input
					placeholder='Venue'
					onChange={onInputChanged}
					value={activity.venue}
					name='venue'
				/>
				<Button
					loading={loading}
					floated='right'
					positive
					type='submit'
					content='Submit'
					name='title'
				/>
				<Button
					as={Link}
					to='/activities'
					floated='right'
					type='button'
					content='Cancel'
				/>
			</Form>
		</Segment>
	);
};

export default observer(ActivityForm);
