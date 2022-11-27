import * as React from 'react';

import Box from '@mui/material/Box';

import InputTypes from './InputTypes';
import {FormControl} from '@mui/material';

export const Attribute = ({inputType, label, onChange,	options}) => {
	console.log(options);
	const Input = InputTypes[inputType];
	return (
		<Box sx={{minWidth: 120}}>
			<FormControl fullWidth variant={'standard'}>
				<Input { ...{label, onChange, options}}/>
			</FormControl>
		</Box>
	);
};
