import * as React from 'react';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';

export const InputDateTime = ({label, onChange}) => {
	const [value, setValue] = React.useState(dayjs('2022-04-07'));

	return (

		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DateTimePicker
				renderInput={(props) => <TextField variant="standard" {...props} />}
				label={label}
				value={value}
				onChange={(value) => {
					onChange({value, label});
				}}
			/>
		</LocalizationProvider>

	);
};

