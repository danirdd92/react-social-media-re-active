import { Formik, Form, ErrorMessage } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header, Label } from 'semantic-ui-react';
import FormInput from '../../app/common/form/FormInput';
import { useStore } from '../../app/stores/store';

const LoginForm = () => {
	const { userStore } = useStore();
	return (
		<Formik
			initialValues={{ email: '', password: '', error: null }}
			onSubmit={(values, { setErrors }) =>
				userStore
					.login(values)
					.catch((error) => setErrors({ error: 'Invalid Email or password' }))
			}>
			{({ handleSubmit, isSubmitting, errors }) => (
				<Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
					<Header
						as='h2'
						content='Login to Reactivities'
						color='teal'
						textAlign='center'
					/>

					<FormInput name='email' placeholder='Email' />
					<FormInput name='password' placeholder='Password' type='password' />
					<ErrorMessage
						name='error'
						render={() => (
							<Label
								style={{ marginBottom: 10 }}
								basic
								color='red'
								content={errors.error}
							/>
						)}
					/>

					<Button
						loading={isSubmitting}
						positive
						content='Login'
						type='submit'
						fluid
					/>
				</Form>
			)}
		</Formik>
	);
};

export default observer(LoginForm);
