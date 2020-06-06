import React from 'react'
import { Form, Label } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
// import moment from 'moment';

// This is the path to the css file to style the datapicker. Just import it and it will automatically styles it.
import 'react-datepicker/dist/react-datepicker.css';

// restInput will contains other essential properties such as 'onBlur' so that we can validate the date input when we
// moved our mouse out of the data input box.
const DateInput = ({input: {value, onChange, ...restInput}, width, placeholder, meta: {touched, error}, ...rest}) => 
{
	// console.log(typeof value);
	// console.log(value);
	// console.log(Object.prototype.toString.call(value));

	// ****************************************************  Read this for info  **********************************************************

	// timeStamp --> [object Object] ---> Firestore will return this format if date format selected in firestore is timestamp.
	// Thu Mar 09 2000 00:00:00 GMT+0530 (India Standard Time) --> new Date() --> [object Date] ----> Datepicker will also return this format.
	// 2000-03-22 ---> [object String] ---> when you click you on date input but doesn't change the time and clicked somewhere  

	// *************************************************************************************************************************************
	
	if(value)
	{	
		if(Object.prototype.toString.call(value) === '[object String]')
		value = new Date(value);
		
		else if(Object.prototype.toString.call(value) === '[object Object]' && value.toDate)
		value = value.toDate();
	}

	return (
		<Form.Field error = { touched && !!error } width = { width }>
			<DatePicker
				{ ...rest }
				placeholderText = { placeholder }

				// selected = { value ? new Date(value) : null }
				selected = { value ? (value.toDate ? value.toDate : value) : null }

				onChange = { onChange }
				{ ...restInput }

				// onChangeRaw will execute whenever you will type anything in the data input box. So to prevent this effect we
				// used preventDefault i.e the default functionality of the input box. We can access the calendar just by 
				// clicking on the input box.
				onChangeRaw = { event => event.preventDefault() }
				
			/>
			{ touched && error && <Label basic color='red'>{ error }</Label> }
		</Form.Field>
	);
}

export default DateInput
