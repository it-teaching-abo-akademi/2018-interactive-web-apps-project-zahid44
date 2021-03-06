import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewPortfolio from './components/new_portfolio';
import NewStock from './components/new_stock';
import ViewGraph from './components/view_graph';

// This is entry point of program. This file controls routing of program.
// The url '/' is equivalent to App component.
// The url '/' is equivalent to NewPortfolio component. This component is one for adding new portfolio.
// The url '/' is equivalent to App component. This component is one for adding new stock. 
// The url '/' is equivalent to App component. This component is one for viewing graphs. 
const routing = (
		<Router>
			<Route exact path='/' component={App}/>	
      <Route path='/portfolio/add' component={NewPortfolio}/> 
      <Route path='/stock/add/:index' component={NewStock}/>
			<Route path='/stock/viewgraph/:index' component={ViewGraph}/> 
		</Router>
	);
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
