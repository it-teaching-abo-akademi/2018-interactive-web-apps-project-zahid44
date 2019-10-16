import React, { Component } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PortfolioCard from './portfolio_card.js'

class SPMS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolios : [],
    };
  }

  componentDidMount() {
    const portfolios = JSON.parse(localStorage.getItem('portfolios'));
    // Getting portfolios in localstorage of browser.
    this.setState({
      portfolios : portfolios
    });
  }

  render() {
    var portfolios = this.state.portfolios;
    // Checking error during getting portfolios.
    if (portfolios == null) {
      portfolios = [];
    }
    return (
      <div className="container-div">
        // This button is one for adding new portfolio.
        <Button variant="primary" component={Link} href='/portfolio/add' disabled={portfolios.length === 10? true:false}>Add new portfolio</Button>
        <Badge variant="warning" hidden={portfolios.length !==10 ? true:false}>The maximum number of portfolios that can be crated is 10!</Badge>
        // This is component for showing details of portfolio.
        <PortfolioCard/>
      </div>
    )
  }
}

export default SPMS;
