import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

// This is class for NewPortfolio component in index.js file.
export default class NewStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock_symbol : '',
      share_numbers : 0,
    }

    // Binding functions
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // Controlling event of form inputs
  handleChange = (event) => {
    const input = event.target;
    const value = input.value;
    this.setState({ [input.name] : value });
  }

  //Controlling event of pressing <Add Stock> button
  handleClick = (e) => {
    if(e) e.preventDefault();

    // Getting parameter from url.
    const { params } = this.props.match;
    const portfolio_index = params.index;

    // Getting list of portfolios from localstorage
    var portfolios = JSON.parse(localStorage.getItem('portfolios'));
    var portfolio = portfolios[portfolio_index];

    let term = this.state.stock_symbol;

    const key = 'LRDFD06EG22S6C5F';   // The key for alphavantage service
    const url = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${term}&apikey=${key}`; // The url for alphavantage service
    // Fetching data from above url
    axios.get(url)
    .then(res => {
      // console.log(res.data);
      let stocks_response = _.flattenDeep( Array.from(res.data['Stock Quotes']).map((stock) => [{symbol: stock['1. symbol'], price: stock['2. price'], volume: stock['3. volume'], timestamp: stock['4. timestamp']}]) );
      let stock_price = stocks_response[0].price;
      // Making data stock as json format and adding it to portfolio
      const stock = {
        stock_symbol : this.state.stock_symbol,
        stock_value : stock_price,
        share_numbers : this.state.share_numbers,
      }
      portfolio.stocks.push(stock);
      // Saving updated information of portfolio.
      localStorage.setItem('portfolios', JSON.stringify(portfolios));
      // Redirecting
      this.props.history.push('/');
    })
    .catch(error => console.log(error));
  }

  render() {
    return(
      <div className="container-div">
        <h4></h4>
        <div>
          <label>
            <h5>Stock Symbol : </h5><input type="text" className="form-control" name="stock_symbol" onChange={this.handleChange}/>
          </label>
        </div>
        <div>
          <label>
            <h5>Total number of shares : </h5><input type="number" className="form-control" name="share_numbers" onChange={this.handleChange}/>
          </label>
        </div>
        <button type="submit" className="btn btn-primary" onClick={this.handleClick} >Add Stock</button>
      </div>
    );
  }
}
