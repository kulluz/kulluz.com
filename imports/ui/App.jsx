
import React from 'react';
import {Info} from './Info.jsx';
import {List} from './List.jsx';
import {MapAnimatePath} from './MapAnimatePath.jsx';
import {MapMultiple} from './MapMultiple.jsx';
import {MapRemoteControl} from './MapRemoteControl.jsx';
import {OrderManagement} from './OrderManagement.jsx';
import {PieChart} from './PieChart.jsx';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Grid} from '@mui/material';

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
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{width: '100%'}}>
			<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Dashboard" {...a11yProps(0)} />
					<Tab label="Order Management" {...a11yProps(1)} />
					<Tab label="Order Planning" {...a11yProps(2)} />
					<Tab label="Real Time" {...a11yProps(3)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>

				<Grid container spacing={3}>

					<Grid container spacing={3} >

						<Grid item xs={12} align = "center" justify = "center" alignItems = "center" >

							<img src="/allmap.png" style={{height: '250px'}}></img>

						</Grid>

					</Grid>

					<Grid container spacing={3} align = "center" justify = "center" >

						<Grid item xs={4}>
							<div style={{width: '300px', height: '300px'}}>

								<PieChart data={[
									{
										id: 'Active',
										label: 'Active',
										value: 99,
										color: 'hsl(338, 70%, 50%)',
									},
									{
										id: 'Inactive',
										label: 'Active',
										value: 20,
										color: 'hsl(135, 70%, 50%)',
									},
									{
										id: 'Warning',
										label: 'Active',
										value: 15,
										color: 'hsl(27, 70%, 50%)',
									},
									{
										id: 'Faulty',
										label: 'Active',
										value: 8,
										color: 'hsl(14, 70%, 50%)',
									},
								]} />

								<ul>

									<li>
                  4 trucks for an urgent maintenance
									</li>

									<li>

                  5 trucks  for recommended maintenance
									</li>

									<li>

                  10 trucks needed renewal of insurance within a month
									</li>
								</ul>
							</div>

						</Grid>

						<Grid item xs={4}>
							<div style={{width: '300px', height: '300px'}}>

								<PieChart data={[
									{
										id: 'Finished',
										label: 'Finished',
										value: 1100,
										color: 'hsl(135, 70%, 50%)',
									},
									{
										id: 'Shipped',
										label: 'Shipped',
										value: 666,
										color: 'hsl(27, 70%, 50%)',
									},
									{
										id: 'Waiting',
										label: 'Waiting',
										value: 271,
										color: 'hsl(338, 70%, 50%)',
									},
								]} />
								<ul>

									<li>

                  11000 orders completed

									</li>

									<li>

                  5 orders to assign during next 3 days
									</li>

									<li>

                  2 orders are blocked </li>
								</ul>

							</div>

						</Grid>

						<Grid item xs={4}>

							<div style={{width: '300px', height: '300px'}}>

								<PieChart data={[
									{
										id: 'Occupied',
										label: 'Occupied',
										value: 260,
										color: 'hsl(338, 70%, 50%)',
									},
									{
										id: 'Available',
										label: 'Available',
										value: 140,
										color: 'hsl(135, 70%, 50%)',
									},
									{
										id: 'Need Help',
										label: 'Need Help',
										value: 271,
										color: 'hsl(27, 70%, 50%)',
									},
								]} />

								<ul>
									<li>
                  5 critical issues are reported during the last 3 days
									</li>
								</ul>

							</div>
						</Grid>

					</Grid>

				</Grid>
			</TabPanel>
			<TabPanel value={value} index={1}>

				<OrderManagement />

			</TabPanel>
			<TabPanel value={value} index={2}>

				<MapRemoteControl />

			</TabPanel>

			<TabPanel value={value} index={3}>

				<MapAnimatePath/>

			</TabPanel>
		</Box>
	);
};
