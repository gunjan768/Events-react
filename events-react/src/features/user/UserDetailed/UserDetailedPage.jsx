import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr'
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedEvents from './UserDetailedEvents';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedSidebar from './UserDetailedSidebar';
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents, followUser, unfollowUser } from '../../user/userActions';

const mapStateToProps = (state, ownProps) => 
{
	let userUid = null;
	let profile = {};

	if(ownProps.match.params.id === state.auth.uid)
	{
		profile = state.firebase.profile;
	}
	else 
	{
		profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
		userUid = ownProps.match.params.id;
	}

	return {
		profile,
		userUid,
		events: state.events.userEvents,
		eventsLoading: state.async.loading,
		auth: state.firebase.auth,
		photos: state.firestore.ordered.photos,
		requesting: state.firestore.status.requesting,
		following: state.firestore.ordered.following
	};
}

const actions = 
{
	getUserEvents,
	followUser,
	unfollowUser
}
  
class UserDetailedPage extends Component 
{
	async componentDidMount() 
	{
		const user = await this.props.firestore.get(`users/${this.props.match.params.id}`);

		if(!user.exists) 
		{
			toastr.error('Not found', 'This is not the user you are looking for');

			this.props.history.push('/error');
		}

		await this.props.getUserEvents(this.props.userUid);
	}
	
	changeTab = (event, data) => 
	{
		// console.log("Active Tab : ",data);

		this.props.getUserEvents(this.props.userUid, data.activeIndex);
	}

	render() 
	{
		const { 
			profile,
			photos,
			auth,
			match,
			requesting,
			events,
			eventsLoading,
			followUser,
			following,
			unfollowUser
			
		} = this.props;   

		const isCurrentUser = auth.uid === match.params.id;
		const loading = Object.values(requesting).some(a => a === true);
		const isFollowing = !isEmpty(following);

		if(loading) 
		return <LoadingComponent inverted = { false }/>;

		return (
			<Grid>
				<UserDetailedHeader profile = { profile }/>
				<UserDetailedDescription profile = { profile }/>
				<UserDetailedSidebar 
					isCurrentUser = { isCurrentUser }
					unfollowUser = { unfollowUser }
					isFollowing = { isFollowing }
					followUser = { followUser }
					profile = { profile }
				/>
				{ 
					photos && photos.length > 0 && <UserDetailedPhotos photos = { photos }/> 
				}
				<UserDetailedEvents 
					events = { events } 
					eventsLoading = { eventsLoading } 
					changeTab = { this.changeTab }
				/>
			</Grid>
		);
	}
}

export default compose(
	connect(mapStateToProps, actions),
	firestoreConnect((auth, userUid, match) => userDetailedQuery(auth, userUid, match))
  )(UserDetailedPage);
  