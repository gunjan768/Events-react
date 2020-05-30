import React, { useState, useEffect, Fragment } from 'react';
import { Segment, Header, Divider, Grid, Button } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import Dropzone from 'react-dropzone';
// import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { uploadProfileImage, deletePhoto, setMainPhoto } from '../../userActions';

import DropzoneInput from './DropzoneInput';
import CropperInput from './CropperInput';
import UserPhotos from './UserPhotos';

// firestoreConnect is HOC that automatically listens/unListens to provided Cloud Firestore paths using React's Lifecycle hooks. Make sure
// you have required/imported Cloud Firestore, including it's reducer, before attempting to use. This HOC takes a function as a parameter
// and this function should return an array with all the required fields. What you asked in the array will be given to the 'ordered' prop
// of the firestore reducer and will be available with the name you will give to the 'storeAs' prop.
import { firestoreConnect } from 'react-redux-firebase';

const query = ({ auth }) => 
{
	return [
		{
			collection: 'users',
			doc: auth.uid,
			subcollections: [{ collection: 'photos' }],
			storeAs: 'photos'
		}
	];
}

const actions = 
{
	uploadProfileImage,
	deletePhoto,
	setMainPhoto
};

const mapStateToprops = state => 
{
	// console.log("state : ",state);

	return (
	{
		auth: state.firebase.auth,
		profile: state.firebase.profile,
		photos: state.firestore.ordered.photos,
		loading: state.async.loading
	});
}

const PhotosPage = ({ uploadProfileImage, photos, profile, deletePhoto, loading, setMainPhoto }) =>
{
	const [files, setFiles] = useState([]);
	const [image, setImage] = useState(null);

	// console.log("Files : ",files[0] ? files[0].preview : null);
	// console.log("Image : ",image);

	useEffect(() =>
	{
		return () =>
		{
			files.forEach(file => URL.revokeObjectURL(file.preview))
		};

	}, [files])

	const handleUploadImage = async () => 
	{
		try
		{
			await uploadProfileImage(image, files[0].name);

			// let profile = await uploadProfileImage(image, files[0].name);
			// console.log("Profile : ",profile);

			handleCancelCrop();
		}
		catch(error) 
		{
			toastr.error('Oops', error.message);
		}
	}

	const handleDeletePhoto = async photo => 
	{
		try 
		{
			deletePhoto(photo);
		} 
		catch(error) 
		{
			toastr.error('Oops', error.message);
		}
	}

	const handleSetMainPhoto = async photo => 
	{
		try 
		{
			setMainPhoto(photo);
		} 
		catch(error) 
		{
			toastr.error('Oops', error.message);
		} 
	}

	const handleCancelCrop = () => 
	{
		setFiles([]);
		setImage(null)
	}
    
    return (
		<Segment>
			
			<Header dividing size="large" content="Your Photos" />
			
			<Grid>

				{
					// Grid.Row is used to leave one row gap.
				}

				<Grid.Row />

				<Grid.Column width = { 4 } >
					<Header color="teal" sub content="Step 1 - Add Photo" />
					<DropzoneInput setFiles = { setFiles } />
				</Grid.Column>

				<Grid.Column width = { 1 } />

				<Grid.Column width = { 4 }>
					<Header sub color="teal" content="Step 2 - Resize image" />
					{
						files.length && 
						<CropperInput setImage = { setImage } imagePreview = { files[0].preview } />
					}
				</Grid.Column>

				<Grid.Column width = { 1 } />
				
				<Grid.Column width = { 4 }>
					<Header sub color="teal" content="Step 3 - Preview and Upload" />
					{ 
						files.length && 
						(
							<Fragment>
								<div 
									// put the same name as put in the 'preview' prop of the Copper.js in CropperInput.jsx page.
									// className='.img-preview'
									id='img-preview' 
									style = {{ minHeight: '200px', 
									minWidth: '200px', 
									overflow: 'hidden' }} 
								/>
								<Button.Group>
									<Button
										onClick = { handleUploadImage }
										style = {{ width: '100px' }}
										positive
										icon="check"
										loading = { loading }
									/>
									<Button
										onClick = { handleCancelCrop }
										style = {{ width: '100px' }}
										positive
										icon="close"
										disabled = { loading }
									/>
								</Button.Group>
							</Fragment>
						)	
					}
				</Grid.Column>

			</Grid>

			<Divider />

			<UserPhotos 
				photos = { photos } 
				profile = { profile } 
				deletePhoto = { handleDeletePhoto } 
				setMainPhoto = { handleSetMainPhoto }
				loading = { loading }
			/>

		</Segment>
    );
}

export default compose( 
	connect(mapStateToprops, actions), 
	firestoreConnect(auth => query(auth)) 
)(PhotosPage); 