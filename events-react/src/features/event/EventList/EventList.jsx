import React, { Component } from 'react';
import EventListItem from './EventListItem';
import InfiniteScroll from 'react-infinite-scroller';

class EventList extends Component 
{
	render() 
	{
		const { events, getNextEvents, loading, moreEvents, userID } = this.props;
		
		// console.log("EventsList : ",events);

		return (
			<div>
			{
				events && events.length &&
				<InfiniteScroll
					pageStart = { 0 }
					loadMore = { getNextEvents }
					hasMore = { !loading && moreEvents }
					initialLoad = { false }
				>
					{
						events && events.map((event, ind) => (
							<EventListItem  key = { ind } event = { event } userID = { userID }/>
						))
					}
				</InfiniteScroll>
			}
			</div>
		);
	}
}

export default EventList;