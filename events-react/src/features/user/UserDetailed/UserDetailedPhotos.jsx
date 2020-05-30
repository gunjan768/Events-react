import React from 'react';
import { Grid, Header, Image, Segment } from 'semantic-ui-react';

// LazyLoad will let you load the contents properly avoiding all the unproper loading and movement of contents.
import LazyLoad from 'react-lazyload';

const UserDetailedPhotos = ({ photos }) => 
{
	return (
		<Grid.Column width = { 12 }>
			<Segment attached>
				
				<Header icon="image" content="Photos" />

				<Image.Group size="small">
				{
					photos && photos.map(photo => (
						// placeholder is just the dummy image in place of original image until the original image is not loaded successfully.
						<LazyLoad key = { photo.id } height = { 150 } placeholder = { <Image src='/assets/user.png' /> }>
							<Image src = { photo.url } />
						</LazyLoad>
					))
				}

				</Image.Group>

			</Segment>
		</Grid.Column>
	);
}

export default UserDetailedPhotos;