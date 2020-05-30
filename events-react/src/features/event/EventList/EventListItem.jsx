import React, { Component } from 'react';
import { Segment, Item, Icon, List, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import EventListAttendee from './EventListAttendee';
import { objectToArray } from '../../../app/common/util/helpers'

class EventListItem extends Component 
{
	render() 
	{
		const { event, userID } = this.props;
		
		if(event.attendees)
		objectToArray(event.attendees);

		return (
			<Segment.Group>
				
				<Segment>
					<Item.Group>
						<Item>
							
							<Item.Image size="tiny" circular src = { event.hostPhotoURL } />
							
							<Item.Content>
								<Item.Header as = { Link } to = {`/event/${event.id}`}>{ event.title }</Item.Header>
								<Item.Description>
									Hosted by {' '}
									<Link to = { `/profile/${event.hostUid}` }>
										{ userID === event.hostUid ? "You" : event.hostedBy }
									</Link>
								</Item.Description>
								{
									event.cancelled &&
									<Label
										style = {{ top: '-40px' }}
										ribbon="right"
										color="red"
										content="This event has been cancelled"
									/>
								}
							</Item.Content>

						</Item>
					</Item.Group>
				</Segment>

				<Segment>
					<span>
						<Icon name="clock" /> { event.date && format(event.date.toDate(), 'd MMM yyyy') } at{' '} 
						{ event.date && format(event.date.toDate(), 'HH:mm') } | <Icon name="marker" color="red" /> 
						{ event.venue }
					</span>
				</Segment>

				<Segment secondary>
					<List horizontal>
						{
							event.attendees &&
							objectToArray(event.attendees).map(attendee => (
								<EventListAttendee key = { attendee.id } attendee = { attendee } />
							))
						}
					</List>
				</Segment>

				<Segment clearing>
					<span>{ event.description }</span>
					<Button as = { Link } to = { `/event/${event.id}` } color="teal" floated="right" content="View" />
				</Segment>

			</Segment.Group>
		);
	}
}

export default EventListItem;

// In firestore, event.attendees is stored as a map ( an object ) and not in the from an array so we first
// need to tranform it into an array hence we used Object.values() which will transfer object into an array
// but we will lost the key ( as object is stored as key-value pair ).;
// Object.values(event.attendees).map((attendee, ind) => (
// 	<EventListAttendee key = { ind } attendee = { attendee }/>
// ))