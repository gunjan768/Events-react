import React from 'react';
import { Card, Grid, Header, Image, Segment, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format'

const panes = 
[
	{ menuItem: 'All Events', pane: {key: 'allEvents'} },
	{ menuItem: 'Past Events', pane: {key: 'pastEvents'} },
	{ menuItem: 'Future Events', pane: {key: 'futureEvents'} },
	{ menuItem: 'Hosting', pane: {key: 'hosted'} },
]
  
const UserDetailedEvents = ({ events, eventsLoading, changeTab }) => 
{
	// Grid.Column width = { 4 } i.e if you set width <= 4 then it will align in the same row of the photos as <UserDetailedPhotos />
	// is assigned a width of 12 hence 16-12=4 is still left. If width > 4 then there is not much space there so it will automatically
	// aligned to the new row and take a width of 12.

	return (
		<Grid.Column width = { 12 }>
			<Segment attached loading = { eventsLoading }>

				<Header icon="calendar" content="Events" />
				
				<Tab 
					onTabChange = { (event, data) => changeTab(event, data) } 
					panes = { panes } 
					menu = {{ secondary: true, pointing: true }}
				/>

				<br/>

				<Card.Group itemsPerRow = { 5 }>
				{
					events && events.map(event => (
						<Card as = { Link } to = {`/event/${event.id}`} key = { event.id }>
							<Image src = {`/assets/categoryImages/${event.category}.jpg`} />
							<Card.Content>
								<Card.Header textAlign="center">{event.title}</Card.Header>
								<Card.Meta textAlign="center">
									<div>
									{ 
										event.date ? 
											( 	event.date.toDate !== undefined ? 
													format(event.date.toDate(), 'd MMM yyyy') 
												: 
													null
											) 
										: 
											null
									}
									</div>
									<div>
									{ 
										event.date ? 
											( 	event.date.toDate !== undefined ? 
													format(event.date.toDate(), 'h:mm') 
												: 
													null
											) 
										: 
											null
									}
									</div>
								</Card.Meta>
							</Card.Content>
						</Card>
					))
				}
				</Card.Group>

			</Segment>
		</Grid.Column>
	);
}

export default UserDetailedEvents;