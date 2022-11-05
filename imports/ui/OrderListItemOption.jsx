import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';

import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { ResponsivePie } from '@nivo/pie'


import { LineChart, Line } from 'recharts';
import { Button, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export const OrderListItemOption = ({ setSelected, id, drivername, driverimg, rating, cvtext}) => {

console.log("OrderListItemOption");

    return (
       
            <ListItem alignItems="flex-start"
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={ e => setSelected(id)}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={driverimg} />
                </ListItemAvatar>
                <ListItemText
                    primary={id}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {drivername}
                            </Typography>
                            {cvtext}
                            <img src='/rating.png' style={{width: "100px"}}/>
                        </React.Fragment>
                    }
                />
            </ListItem>
       
    );
};





