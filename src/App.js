import React from 'react';
import './App.css';
import { websocket, initSocket } from './util/socket';
import { fetchBTCPrice } from './util/api';
import TransactionList from './components/TransactionList';
import Header from './components/Header'
import TransactionChart from './components/TransactionChart'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: websocket,
      transactions: [],
      conversionRates: undefined,
      selectedCurrKey: undefined,
    };
    this.addTransactionToList = this.addTransactionToList.bind(this);
    this.setCurrency = this.setCurrency.bind(this)
    initSocket(this.addTransactionToList)
  }

  currentCurrency () {
    if (this.state.conversionRates && this.state.selectedCurrKey) {
      return this.state.conversionRates[this.state.selectedCurrKey]
    } else return { last: 0, symbol: ''}
  }

  setCurrency (currency) {
    this.setState({selectedCurrKey: currency})
  }

  addTransactionToList (transaction) {
    const prevTx = this.state.transactions
    const transactions = [ transaction, ...prevTx ]
    this.setState({transactions})
  }

  transactionsList () {
    const lastPrice = this.currentCurrency().last //this.state.conversionRates ? this.state.conversionRates[this.state.selectedCurrKey].last : 0

    const mappedTransactions = this.state.transactions.map(transaction => {
      return { ...transaction, total: transaction.value * lastPrice}
    })
    return (
      <TransactionList 
        rows={mappedTransactions}
        selectedCurrency={this.state.selectedCurrKey}
        lastPrice={ lastPrice }
        symbol={ this.currentCurrency().symbol }
      />
    );
  }

  transactionChart () {
    const transactionChartData = this.state.transactions.map(transaction => {
      return { time: transaction.timestamp, amount: transaction.value}
    });
    return <TransactionChart data={ transactionChartData }/>
  }

  availableCurrencies () {
    return this.state.conversionRates ? 
      Object.keys(this.state.conversionRates) : []
  }

  async componentDidMount() {
    // Load async data.
    fetchBTCPrice().then(res => {
      const conversionRates = res.data
      this.setState({ conversionRates })
      this.setState({ selectedCurrKey: Object.keys(conversionRates)[0]})
    });
  }

  render () {
    return (
      <div className="App">
        <header>
          <Header currencies={ this.availableCurrencies() } changeHandler={ this.setCurrency } />
        </header>
        { this.transactionChart() }
        { this.transactionsList() }
      </div>
    );
  }
}

export default App;
