import React from 'react';
import { Segment, Item, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

const EventDetailedSidebar = ({ attendees }) => 
{
	return (
		<div>
			<Segment
				textAlign="center"
				style = {{ border: 'none' }}
				attached="top"
				secondary
				inverted
				color="teal"
			>
				{ attendees && attendees.length } { attendees && attendees.length === 1 ? 'Person' : 'People' } Going
			</Segment>

			<Segment attached>
				<Item.Group relaxed divided>
				{
					attendees && attendees.map(attendee => (
						<Item key = { attendee.id } style = {{ position: 'relative' }}>
							{
								attendee.host ? 
									<Label style = {{ position: 'absolute' }} color="orange" ribbon="right">Host</Label>
								:
									null
							}
							
							<Image circular size="mini" src = { attendee.photoURL }/>

							<Item.Content verticalAlign="middle">
								<Link to = {`/profile/${attendee.id}`}>{ attendee.displayName }</Link>
							</Item.Content>	
						</Item>
					))
				}
				</Item.Group>
			</Segment>
		</div>
	);
}

export default EventDetailedSidebar;