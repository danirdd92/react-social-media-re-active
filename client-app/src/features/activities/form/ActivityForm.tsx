import { observer } from 'mobx-react-lite';
import { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

const ActivityForm = () => {
	const { activityStore } = useStore();
	const { selectedActivity, closeForm, createActivity, updateActivity, loading } =
		activityStore;

	const initialState = selectedActivity ?? {
		id: '',
		title: '',
		category: '',
		description: '',
		date: '',
		city: '',
		venue: '',
	};
	const [activity, setActivity] = useState<Activity>(initialState);

	const onInputChanged = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setActivity({ ...activity, [name]: value });
	};

	const handleSubmit = () => {
		activity.id ? updateActivity(activity) : createActivity(activity);
	};

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
					value={activity.title}
					name='title'
				/>
				<Button onClick={closeForm} floated='right' type='button' content='Cancel' />
			</Form>
		</Segment>
	);
};

export default observer(ActivityForm);
