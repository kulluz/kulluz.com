import React from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Documents} from '/imports/api/documents';

export const Count = ({query}) => {
	const list = useTracker(() => Documents.find(query).fetch());

	return (
		<div>
			{list ? list.length : 'null'}
		</div>
	);
};
