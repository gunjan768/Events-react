import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { objectToArray, createDataTree } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { openModal } from '../../modals/modalActions';
import { toastr } from 'react-redux-toastr';
import NotFound from '../../../app/layout/NotFound';

const mapStateToProps = (state, ownProps) => 
{
	let event = {};
	const eventId = ownProps.match.params.id;

	if(state.firestore.ordered.events && state.firestore.ordered.events[0])
	event = state.firestore.ordered.events[0] || {};

	return {
		event,
		loading: state.async.loading,
		auth: state.firebase.auth,
		requesting: state.firestore.status.requesting,
		eventChat: !isEmpty(state.firebase.data.event_chat) && objectToArray(state.firebase.data.event_chat[eventId])
	};
}

const actions = 
{
	goingToEvent,
	cancelGoingToEvent,
	addEventComment,
	openModal
};

class EventDetailedPage extends Component 
{	
	state = { initialLoading: true };

	// You can use firestoreConnect HOC instead of withFirestore HOC as firestoreConnect will autonatically listen and unlisten the events
	// without writing them manually as we have to do in withFirestore. withFirestore we have to do it manually. Listening events means you 
	// can interact with firestore live. Live changes will automatically get reflected.
	async componentDidMount() 
	{
		const { firestore, match } = this.props;
		const event = await firestore.get(`events/${match.params.id}`);

		if(!event.exists) 
		{
		  	toastr.error('Not Found', 'This is not the event are looking for');

		  	this.props.history.push('/error');
		}

		await firestore.setListener(`events/${match.params.id}`);

		this.setState(
		{
		  	initialLoading: false
		})
	}

	async componentWillUnmount() 
	{
		const { firestore, match } = this.props;

		await firestore.unsetListener(`events/${match.params.id}`);
	}

	render() 
	{
		const { 
			openModal,
			event,
			auth,
			goingToEvent,
			cancelGoingToEvent,
			addEventComment,
			eventChat,
			loading,
			requesting,
			match
		} = this.props;

		const attendees = event && event.attendees && objectToArray(event.attendees).sort((a,b) => a.joinDate - b.joinDate);

		const isHost = event.hostUid === auth.uid;
		const isGoing = attendees && attendees.some(attendee => attendee.id === auth.uid);
		const authenticated = auth.isLoaded && !auth.isEmpty
		const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
		const loadingEvent = requesting[`events/${match.params.id}`]

		// console.log("chatTree : ",chatTree);

		if(loadingEvent || this.state.initialLoading) 
		return <LoadingComponent inverted = { false }/>;
		
		if(Object.keys(event).length === 0)
		return <NotFound />;		

		return (
			<Grid>	
				<Grid.Column width = { 10 }>
					<EventDetailedHeader
						event = { event }
						isHost = { isHost }
						isGoing = { isGoing }
						goingToEvent = { goingToEvent }
						cancelGoingToEvent = { cancelGoingToEvent }
						openModal = { openModal }
						authenticated = { authenticated }
						loading = { loading }
					/>
					<EventDetailedInfo event = { event } />

					{ 	authenticated && 
						<EventDetailedChat 
							addEventComment = { addEventComment } 
							eventId = { event.id } 
							eventChat = { chatTree } 
						/>
					}
				</Grid.Column>

				<Grid.Column width = { 6 }>
					<EventDetailedSidebar attendees = { attendees } />
				</Grid.Column>
			</Grid>
		);
	}
}

export default compose(
	withFirestore,
	connect(mapStateToProps, actions),
	firebaseConnect(props => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
  