import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';

export default class StockTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency_exchange_rate : 1
    }
  }

  handleRowDeleteChange(pf_index, index) {
    const portfolios = JSON.parse(localStorage.getItem('portfolios'));
    const selected_portfolio = portfolios[pf_index];
    console.log(selected_portfolio);
    const stocks = selected_portfolio.stocks;
    stocks.splice(index, 1);
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
    window.location.reload();
  }

  render() {
    var stockRow = <tr></tr>
    const pf_index = this.props.pfindex;
    const stocks = this.props.stocklist;
    const selected_currency = this.props.sel_cur;
    const exch_rate = this.props.exch_rate;
    let portfolio_total_value = 0;

    if (stocks.length !== 0) {
      stockRow = stocks.map((stock, index) =>
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{stock.stock_symbol}</td>
          <td>{selected_currency === 'dollar' ? stock.stock_value + '$' : (stock.stock_value*exch_rate).toFixed(4) + '€'}</td>
          <td>{stock.share_numbers}</td>
          <td>{selected_currency === 'dollar' ? stock.stock_value*stock.share_numbers + '$' : (stock.stock_value*exch_rate*stock.share_numbers).toFixed(4) + '€'}</td>
          <td><Button variant="outline-dark" size="sm" onClick={(e) => {if(window.confirm('Delete this stock?')){this.handleRowDeleteChange(pf_index, index, e)};}}>x</Button></td>
        </tr>
      );
      for (var i=0; i<stocks.length; i++) {
        portfolio_total_value = portfolio_total_value + parseFloat(stocks[i].stock_value);
      }
    }
    return(
      <div>
      <Table striped bordered hover style={{marginTop:'10px'}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Stock Symbol</th>
            <th>Stock Value</th>
            <th>Stock Quantity</th>
            <th>Total Value</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {stockRow}
        </tbody>
      </Table>
      <h6>Total value of portfolio : {selected_currency === 'dollar' ? portfolio_total_value + '$' : (portfolio_total_value*exch_rate).toFixed(4) + '€'}</h6>
      </div>
    );
  }
}
