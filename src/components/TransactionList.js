import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './css/TransactionList.css'

function TransactionList(props) {
  const formatTotalValue = (value) => {
    const rounded = Math.round(value * 100) / 100
    return rounded
  }

  return (
    <React.Fragment>
      <header className='TableHeader'>Recent Transactions</header>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>BTC</TableCell>
            <TableCell>{props.selectedCurrency}</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.timestamp}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{props.lastPrice}</TableCell>
              <TableCell align="left">{props.symbol}{formatTotalValue(row.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default TransactionList;