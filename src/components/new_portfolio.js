import React, { Component } from 'react';

// This is class for NewPortfolio component in index.js file.
export default class NewPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolio_name : ''
    };

    // Binding functions
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange = (event) => {
    const input = event.target;
    const value = input.value;
    this.setState({ [input.name]: value });
  }

  // This is the function for retrieving event of pressing <Add Portfolio> button
  handleClick = () => {
    // Getting portfolios
    var portfolios = JSON.parse(localStorage.getItem('portfolios'));
    // Checking error
    if (portfolios == null) {
      portfolios = [];
    }
    const portfolio_name = this.state.portfolio_name;
    const stocks = [];
    const protfolio = {
      portfolio_name : portfolio_name,
      stocks : stocks,
    }
    // Adding new portfolio to existing array of portfolios
    portfolios.push(protfolio);
    // Setting data of portfolios into localstorage
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
    // Redirect to home and showing result of adding
    this.props.history.push('/');
  };

  render() {
    return(
      <div className="container-div">
        <label>
          <h5>Portfolio Name : </h5><input className="form-control" name="portfolio_name" onChange={this.handleChange}/>
        </label>
        <button type="submit" className="btn btn-primary" onClick={this.handleClick} >Add Portfolio</button>
      </div>
    );
  }
}
