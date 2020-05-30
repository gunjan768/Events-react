import React from 'react';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { login, socialLogin } from '../authActions'
import SocialLogin from '../SocialLogin/SocialLogin'


const actions = 
{
	login,
	socialLogin
};

const mapStateToProps = state =>
{
	return (
	{
		loading: state.async.loading
	});
}

// handleSubmit() is a function of ReduxForm and it will automatically pass the value property of every inputs. You can access them 
// by their respective name property.
const LoginForm = ({login, handleSubmit, error, socialLogin, loading }) => 
{
	const loginUserHandler = creds =>
	{
		// As login() action creator is used for async operation so it will return function instead of action. If it returns an
		// action (i.e when used for sync operation) then it will automatically dispatch the action without using dispatch
		// function. As it is used for async, so it returns function which contains dispatch function hence whatever action we
		// want to dispatch we have to use dispatch function. The function which was returned instead of an action is executed
		// automatically ( but remember in Burger project , to run that function we need to use dispatch function ). 

		// loginUser will be assigned a promise (async function) which is returned from the action creator. Inside that promise
		// if return statement is there then promise will get resolved with a value hence it will be resolved but without any
		// value. If throwed an error inside catch block then it rejects the promise.
		login(creds);

		// const loginUser = login(creds);
		// console.log("LoginUser : ",loginUser);
	}
	
	return (
		<Form size="large" onSubmit = { handleSubmit(loginUserHandler) }>
			<Segment>
				
				<Field
					name="email"
					component = { TextInput }
					type="text"
					placeholder="Email Address"
				/>
				
				<Field
					name="password"
					component = { TextInput }
					type="password"
					placeholder="password"
				/>

				<Button loading = { loading } fluid size="large" color="teal">Login</Button>

				{ error && <Label basic color='red' style = {{ marginTop: 5 }}>{ error }</Label> }

				<Divider horizontal>Or</Divider>

        		<SocialLogin socialLogin = { socialLogin }/>

			</Segment>
		</Form>
	);
}

export default connect(mapStateToProps, actions)(reduxForm({form: 'loginForm'})(LoginForm));