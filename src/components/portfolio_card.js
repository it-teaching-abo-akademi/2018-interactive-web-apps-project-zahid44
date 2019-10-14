import React, { Component } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import StockTableRow from './stock_table_row.js';
import axios from 'axios';
import _ from 'lodash';

export default class PortfolioCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected_currency : [],
        currency_exchange_rate : 1,
        portfolios : [],
    }
  }

  componentDidMount() {
    var portfolios = JSON.parse(localStorage.getItem('portfolios'));
    if (portfolios == null) {
      portfolios = [];
    } else {
      for(var i=0; i<portfolios.length; i++) {
        this.state.selected_currency.push('dollar');
      }
    }
    this.setState({
      portfolios : portfolios
    });

    const key = 'LRDFD06EG22S6C5F';
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${key}`;
    axios.get(url)
    .then(res => {
      // console.log(res.data);
      let currency_exchange_rate = res.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
      this.setState({
        currency_exchange_rate : currency_exchange_rate
      });
    })
    .catch(error => console.log(error));
  }

  onCurrencyChange(index, event) {
    let sca = this.state.selected_currency;
    sca[index] = event.target.value;
    this.setState({
      selected_currency : sca,
    });
  }

  onPortfolioDelete(index) {
    const portfolios = this.state.portfolios;
    const new_pfs = portfolios.splice(index, 1);
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
    window.location.reload();
  }

  onAddStock(index) {
    document.location.href = '/stock/add/' + index;
  }

  onViewGraph(index) {
    document.location.href = '/stock/viewgraph/' + index;
  }

  render() {
    const portfolios = this.state.portfolios;
    const selected_currency = this.state.selected_currency;
    const currency_exchange_rate = this.state.currency_exchange_rate;

    var pf_cards = <span>There is no portfolio for displaying.</span>
    if (portfolios.length !== 0) {
      pf_cards = portfolios.map((portfolio, index) =>
      <Col md={6} key={index} style={{marginTop: '20px'}}>
        <Card>
          <Card.Body>
            <Card.Title>{portfolio.portfolio_name}</Card.Title>
            <Row style={{marginTop:'10px'}}>
              <Col md={{ span: 7, offset: 1 }}>
                <input type="radio" name={portfolio.portfolio_name} value="dollar" onChange={(e) => this.onCurrencyChange(index, e)} checked={this.state.selected_currency[index] === "dollar"}/>Dollar
                <input type="radio" name={portfolio.portfolio_name} value="euro" onChange={(e) => this.onCurrencyChange(index, e)} checked={this.state.selected_currency[index] === "euro"} style={{marginLeft:'20px'}}/>Euro
              </Col>
            </Row>
            <StockTableRow pfindex={index} stocklist={portfolio.stocks} sel_cur={selected_currency[index]} exch_rate={currency_exchange_rate}/>
            <Row style={{marginTop:'20px'}}>
              <Col md={{ span: 2, offset:1 }}>
                <Button variant="outline-primary" size="sm" onClick={(e) => this.onAddStock(index, e)}>Add Stock</Button>
              </Col>
              <Col md={{ span: 2 }}>
                <Button variant="outline-primary" size="sm" onClick={(e) => this.onViewGraph(index, e)}>View Graph</Button>
              </Col>
              <Col md={{ span: 3, offset: 4 }}>
                <Button variant="outline-danger" onClick={(e) => this.onPortfolioDelete(index, e)}>Delete</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    )};

    return(
      <Row style={{marginTop: '20px'}}>
        {pf_cards}
      </Row>
    );
  }
}
