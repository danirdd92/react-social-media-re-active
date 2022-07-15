import { Message } from 'semantic-ui-react';

interface Props {
	errors: string[] | null;
}
const ValidationsErrors = ({ errors }: Props) => {
	return (
		<Message error>
			{errors && (
				<Message.List>
					{errors.map((err: any, index: number) => (
						<Message.Item key={index}>{err}</Message.Item>
					))}
				</Message.List>
			)}
		</Message>
	);
};

export default ValidationsErrors;
