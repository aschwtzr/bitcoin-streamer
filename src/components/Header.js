import React, { useState } from 'react';
import './css/TransactionList.css'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

function Header(props) {
  const [currency, setCurrency] = useState('USD');
  // const inputLabel = React.useRef(null);

  const handleChange = event => {
    setCurrency(event.target.value);
    props.changeHandler(event.target.value);
  };

  const options = props.currencies.map(currency => {
    return (
      <MenuItem value={currency} key={ currency }> {currency} </MenuItem>
    )
  })

  return (
    <div>
      <FormControl>
        <InputLabel id='currency-picker'>Currency</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currency}
          onChange={handleChange}
          >
          { options }
        </Select>
      </FormControl>
    </div>
  );
}

export default Header; 