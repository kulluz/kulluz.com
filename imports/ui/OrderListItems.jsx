import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { OrderListItem } from './OrderListItem';

export default function OrderListItems({setSelectedItem}) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
   
        <OrderListItem setSelected={setSelectedItem} id="1" start="10:00AM"  end="12:00PM"  duration="2h" operatorlogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/1280px-Volvo_logo.svg.png"/>
        <Divider variant="inset" component="li" />

        <OrderListItem setSelected={setSelectedItem}  id="2" start="1:00AM"  end="9:00PM"  duration="20h" operatorlogo = "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Mack_Trucks_logo.svg/1200px-Mack_Trucks_logo.svg.png"/>
        <Divider variant="inset" component="li" />

        <OrderListItem setSelected={setSelectedItem} id="3" start="7:00AM"  end="10:00AM"  duration="3h" operatorlogo = "https://www.renault-trucks.co.uk/themes/custom/renault/logo-desktop.png"/>
        <Divider variant="inset" component="li" />

        <OrderListItem setSelected={setSelectedItem} id="4" start="3:00AM"  end="11:00AM"  duration="7h" operatorlogo = "/scania.png"/>

    </List>
  );
}



 


