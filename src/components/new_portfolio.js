import React, { Component } from 'react';

export default class NewPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolio_name : ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange = (event) => {
    const input = event.target;
    const value = input.value;
    this.setState({ [input.name]: value });
  }

  handleClick = () => {
    var portfolios = JSON.parse(localStorage.getItem('portfolios'));
    if (portfolios == null) {
      portfolios = [];
    }
    const portfolio_name = this.state.portfolio_name;
    const stocks = [];
    const protfolio = {
      portfolio_name : portfolio_name,
      stocks : stocks,
    }
    portfolios.push(protfolio);
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
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
