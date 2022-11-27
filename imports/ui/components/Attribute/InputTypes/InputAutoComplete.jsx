import * as React from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useTracker} from 'meteor/react-meteor-data';
import {Documents} from '/imports/api/documents';

export const InputAutoComplete = ({options, label, render, onChange}) => {
	console.log({options});
	const [selected, setSelected] = React.useState('');
	const list = useTracker(() => Documents.find(options).fetch());

	return (

		<FormControl fullWidth variant={'standard'}>
			<InputLabel id="demo-simple-select-label">{label}</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={selected}
				label={label}
				onChange={(event) => {
					const {value} = event.target;
					console.log('onchanged', value);
					setSelected(value);
					onChange({value, label});
				}}
			>
				{ list.map((item) =>	<MenuItem key={`MenuItemSelector${item.name}`} value={item.name}>
					{
						render ?
							render(item) : (
								item.name ?
									item.name :
									JSON.stringify(item)
							)
					}</MenuItem>) }
			</Select>
		</FormControl>

	);
};
