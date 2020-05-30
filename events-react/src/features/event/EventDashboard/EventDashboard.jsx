import React from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import EventList from '../EventList/EventList';
import { getEventsForDashboard } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
// import memoize from "memoize-one";

const query = () => 
{
	return [
		{	
			collection: 'activity',
			orderBy: ['timestamp', 'desc'],
			limit: 5
		}
	];
}
  
const mapStateToProps = state =>
{
	// console.log("State : ",state);

	return (
	{
		events: state.events.events,
		loading: state.async.loading,
		userID: state.firebase.auth.uid,
		activities: state.firestore.ordered.activity
	});
}

const actions = 
{
	getEventsForDashboard
}

class EventDashboard extends React.PureComponent 
{
	contextRef = React.createRef();

	constructor(props)
	{
		super(props);
		
		this.state = 
		{
			moreEvents: false,
			loadingInitial: true,
			loadedEvents: [],
		}
	}

	async componentDidMount() 
	{
		const next = await this.props.getEventsForDashboard();

		// console.log(next);

		// As we set limit to 2 means we two items per loading (scrolling i.e infinite scrolling). If next.docs.length > 1 then it means that
		// we have more events in the database to load ( or these two events are the last ). Hence we set moreEvents to true i.e there are 
		// more events to load from the firestore.
		if(next && next.docs && next.docs.length > 1) 
		{
			this.setState(
			{
				moreEvents: true,
				loadingInitial: false
			});
		}
		else
		{
			this.setState({ loadingInitial: false });
		}
	}
	
	// UNSAFE_componentWillReceiveProps(nextProps)
	// {
	// 	if(this.props.events !== nextProps.events) 
	// 	{
	// 		this.setState(
	// 		{
	// 			loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
	// 		});
	// 	}
	// }

	static getDerivedStateFromProps(props, state)
	{
		// console.log("Props", props);
		// console.log("state", state);

		if(props.events !== state.prevPropsEvents && state.loadingInitial === false) 
		{
			return (
			{
				prevPropsEvents: props.events,
				loadedEvents: [...state.loadedEvents, ...props.events],
			});
		}
		else
		return {};
	}

	getNextEvents = async () => 
	{
		const { events } = this.props;
		const lastEvent = events && events[events.length - 1];

		// console.log(lastEvent);

		const next = await this.props.getEventsForDashboard(lastEvent);

		// console.log("NextEvents : ",next);

		if(next && next.docs && next.docs.length <= 1) 
		{
			this.setState(
			{
				moreEvents: false
			});
		}
	}

	handleContextRef = contextRef => this.setState({ contextRef })

	render() 
	{
		const { loading, userID, activities } = this.props;
		const { moreEvents, loadedEvents } = this.state;
		
		// console.log("Events : ",moreEvents);

		if(this.state.loadingInitial) 
		return <LoadingComponent inverted = { false } />;
	
		return (
			<Grid>
				<Grid.Column width = { 10 }>
					<div ref = { this.contextRef }>
						<EventList
							loading = { loading }
							moreEvents = { moreEvents }
							events = { loadedEvents }
							getNextEvents = { this.getNextEvents }
							userID = { userID }
						/>
					</div>
				</Grid.Column>
				
				<Grid.Column width = { 6 }>
					<EventActivity 
						activities = { activities } 
						contextRef = { this.contextRef } 
						currentUser = { this.props.userID }
					/>
				</Grid.Column>

				<Grid.Column width = { 10 }>
					<Loader active = { loading }/>
				</Grid.Column>
			</Grid>
		);
	}
}

// Directly mapping action creators to connect function is an another way. In this way you don't require action creator to be wrapped
// inside the dispatch function.
export default connect(mapStateToProps, actions)(firestoreConnect(() => query())(EventDashboard));