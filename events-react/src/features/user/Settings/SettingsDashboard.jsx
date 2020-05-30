import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SettingsNav from './SettingsNav';
import BasicPage from './BasicPage';
import AboutPage from './AboutPage';
import PhotosPage from './Photos/PhotosPage';
import AccountPage from './AccountPage';
import { updatePassword } from '../../auth/authActions';
import { updateProfile } from '../userActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const actions = 
{
	updatePassword,
	updateProfile
};

const mapStateToProps = state => 
{
	// console.log("settingDashboard : ",state);

	return (
	{
		// providerId will tell you that which type of login method you have used whether it is 'password' , 'facebook.com', 'google.com'
		// ... etc.
		providerId: state.firebase.auth.providerData[0].providerId,
		requesting: state.firebase.requested,
		user: state.firebase.profile
	});
}

const SettingsDashboard = ({ updatePassword, providerId, user, updateProfile, requesting }) =>  
{
	const loading = Object.values(requesting).some(a => a === true);

	if(loading && user)
	return <LoadingComponent />;

	return (
		<Grid>
			
			<Grid.Column width = { 12 }>

				<Switch>
					<Redirect exact from="/settings" to="/settings/basic" />

					<Route
						path="/settings/basic"
						render = { () => <BasicPage initialValues = { user } updateProfile = { updateProfile } />}
					/>
					<Route
						path="/settings/about"
						render = { () => <AboutPage initialValues = { user } updateProfile = { updateProfile } />}
					/>

					<Route path="/settings/photos" component = { PhotosPage } />

					<Route
						path="/settings/account"
						render = { () => <AccountPage updatePassword = { updatePassword } providerId ={ providerId } />}
					/>
				</Switch>

			</Grid.Column>

			<Grid.Column width = { 4 }>
				<SettingsNav />
			</Grid.Column>

		</Grid>
	);
}
	
export default connect(mapStateToProps, actions)(SettingsDashboard);