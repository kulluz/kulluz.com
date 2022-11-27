import * as React from 'react';

import {TextField} from '@mui/material';

export const InputNumber = ({label, onChange}) =>

	<TextField
		label={label }
		variant={'standard'}
		defaultValue="0.00"
		type="number"
		onChange={(event, error) => {
			console.log('changed', event.target.value);
			onChange({value: event.target.value, label});
		}}
	/>;

