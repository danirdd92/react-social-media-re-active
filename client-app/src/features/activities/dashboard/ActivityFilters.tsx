import { observer } from 'mobx-react-lite';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

const ActivityFilters = () => {
	const {
		activityStore: { predicate, setPredicate },
	} = useStore();

	return (
		<>
			<Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
				<Header icon='filter' attached color='teal' content='Filters' />
				<Menu.Item content='All Activities' active={predicate.has('all')} onClick={() => setPredicate('all', true)} />
				<Menu.Item
					content="I'm Going"
					active={predicate.has('isGoing')}
					onClick={() => setPredicate('isGoing', true)}
				/>
				<Menu.Item
					content="I'm Hosting"
					active={predicate.has('isHost')}
					onClick={() => setPredicate('isHost', true)}
				/>
			</Menu>

			<Header />

			<Calendar
				onChange={(date: Date) => setPredicate('startDate', date)}
				value={(predicate.get('startDate') as Date) || new Date()}
			/>
		</>
	);
};

export default observer(ActivityFilters);
