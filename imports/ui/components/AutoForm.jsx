import * as React from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';

import {useTracker} from 'meteor/react-meteor-data';
import {Documents} from '/imports/api/documents';
import {Attribute} from './Attribute';

export const Autoform = ({model, onChange}) => {
	const attributes = useTracker(() => model ? Documents.find({type: 'attribute', model}).fetch() : []);

	return (model ?
		<Box
			component="form"
			sx={{'& > :not(style)': {m: 1}}}
			noValidate
			autoComplete="off">
			{attributes.map((attribute) => <Attribute key={`AutoFormAttribute${attribute._id}`} {...{...attribute, onChange} } />)}
		</Box> : null
	);
};
