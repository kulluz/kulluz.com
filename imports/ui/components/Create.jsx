import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import {Autoform} from './AutoForm';
import {InputAutoComplete} from './Attribute/InputTypes/InputAutoComplete';
import {Alert, Button, FormControl, Grid} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {Stack} from '@mui/system';
import {Documents} from '/imports/api/documents';

export const Create = ({model}) => {
	const [success, setSuccess] = React.useState(null);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(false);

	const [instance, setInstance] = React.useState({type: model});
	useEffect(() => {
		console.log("changeola")
		setInstance({type: model});
	}, [model]);
	console.log({model, instance});
	return (
		<Box sx={{width: '100%', 'margin-top': 49}}>

			<Autoform model={model} onChange={({value, label}) => {
				console.log('changed already', label, value);
				instance[label] = value;
				setInstance(instance);
			}}/>

			<Grid m={2}>
				<Grid>
					{ success ? <Alert severity="success"sx>success</Alert> : null}
					{ error ? <Alert severity="success"sx>error</Alert> : null}
					{loading ? 					<Alert severity="success"sx>loading</Alert> : null}
				</Grid>
				<Grid>
					<Stack direction="row" justifyContent="end">
						<Button variant={'outlined'} endIcon={<PostAddIcon />} onClick={(event) => {
							setSuccess(null);
							setError(null);
							setLoading(true);
							console.log('insert', instance);
							Documents.insert(instance, (error, inserted) => {
								console.log(inserted, error);
								setLoading(false);
								if (error) {
									setError({error});
								} else {
									setSuccess({inserted});
								}
							});
						}}>Create</Button>
					</Stack>
				</Grid>

			</Grid>
		</Box>
	);
};
