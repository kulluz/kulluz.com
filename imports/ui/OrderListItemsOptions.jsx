import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { OrderListItem } from './OrderListItem';
import { OrderListItemOption } from './OrderListItemOption';

export default function OrderListItemsOptions({drivers}) {
    


    
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
   
        {drivers.map((driver=> {

          return ( 
          <div>
          <OrderListItemOption drivername={driver.drivername} driverimg={driver.driverimg} cvtext={driver.cvtext} />
          <Divider variant="inset" component="li" />
          </div>
          )
        }))}


    </List>
  );
}



 


