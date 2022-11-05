import React, { useState } from 'react';
import { render } from 'react-dom';

Hello({
  render(){
    console.log(ViewModel.loadComponent({}))
    let cmp = ViewModel.loadComponent({
      hv: 3
    })
    return (
      <div>
        <p>You've pressed the button times.</p>
      </div>
    );
   }
  }
);
