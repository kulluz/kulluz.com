
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import {TextField} from '@mui/material';

export const InputSelect = ({options, label, onChange}) => {
	const [value, setValue] = React.useState(null);
	console.log("InputSelect", options);
	return (

		<TextField
			select
			variant="standard"
			id="demo-simple-select"
			value={value}
			onChange={(event, error) => {
				console.log('changed', event.target.value);
				setValue(event.target.value);
				onChange({value: event.target.value, label});
			}}
			label={label}
			options={[]}
		>
			{options.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</TextField>

	);
};
