import React from 'react';
import { connect } from 'react-redux';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import { combineValidators, isRequired } from 'revalidate';
import TextInput from '../../../app/common/form/TextInput';
import { registerUser, socialLogin } from '../authActions';
import SocialLogin from '../SocialLogin/SocialLogin';

const actions = 
{
	registerUser,
	socialLogin
};

const mapStateToProps = state =>
{
	return (
	{
		loading: state.async.loading
	});
}

const validate = combineValidators(
{
	displayName: isRequired('displayName'),
	email: isRequired('email'),
	password: isRequired('password')
})

const RegisterForm = ({ registerUser, handleSubmit, error, invalid, submitting, loading }) =>
{
	return (
		<div>
			<Form size="large" onSubmit = { handleSubmit(registerUser) }>
				<Segment>

					<Field
						name="displayName"
						type="text"
						component = { TextInput }
						placeholder="Known As"
					/>

					<Field
						name="email"
						type="text"
						component = { TextInput }
						placeholder="Email"
					/>

					<Field
						name="password"
						type="password"
						component = { TextInput }
						placeholder="Password"
					/>

					<Button 
						loading = { loading } 
						disabled = { invalid || submitting } 
						fluid size="large" 
						color="teal"
					>
						Register
					</Button>

					<Divider horizontal>Or</Divider>

          			<SocialLogin socialLogin = { socialLogin } />

					{ error && <Label basic color='red' style = {{ marginTop: 5 }}>{ error }</Label> }

				</Segment>
			</Form>
		</div>
	);
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'registerForm', validate })(RegisterForm));