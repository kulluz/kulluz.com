import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';

import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { ResponsivePie } from '@nivo/pie'


import { LineChart, Line } from 'recharts';
import { OrderListItem } from './OrderListItem';
import Button from '@mui/material/Button';
import OrderListItems from './OrderListItems';
import Grid from '@mui/material/Grid'; // Grid version 1
import OrderListItemsOptions from './OrderListItemsOptions';




export const OrderManagement = ({ data, fill }) => {
    console.log(data, fill);
    const [selected, setSelected] = useState(null);
    const [searched, setSearched] = useState(false);
    
    const setSelectedItem = (id) => setSelected(id);


    return (
        <div >



        <div >
                <input placeholder='From' />
                <input placeholder='To' />
                <input placeholder='Start Date' />
                <input placeholder='Weight' />

                <select >
                <option>Material</option>

                    <option>Sand</option>
                    <option>Rocks</option>
                    <option>Hemp</option>
                    <option>Asphalt</option>
                </select>
    

                <Button variant="contained" style={{marginLeft: "20px"}} onClick={()=> setSearched(true)}>Search</Button>
            <br/>
            <br/>
            
            </div>


   
             
                {
                    searched ? 

                    (
                        <Grid container spacing={3}>

                        <Grid item xs={4}>
                           
                            <OrderListItems setSelectedItem={setSelectedItem} />
        
                        
                        </Grid>

                    <Grid item xs={8}>
                       
    
                        <div className='selectedorder'>
    
                            <img src="/dirs.png" style={{height: "300px"}}></img>
    
                            <OrderListItemsOptions drivers = {
                                [
                                    {
                                        drivername: "jackjoe",
                                        driverimg: "/1.jpeg",
                                        cvtext: " Good driver with 10+ years of experience will fly there now"
                                    },
                                    {
                                        drivername: "jane bro",
                                        driverimg: "/2.jpeg",
                                        cvtext: " Excellent one will not crash the machine"
                                    },
                                    {
                                        drivername: "Tummy Tumm",
                                        driverimg: "/3.jpeg",
                                        cvtext: " Super cool one"
                                    }
                                ]
                            }/>
    
                            
                         </div>
                       
                    </Grid>
                    </Grid>
                ) : <p>Please select source and destination</p>
                }
               
        </div>
    );
};

