import React from 'react';
import {useTracker} from 'meteor/react-meteor-data';
import {Documents} from '../api/documents';
import {DataGrid} from '@mui/x-data-grid';
import {Box} from '@mui/material';

export const List = ({query, model}) => {
	const rows = useTracker(() => Documents.find(query).fetch().map((query) => ({...query, id: query._id})));
	const columns = useTracker(() => model ? Documents.find({type: 'attribute', model}).fetch().map((attribute) => ({
		field: attribute.label,
		headerName: attribute.label,
		width: 150,
		editable: true,
	})) : []);
	return (
		<Box sx={{height: 400, width: '100%'}}>

			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				checkboxSelection
				disableSelectionOnClick
				experimentalFeatures={{newEditingApi: true}}
			/>
			<ul>{rows.map(
				(li) => <li key={li._id}>
					<a href={'#'} target="_blank" rel="noreferrer">{JSON.stringify(li)}</a>
				</li>,
			)}</ul>
		</Box>
	);
};
