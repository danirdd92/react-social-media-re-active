import { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
	activity?: Activity;
	closeForm: () => void;
	createOrEdit: (activity: Activity) => void;
}
const ActivityForm = ({ activity: selectedActivity, closeForm, createOrEdit }: Props) => {
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

	const onInputChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setActivity({ ...activity, [name]: value });
	};

	const handleSubmit = () => {
		createOrEdit(activity);
	};

	return (
		<Segment clearing>
			<Form onSubmit={handleSubmit} autoComplete='off'>
				<Form.Input placeholder='Title' onChange={onInputChanged} value={activity.title} name='title' />
				<Form.TextArea placeholder='Description' onChange={onInputChanged} value={activity.description} name='description' />
				<Form.Input placeholder='Category' onChange={onInputChanged} value={activity.category} name='category' />
				<Form.Input placeholder='Date' onChange={onInputChanged} value={activity.date} name='date' />
				<Form.Input placeholder='City' onChange={onInputChanged} value={activity.city} name='city' />
				<Form.Input placeholder='Venue' onChange={onInputChanged} value={activity.venue} name='venue' />
				<Button floated='right' positive type='submit' content='Submit' value={activity.title} name='title' />
				<Button onClick={closeForm} floated='right' type='button' content='Cancel' />
			</Form>
		</Segment>
	);
};

export default ActivityForm;
