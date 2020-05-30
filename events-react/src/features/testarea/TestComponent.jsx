import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Script from 'react-load-script';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { incrementAsync, decrementAsync } from './testActions';
import { openModal } from '../modals/modalActions'

const mapStateToProps = state => (
{
	data: state.test.data,
	loading: state.async.loading,
	buttonName: state.async.elementName
})

const actions = 
{
	incrementAsync,
	decrementAsync,
	openModal
};

class TestComponent extends Component 
{
	static defaultProps = 
	{
		center: 
		{
			lat: 59.95,
			lng: 30.33
		},
		zoom: 11
	};


	state = 
	{
		address: '',
		scriptLoaded: false
	};

	handleScriptLoad = () => 
	{
		this.setState({ scriptLoaded: true });
	}

	handleFormSubmit = event => 
	{
		event.preventDefault();

		geocodeByAddress(this.state.address)
		.then(results => getLatLng(results[0]))
		.then(latLng => console.log('Success', latLng))
		.catch(error => console.error('Error', error))
	}

	onChange = address => this.setState({ address });

	render() 
	{
		// const inputProps = 
		// {
		// 	value: this.state.address,
		// 	onChange: this.onChange
		// };

		const { incrementAsync, decrementAsync, data, openModal, loading, buttonName } = this.props;

		return (
			<div>

				<Script
					url='https://maps.googleapis.com/maps/api/js?key=AIzaSyBeGFf-IvUPyRs-QWxYBQDIhWOSplEh6BA&libraries=places'
					onLoad = { this.handleScriptLoad }
				/>

				<h1>Test Area</h1>
				<h3>The answer is: {data}</h3>

				<Button 
					name='increment' 
					loading = { buttonName === 'increment' && loading } 
					onClick={ event => incrementAsync(event.target.name) } 
					color="green" content="Increment" 
				/>

				<Button 
					name='decrement' 
					loading = { buttonName === 'decrement' && loading } 
					onClick = { event => decrementAsync(event.target.name) } 
					color="red" content="Decrement" 
				/>

				<Button onClick = { () => openModal('TestModal', {data: 34}) } color="teal" content="Open Modal" />

				<br /><br />

				{/* {
					this.state.scriptLoaded &&
					<form onSubmit = { this.handleFormSubmit }>
						<PlacesAutocomplete  
							value = { inputProps.value }
							onChange = { inputProps.onChange }
						/>
						<button type="submit">Submit</button>
					</form>
				} */}
			</div>
		);
	}
}

export default connect(mapStateToProps, actions)(TestComponent);