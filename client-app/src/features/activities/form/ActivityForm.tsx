import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import Loader from '../../../app/layout/Loader';
import { ActivityFormValues } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import FormInput from '../../../app/common/form/FormInput';
import FormTextArea from '../../../app/common/form/FormTextArea';
import FormSelectInput from '../../../app/common/form/FormSelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import FormDatePicker from '../../../app/common/form/FormDatePicker';
import { v4 as uuid } from 'uuid';

const validationSchema = yup.object({
	title: yup.string().required('The activity title is required'),
	description: yup.string().required('The activity description is required'),
	category: yup.string().required(),
	date: yup.date().required('Date is required').nullable(),
	city: yup.string().required(),
	venue: yup.string().required(),
});

const ActivityForm = () => {
	const {
		activityStore: { createActivity, updateActivity, loading, loadingInitial, loadActivity },
	} = useStore();

	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

	useEffect(() => {
		const getActivity = async () => {
			if (id) {
				const _activity = await loadActivity(id);
				if (_activity) setActivity(new ActivityFormValues(_activity));
			}
		};

		getActivity();
	}, [id, loadActivity]);

	const handleFormSubmit = (activity: ActivityFormValues) => {
		if (!activity.id) {
			const newActivity = {
				...activity,
				id: uuid(),
			};
			createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
		} else {
			updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
		}
	};

	if (loadingInitial) return <Loader content='Loading content...' />;

	return (
		<Segment clearing>
			<Header content='Activity Details' sub color='teal' />
			<Formik
				validationSchema={validationSchema}
				enableReinitialize
				initialValues={activity}
				onSubmit={(values) => handleFormSubmit(values)}>
				{({ handleSubmit, isValid, isSubmitting, dirty }) => (
					<Form className='ui form' autoComplete='off' onSubmit={handleSubmit}>
						<FormInput placeholder='Title' name='title' />
						<FormTextArea placeholder='Description' name='description' />
						<FormSelectInput options={categoryOptions} placeholder='Category' name='category' />
						<FormDatePicker
							placeholderText='Date'
							name='date'
							showTimeSelect
							timeCaption='time'
							dateFormat='MMMM d, yyyy h:mm aa'
						/>
						<Header content='Location Details' sub color='teal' />

						<FormInput placeholder='City' name='city' />
						<FormInput placeholder='Venue' name='venue' />
						<Button
							disabled={isSubmitting || !dirty || !isValid}
							loading={isSubmitting}
							floated='right'
							positive
							type='submit'
							content='Submit'
							name='title'
						/>
						<Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
					</Form>
				)}
			</Formik>
		</Segment>
	);
};

export default observer(ActivityForm);
