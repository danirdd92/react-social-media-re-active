import { Dimmer, Loader as SemUILoader } from 'semantic-ui-react';

interface Props {
	inverted?: boolean;
	content?: string;
}
const Loader = ({ inverted = true, content = 'Loading...' }: Props) => {
	return (
		<Dimmer active={true} inverted={inverted}>
			<SemUILoader content={content} />
		</Dimmer>
	);
};

export default Loader;
