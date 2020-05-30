import React from 'react';
import { Grid, Header, Icon, Item, List, Segment } from 'semantic-ui-react';
import format from 'date-fns/format';

const UserDetailedDescription = ({ profile }) => 
{
	return (
		<Grid.Column width = { 12 }>
			<Segment>
				
				<Grid columns = { 2 }>
					
					<Grid.Column width = { 10 }>
						<Header icon="smile" content = { `About ${profile.displayName }`} />
						<p>I am a: <strong>{ profile.occupation || 'tbn' }</strong></p>
						<p>Originally from <strong>{ profile.origin || 'tbn' }</strong></p>
						<p>Member Since : {' '} 
							<strong>
							{ 
								profile.createdAt && profile.createdAt.toDate && 
								format(profile.createdAt.toDate(), 'd MMM yyyy') 
							}
							</strong>
						</p>
						<p>Description of user</p>
					</Grid.Column>

					<Grid.Column width = { 6 }>
						<Header icon="heart outline" content="Interests" color="orange"/>
						{
							profile.interests ?
								<List>
								{
									profile.interests && profile.interests.map((interest, ind) => (
										<Item key = { ind }>
											<Icon name="heart" />
											<Item.Content>{ interest }</Item.Content>
										</Item>
									))
								}
								</List>
							: 
								<p>No interests</p>
						}
					</Grid.Column>

				</Grid>

			</Segment>
		</Grid.Column>
	);
}

export default UserDetailedDescription;
