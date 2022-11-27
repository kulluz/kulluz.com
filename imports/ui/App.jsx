
import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Create} from './components/Create.jsx';
import {Grid, Stack} from '@mui/material';
import {List} from './List.jsx';
import {Count} from './components/Count.jsx';
import {InputAutoComplete} from './components/Attribute/InputTypes/InputAutoComplete.jsx';

function TabPanel(props) {
	const {children, value, index, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{p: 3}}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export const App = () => {
	const [model, setModel] = React.useState(null);
	return (<Box>

		<Grid container spacing={2}>
			<Grid item xs={4}>

				<InputAutoComplete options={{type: 'model'}} label={'New'} onChange={({value, label}) => {
					console.log({changedzz: value});
					setModel(value);
				}}/>
				{model ? 	<Create model={model}/> : null}
			</Grid>
			<Grid item xs={8}>
				<Stack>
					<Count query={{type: model}}></Count>
					<List query={{type: model}} model={model}></List>
				</Stack>
			</Grid>
		</Grid>
	</Box>);
};

