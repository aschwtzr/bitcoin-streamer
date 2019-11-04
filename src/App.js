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
    // splice the transactions if the list grows too long
    if (transactions.lenght > 400) {
      transactions.splice(400)
    }
    this.setState({transactions})
  }

  transactionsList () {
    const lastPrice = this.currentCurrency().last

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
    const reducedTransactions = this.state.transactions.reduce((prev, curr) => {
      const minuteMark = curr.timestamp.slice(-5).slice(0, 4)
      console.log(curr.timestamp)
      if (prev[minuteMark]) {
        prev[minuteMark].totalValue += curr.value
        prev[minuteMark].totalTransactions += 1
      } else {
        prev[minuteMark] = {
          timestamp: `${curr.timestamp.slice(0,  curr.timestamp.length - 1)}0`,
          totalValue: curr.value,
          totalTransactions: 1
        }
      }
      return prev
    }, {})

    const transactionChartData = Object.values(reducedTransactions).map(minute => {
      return { time: minute.timestamp, amount: minute.totalValue / minute.totalTransactions}
    });
    console.log(transactionChartData)
    return <TransactionChart data={ transactionChartData }/>
  }

  availableCurrencies () {
    return this.state.conversionRates ? 
      Object.keys(this.state.conversionRates) : []
  }

  async componentDidMount() {
    // load currency ticker
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
        </header>
        { this.transactionChart() }
        <Header currencies={ this.availableCurrencies() } changeHandler={ this.setCurrency } />
        { this.transactionsList() }
      </div>
    );
  }
}

export default App;
