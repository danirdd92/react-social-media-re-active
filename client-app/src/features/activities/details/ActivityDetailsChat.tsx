import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react';
import FormTextArea from '../../../app/common/form/FormTextArea';
import { useStore } from '../../../app/stores/store';
import * as yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

interface Props {
	activityId: string;
}

const ActivityDetailsChat = ({ activityId }: Props) => {
	const { commentStore } = useStore();
	useEffect(() => {
		if (activityId) {
			commentStore.createHubConnection(activityId);
		}

		return () => commentStore.clearComments();
	}, [commentStore, activityId]);

	return (
		<>
			<Segment textAlign='center' attached='top' inverted color='teal' style={{ border: 'none' }}>
				<Header>Chat about this event</Header>
			</Segment>
			<Segment attached clearing>
				<Formik
					onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
					initialValues={{ body: '' }}
					validationSchema={validationSchema}>
					{({ isValid, isSubmitting, handleSubmit }) => (
						<Form className='ui form'>
							<Field name='body'>
								{(props: FieldProps) => (
									<div style={{ position: 'relative' }}>
										<Loader active={isSubmitting} />
										<textarea
											placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
											rows={2}
											{...props.field}
											onKeyPress={(e) => {
												if (e.key === 'Enter' && e.shiftKey) return;

												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault();
													isValid && handleSubmit();
												}
											}}
										/>
									</div>
								)}
							</Field>
						</Form>
					)}
				</Formik>
				<Comment.Group>
					{commentStore.comments.map((comment) => (
						<Comment key={comment.id}>
							<Comment.Avatar src={comment.image || '/assets/images/user.png'} />
							<Comment.Content>
								<Comment.Author as={Link} to={`/profiles/${comment.userName}`}>
									{comment.displayName}
								</Comment.Author>
								<Comment.Metadata>
									<div>{formatDistanceToNow(comment.createdAt)} ago</div>
								</Comment.Metadata>
								<Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
							</Comment.Content>
						</Comment>
					))}
				</Comment.Group>
			</Segment>
		</>
	);
};

export default observer(ActivityDetailsChat);

const validationSchema = yup.object({
	body: yup.string().required(),
});

const styles = {
	field: {
		position: 'relative',
	},
};

{
	/* <FormTextArea placeholder='Add comment' name='body' rows={2} />
								<Button
									loading={isSubmitting}
									disabled={isSubmitting || !isValid}
									content='Add Reply'
									labelPosition='left'
									icon='edit'
									primary
									type='submit'
									floated='right'
								/> */
}
