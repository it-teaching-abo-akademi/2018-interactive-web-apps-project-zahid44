import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Row, Col, Badge, Button } from 'react-bootstrap';
import axios from 'axios';

// This is class for showing graph of selected portfolio
export default class ViewGraph extends Component {
  constructor(props) {
    super(props);
    // Getting date of today
    var today = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
    this.state = {
      data:{},
      start_date : today,
      end_date : today,
      selected_stocks : [],
      portfolios : []
    }
    // Binding functions
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    // Getting parameters from url
    const { params } = this.props.match;
    const portfolio_index = params.index;

    // Getting list of portfolios from localstorage
    var portfolios = JSON.parse(localStorage.getItem('portfolios'));
    if (portfolios == null) {
      portfolios = [];
    } else {
      var temp_stocks = portfolios[portfolio_index].stocks;
      if (temp_stocks.length !== 0) {
        for (var i=0; i<temp_stocks.length; i++) {
          // getting list of selected stocks in one portfolio
          this.state.selected_stocks.push(temp_stocks[i].stock_symbol);
        }
      }
    }
    this.setState({
      portfolios : portfolios
    });

    const key = 'LRDFD06EG22S6C5F';  //Api key
    let selected_stocks = this.state.selected_stocks;
    let datasets = [];
    // Getting time series data on each selected stock from serivce
    for (var i=0; i<selected_stocks.length; i++) {
      const stocksymbol = selected_stocks[i]
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stocksymbol}&apikey=${key}`;
      axios.get(url)
      .then(res => {
        const valuation = res.data['Time Series (Daily)'];
        let dates = [];
        let values = [];
        for(let key in valuation) {
          dates.push(key);
          values.push(valuation[key]['4. close']);
        }

        // Making graph data for each graph of selectd stock
        let element_datasets = {
          label : stocksymbol,
          data : values,
          backgroundColor : '#'+(Math.random()*0xFFFFFF<<0).toString(16) + "33"
        }

        datasets.push(element_datasets);

        // Updating state for drawing graph
        this.setState({
          data : {
            labels : dates,
            datasets : datasets
          }
        });
      })
      .catch(error => console.log(error));
    }
  }

  // Controlling event for changing start date and end date in graph window
  handleDateChange(event) {
    const input = event.target;

    const today = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
    var start_date = this.state.start_date;
    var end_date = this.state.end_date;
    if (input.name === 'start_date') {
      start_date = input.value;
    } else if (input.name === 'end_date') {
      end_date = input.value;
    }
    // Checking error related with inserting date
    if (start_date > end_date) {
      alert("Start date is bigger than end date");
    } else if ((start_date > today) || (end_date > today)) {
      alert("Start date or End date is bigger than today");
    } else {
      this.setState({
        [event.target.name] : event.target.value
      });
    }
  }
  // Controlling event for selecting stocks that must be displayed on graph
  handleCheckboxChange(event) {
    let selected_stocks = this.state.selected_stocks;
    let selected_stock_symbol = event.target.value;

    if (event.target.checked) {
      selected_stocks.push(selected_stock_symbol);
    } else {
      let arr_index = selected_stocks.indexOf(selected_stock_symbol);
      selected_stocks.splice(arr_index, 1);
    }
    this.setState({
      selected_stocks : selected_stocks
    });
    console.log(this.state.selected_stocks);
  }

  // Controlling event for pressing Update View button.
  // When pressing this button, graphs are redrawed with updated data
  handleButtonClick() {
    const key = 'LRDFD06EG22S6C5F';
    let selected_stocks = this.state.selected_stocks;

    let start_date = this.state.start_date;
    let end_date = this.state.end_date;

    let datasets = [];
    // When press button, this fetch data with updated data on each selected stocks from api
    for (var i=0; i<selected_stocks.length; i++) {
      const stocksymbol = selected_stocks[i]
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stocksymbol}&apikey=${key}`;
      axios.get(url)
      .then(res => {
        const valuation = res.data['Time Series (Daily)'];
        let dates = [];
        let values = [];
        for(let key in valuation) {
          if ((start_date <= key) && (key <= end_date)) {
            dates.push(key);
            values.push(valuation[key]['4. close']);
          }
        }
        // Remaking data of stocks for drawing graph
        let element_datasets = {
          label : stocksymbol,
          data : values,
          backgroundColor : '#'+(Math.random()*0xFFFFFF<<0).toString(16) + "33"
        }

        datasets.push(element_datasets);

        this.setState({
          data : {
            labels : dates,
            datasets : datasets
          }
        });
      })
      .catch(error => console.log(error));
    }
  }

  render() {

    const { params } = this.props.match;
    const portfolio_index = params.index;

    var portfolios = this.state.portfolios;

    let stockCheckboxes = <div></div>;

    var portfolio = null;
    if (portfolios.length !== 0) {
      portfolio = portfolios[portfolio_index];
      const stocks = portfolio.stocks;
      if (stocks.length !== 0) {
        // Getting checkboxes of selected stocks
        stockCheckboxes = stocks.map((stock, index) =>
          <div key={index} style={{marginLeft:'30px'}}>
            <input type="checkbox" onChange={this.handleCheckboxChange} value={stock.stock_symbol} checked={this.state.selected_stocks.includes(stock.stock_symbol)}></input>
            <Badge variant="light"><h5>{stock.stock_symbol}</h5></Badge>
          </div>
        );
      }
    }

    return(
      <div className="container-div">
        <div>
          <h3>{portfolio !== null ? portfolio.portfolio_name : 'Unknown Name'}</h3>
        </div>
        <Row>
          <Col md={{ span: 9 }}>
            <Line options={{ responsive:true }} data={ this.state.data }/>
          </Col>
          <Col md={{ span: 3 }} style={{marginTop : '70px'}}>
            <h3>Stocks in {portfolio !== null ? portfolio.portfolio_name : 'Unknown Name'}</h3>
            {stockCheckboxes}
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col md={{ span: 2, offset: 1 }}>
            <label><h5>Start Date</h5></label>
            <input type="date" onChange={this.handleDateChange} className="form-control" name="start_date" value={this.state.start_date}/>
          </Col>
          <Col md={{ span: 2, offset: 1 }}>
            <label><h5>End Date</h5></label>
            <input type="date" onChange={this.handleDateChange} className="form-control" name="end_date" value={this.state.end_date}/>
          </Col>
          <Col md={{ span: 2, offset: 4 }}>
            <Button variant="primary" onClick={this.handleButtonClick} size="lg">Update Graph</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
