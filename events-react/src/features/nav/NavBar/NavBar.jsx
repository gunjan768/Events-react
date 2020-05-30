import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions';
import { signOutUser } from '../../auth/authActions';

// Use HOC withFirebase so that we can get all the functionalities related to the firebse like logout() function. All these functionalities
// will get attached to the props i.e you can them by props.property_name.
import { withFirebase } from 'react-redux-firebase';

const actions = 
{
	openModal,
	signOutUser
};

const mapStateToProps = state =>
{	
	// console.log("state (NavBar.jsx) : ", state);

	return (
	{
		auth: state.firebase.auth,
		profile: state.firebase.profile
	});
}

class NavBar extends Component 
{
	handleSignIn = () => 
	{
		this.props.openModal('LoginModal');
		
		// let openModal = this.props.openModal('LoginModal');
		// console.log("OpenModal : ",openModal);
	}

	handleRegister = () => 
	{
		this.props.openModal('RegisterModal');
	}

	handleSignOut = () => 
	{
		// console.log("Props : ",this.props);

		this.props.firebase.logout();
		this.props.signOutUser();

		this.props.history.push('/');
	}

	render() 
	{
		const { auth, profile } = this.props;
		const authenticated = auth.isLoaded && !auth.isEmpty;
		
		return (
			<Menu inverted fixed="top">
				<Container>

					<Menu.Item as = { Link } to="/" header><img src="/assets/logo.png" alt="logo" />Re-vents</Menu.Item>
					<Menu.Item as = { NavLink } to="/events" name="Events" />
					<Menu.Item as = { NavLink } to="/test" name="Test" />
					
					{ authenticated && <Menu.Item as = { NavLink } to="/people" name="People" /> }

					{
						authenticated &&
							<Menu.Item>
								<Button
									as = { Link }
									to="/createEvent"
									floated="right"
									positive
									inverted
									content="Create Event"
								/>
							</Menu.Item>
					}

					{
						authenticated ? 
							<SignedInMenu auth = { auth } profile = { profile } signOut = { this.handleSignOut } />
						: 
							<SignedOutMenu signIn = { this.handleSignIn } register = { this.handleRegister } />
					}

				</Container>
			</Menu>
		);
	}
}

export default withRouter(withFirebase(connect(mapStateToProps, actions)(NavBar)));