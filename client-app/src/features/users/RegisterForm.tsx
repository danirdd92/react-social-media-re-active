import { Formik, ErrorMessage } from 'formik';
import { observer } from 'mobx-react-lite';
import { Form, Header, Label, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import * as yup from 'yup';
import FormInput from '../../app/common/form/FormInput';
import ValidationsErrors from '../errors/ValidationsErrors';

const RegisterForm = () => {
	const { userStore } = useStore();

	return (
		<Formik
			initialValues={intialValues}
			validationSchema={registerSchema}
			onSubmit={(values, { setErrors }) =>
				userStore.register(values).catch((error) => setErrors({ error }))
			}>
			{({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
				<Form className='ui form error' onSubmit={handleSubmit} autocomplete='off'>
					<Header
						as='h2'
						content='Sign up to Reactivities'
						color='teal'
						textAlign='center'
					/>

					<FormInput name='displayName' placeholder='DisplayName' />
					<FormInput name='userName' placeholder='Username' />
					<FormInput name='email' placeholder='Email' />
					<FormInput name='password' placeholder='Password' type='password' />

					<ErrorMessage
						name='error'
						render={() => <ValidationsErrors errors={errors.error} />}
					/>

					<Button
						disabled={!isValid || !dirty || isSubmitting}
						loading={isSubmitting}
						positive
						content='Register'
						type='submit'
						fluid
					/>
				</Form>
			)}
		</Formik>
	);
};

export default observer(RegisterForm);

const registerSchema = yup.object({
	displayName: yup.string().required(),
	userName: yup.string().required(),
	email: yup.string().required().email(),
	password: yup.string().required(),
});

const intialValues = {
	displayName: '',
	userName: '',
	email: '',
	password: '',
	error: null,
};
