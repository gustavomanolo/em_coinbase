import React, { Component } from 'react'
import io from 'socket.io-client'

// Import components
import Layout from '../containers/Layout'
import Connection from '../components/Connection'
import ConnectionCB from '../components/ConnectionCB'
import PricesBATable from '../components/PricesBATable'
import MatchPrices from '../components/MatchPrices'

const PRICES_REFRESH_RATE = 50 // Prices refresh rate in milliseconds

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false, // check if is connected to the server
      subscribed: false, // Check if there's an open connection with COINBASE
      currency: 'BTC-USD', // default product subscription
      last_price: '', // last match price
      matches: [], // matches
      prices: [] // level2 channel "bids" and "asks"
    }

    this.socket = null // Socket.io client instance ref to be able to access outside componentDidMount
    this.limitMatches = 1000 // Limit of matches to be displayed in table view
    this.limitPrices = 1000 // Limit of bids and asks to display
    this.pricesM = [] // Array of prices
  }

  componentDidMount() {
    const socket = io()
    socket.on('connect', () => {
      this.setState({
        connected: true
      })
    })

    socket.on('disconnect', () => {
      this.setState({
        connected: false
      })
    })

    /**
     * [functon to handle subscription status to COINBASE]
     *
     * @param   {[String]}  subscription_update  ['subscription_update']
     * @param   {[Boolean]}  data                 [true, false]
     *
     */
    socket.on('subscription_update', (data) => {
      this.setState({
        subscribed: data
      })
    })

    /**
     * [function to handle match data updates received from server]
     *
     * @param   {[String]}  match  ['match']
     * @param   {[Object]}  data   [Contains information about the match]
     *
     */
    socket.on('match', (data) => {
      this.setState({
        last_price: data.price,
        matches:
          this.state.matches.length < this.limitMatches
            ? [data, ...this.state.matches]
            : [data, ...this.state.matches.slice(0, -1)]
      })
    })

    /**
     * [Listen to bids and asks from server]
     *
     * @param   {[String]}  l2update  [l2update description]
     * @param   {[Object]}  data      [data description]
     *
     */
    socket.on('l2update', (data) => {
      // Validate that current data corresponds to the selected currency/product
      if (
        data.product_id == this.state.currency &&
        typeof data.changes !== 'undefined' &&
        Array.isArray(data.changes)
      ) {
        // !IMPORTANT: don't update state directly because is too fast and many state updates turn the app sloqw
        this.pricesM =
          this.pricesM.length < this.limitPrices
            ? [...data.changes, ...this.pricesM]
            : [
                ...data.changes,
                ...this.pricesM.slice(0, data.changes.length * -1)
              ]
      }
    })

    // Create time interval to update prices (bid/ask)
    this.intervalPBA = setInterval(
      () => this.updatePricesBA(),
      PRICES_REFRESH_RATE
    )

    this.socket = socket
  }

  componentWillUnmount() {
    // Clear interval that updates prices (bid/ask)
    clearInterval(this.intervalPBA)
  }

  /**
   * [function to execute every 50 ms to update prices view]
   *
   */
  updatePricesBA() {
    // console.log('-> update prices')
    this.setState({
      prices: this.pricesM
    })
  }

  /**
   * [functiont to update currency and subscrite to a new currency feed if needed]
   *
   * @param   {[Object]}  event  [event object from select element]
   *
   */
  updateCurrencyType = (event) => {
    this.setState(
      {
        currency: event.target.value,
        last_price: '',
        matches: [],
        prices: []
      },
      () => {
        this.socket.emit('currency_change', this.state.currency)
      }
    )
  }

  render() {
    return (
      <Layout>
        <Connection connected={this.state.connected} />

        <div className='p-2'>
          <select
            id='selectCurrency'
            value={this.state.value}
            onChange={this.updateCurrencyType}
          >
            <option value='BTC-USD'>BTC-USD</option>
            <option value='ETH-USD'>ETH-USD</option>
            <option value='XRP-USD'>XRP-USD</option>
            <option value='LTC-USD'>LTC-USD</option>
          </select>

          <ConnectionCB subscribed={this.state.subscribed} />

          <div className='row'>
            <PricesBATable prices={this.state.prices} />
            <MatchPrices
              price={this.state.last_price}
              matches={this.state.matches}
            />
          </div>
        </div>
      </Layout>
    )
  }
}
