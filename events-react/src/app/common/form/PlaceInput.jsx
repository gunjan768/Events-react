import React, { Component } from 'react';
import { Form, Label, Segment, List } from 'semantic-ui-react';
// import Script from 'react-load-script';
import PlacesAutocomplete from 'react-places-autocomplete';
import Script from 'react-load-script'

const styles = 
{
	autocompleteContainer: 
	{
		zIndex: 1000,
		marginTop: 0
    }
}

class PlaceInput extends Component 
{
	state = 
	{
		scriptLoaded: false
	};

	handleScriptLoaded = () => this.setState({ scriptLoaded: true });

	render() 
	{
		const { input: { onBlur, value, onChange }, width, onSelect, placeholder, options, 
				meta: { touched, error } } = this.props;

		return (	
			<div>

				<Script												
					url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBnBTKcVlsrqTToj5u3ur16DvMRaAqJICY&libraries=places"
					onLoad = { this.handleScriptLoaded }
				/>

				{ 
					this.state.scriptLoaded && 
						<PlacesAutocomplete
							value = { value }
							onChange = { onChange }
							searchOptions = { options }
							
							// Here we need 'onSelect' prop because we need to handle the onSelect by ourself don't want PlacesAutocomplete.
							onSelect = { onSelect }
							styles = { styles }
						>
							{
								({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
								{
									return (
										<Form.Field error = { touched && !!error } with = { width }>
										
											<input 
												placeholder = { placeholder }
												{ ...getInputProps({placeholder, onBlur}) }
											/>

											{ touched && error && <Label basic color='red'>{ error }</Label> }

											{ 
												suggestions.length && (
													<Segment>

														{ loading && <div>loading...</div> }
														
														<List selection>
															{ 
																suggestions.map(suggestion => (
																	<List.Item { ...getSuggestionItemProps(suggestion) }>
																		<List.Header>
																			{ suggestion.formattedSuggestion.mainText }
																		</List.Header>
																		<List.Description>
																			{ suggestion.formattedSuggestion.secondaryText }
																		</List.Description>
																	</List.Item>
																))
															}
														</List>

													</Segment>
												)
											}

										</Form.Field>
									);
								}
							}

						</PlacesAutocomplete>
				}
				
			</div>
		);
	}
}

export default PlaceInput;