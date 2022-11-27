import * as React from 'react';

import {TextField} from '@mui/material';

export const InputText = ({label, onChange}) =>
	<TextField
		variant="standard"
		label={label}
		defaultValue="InputText"
		type="text"
		inputProps={{'aria-label': 'description'}}
		onChange={(event, error) => {
			onChange({value: event.target.value, label});
		}}
	/>;

