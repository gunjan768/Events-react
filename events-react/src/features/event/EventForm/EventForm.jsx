/*global google*/
import React, { Component } from 'react';
import { Form, Segment, Button, Grid, Header } from 'semantic-ui-react';
import { reduxForm, Field } from 'redux-form';
import { withFirestore } from 'react-redux-firebase';
import Script from 'react-load-script';
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { connect } from 'react-redux';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import LoadingComponent from '../../../app/layout/LoadingComponent';

// ownProps will contain id inside params if you are here to update an event ( i.e you came here from EventDetailedPage.jsx page ).
// Else if you are here to create a neww event then params object will be null.
const mapStateToProps = (state, ownProps) => 
{
	let event = {};

	if(state.firestore.ordered.events && state.firestore.ordered.events[0])
	event = state.firestore.ordered.events[0];

	// console.log("Event (EventForm.jsx) : ",event);

	return {
		initialValues: event,
		event,
		loading: state.async.loading
	};
}

const actions = 
{
	createEvent,
	updateEvent,
	cancelToggle
};

const category = 
[
	{ key: 'drinks', text: 'Drinks', value: 'drinks' },
	{ key: 'culture', text: 'Culture', value: 'culture' },
	{ key: 'film', text: 'Film', value: 'film' },
	{ key: 'food', text: 'Food', value: 'food' },
	{ key: 'music', text: 'Music', value: 'music' },
	{ key: 'travel', text: 'Travel', value: 'travel' }
];

// This is the validation part.
const validateForm = combineValidators(
{
	title: isRequired({ message: 'The event title is required' }),
	category: isRequired({ message: 'Please provide a category' }),
	
	description: composeValidators(
		isRequired({ message: 'Please enter a description' }),
		hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 characters' })
	)(),

	city: isRequired('city'),
	venue: isRequired('venue'),
	date: isRequired('date')
});

class EventForm extends Component 
{
	state = 
	{
		cityLatLng: {},
		venueLatLng: {},
		scriptLoaded: false
	};

	async componentDidMount() 
	{
		const { firestore, match } = this.props;

		await firestore.setListener(`events/${match.params.id}`);
	}
	
	async componentWillUnmount() 
	{
		const { firestore, match } = this.props;

		await firestore.unsetListener(`events/${match.params.id}`);
	}

	handleScriptLoaded = () => 
	{
		// console.log("HandleScriptLoaded");
		
		this.setState({ scriptLoaded: true });
	}

	handleCitySelect = selectedCity => 
	{
		geocodeByAddress(selectedCity)
		.then(results => getLatLng(results[0]))
		.then(latlng => 
		{
			this.setState(
			{
				cityLatLng: latlng
			})
		})
		.then(() => 
		{
			// As we are using onSelect by ourself hence we need to use some prop so that we can manually add into the input field.
			// change() function is provided by the redux-form which will let us to apply the change manually in the input field. 
			this.props.change('city', selectedCity);
		})
	}

	handleVenueSelect = selectedVenue => 
	{
		geocodeByAddress(selectedVenue)
		.then(results => getLatLng(results[0]))
		.then(latlng => 
		{
			this.setState(
			{
				venueLatLng: latlng
			})
		})
		.then(() => 
		{
			// As we are using onSelect by ourself hence we need to use some prop so that we can manually add into the input field.
			// change() function is provided by the redux-form which will let us to apply the change manually in the input field. 
			this.props.change('venue', selectedVenue);
		})
	}

	formSubmitHamdler = async values => 
	{
		values.venueLatLng = this.state.venueLatLng;
		
		try
		{
			if(this.props.initialValues.id) 
			{
				if(Object.keys(values.venueLatLng).length === 0)
				values.venueLatLng = this.props.event.venueLatLng
				
				await this.props.updateEvent(values);
				this.props.history.push(`/events/${this.props.initialValues.id}`);	
			} 
			else 
			{
				const createdEventID = await this.props.createEvent(values);
				this.props.history.push(`/events/${createdEventID}`);
			}
		}
		catch(error)
		{
			throw new Error('Error in event creation');
		}
		
	}

	render() 
	{
		const { 
			invalid, 
			submitting, 
			pristine, 
			event, 
			cancelToggle, 
			loading, 
			history, 
			initialValues 
		} = this.props;
	
		return (
			<Grid>

				<Script
					url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBnBTKcVlsrqTToj5u3ur16DvMRaAqJICY&libraries=places"
					onLoad = { this.handleScriptLoaded }
				/>

				{
					this.state.scriptLoaded ?
						<Grid.Column width = { 10 }>
							<Segment>

								<Header sub color="teal" content="Event Details" />
								
								<Form onSubmit = { this.props.handleSubmit(this.formSubmitHamdler) }>
									
									<Field
										name="title"
										type="text"
										component = { TextInput }
										placeholder="Give your event a name"
									/>
									
									<Field
										name="category"
										type="text"
										component = { SelectInput }
										options = { category }
										placeholder="What is your event about"
									/>

									<Field
										name="description"
										type="text"
										component = { TextArea }
										rows = { 3 }
										placeholder="Tell us about your event"
									/>

									<Header sub color="teal" content="Event Location Details" />
								
									<Field
										name="city"
										type="text"
										component = { PlaceInput }

										// By specifying type as 'cities' , PlacesAutocomplete will only display the city.
										options = {{ types: ['(cities)'] }}
										placeholder="Event City"
										onSelect = { this.handleCitySelect }
									/>
								
									<Field
										name="venue"
										type="text"
										component = { PlaceInput }

										// By specifying type as 'cities' , PlacesAutocomplete will only display the venues which are
										// located in the city whose location is given in location prop as a latitude and longitude.
										options = 
										{{ 
											location: new google.maps.LatLng(this.state.cityLatLng),
											radius: 1000,

											// establishment means in general 'venues'. See docs for more info.
											types: ['establishment'] 
										}}
										placeholder="Event Venue"
										onSelect = { this.handleVenueSelect }
									/>
									

									<Field
										name="date"
										type="text"
										component = { DateInput }
										dateFormat="yyyy-MM-dd HH:mm"
										timeFormat="HH:mm"
										showTimeSelect
										showYearDropdown
										showMonthDropdown
										// shouldCloseOnSelect = { false }
										
										// isClearable will let you clear the time by showing you the cross buttom at the top right side.
										isClearable

										// withPortal will show the calendar as a modal.
										// withPortal

										// inline
										placeholder="Date and Time of Event"
									/>

									<Button 
										loading = { loading } 
										disabled = { invalid || submitting || pristine } 
										positive 
										type="submit" > Submit
									</Button>	

									<Button 
										disabled = { loading } 
										onClick = 
										{ 
											initialValues.id ? 
												() => history.push(`/events/${initialValues}`)
											:
												() => history.push('events')
										} 
										type="button" > Cancel
									</Button>
									
									{
										event.id && 
										<Button 
											onClick = { () => cancelToggle(!event.cancelled, event.id) }
											type='button'
											floated='right' 
											color = { event.cancelled ? 'green' : 'red' }
											content = { event.cancelled ? 'Reactivate event': 'Cancel event' }
										/>
									}
									
								</Form>

							</Segment>
						</Grid.Column>
					:
						<LoadingComponent />
				}
			
			</Grid>
		);
	}
}

// enableReinitialize if set to true then after refreshing the page also your form details remain intact.
export default withFirestore(
	connect(mapStateToProps, actions)(
	  	reduxForm({ form: 'eventForm', enableReinitialize: true, validateForm })(EventForm)
	)
);