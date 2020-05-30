import React from 'react'
import { Header, Segment, Feed, Sticky } from 'semantic-ui-react'
import EventActivityItem from './EventActivityItem'

const EventActivity = ({ activities, contextRef, currentUser }) => 
{
	return (
		// By default Sticky has a zIndex = 800 so when the drop down menu comes down it will not be visible i.e it goes behind the the Sticky
		// hence to make it forward we lowered the zIndex of sticky to a very small value i.e 0. Remember that to style the Sticky tag we
		// have styleElement prop instead of style prop.
		<Sticky context = { contextRef } offset = { 100 } styleElement = {{ zIndex: 0 }}>
			<Header attached='top' content='Recent Activity'/>
			<Segment attached>
				<Feed>
				{
					activities && activities.map(activity => (
						<EventActivityItem key = { activity.id } activity = { activity } currentUser = { currentUser } />
					))
				}
				</Feed>
			</Segment>
		</Sticky>
	);
}

export default EventActivity;