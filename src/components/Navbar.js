import React, { Component } from 'react';
import './App.css';
// import Identicon from 'react-identicons';
// import Identicon from 'identicon.js';
class App extends Component {
 
  render() {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
             ETH Swap
          </a>
          <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-secondary">
                  <small id="account">{this.props.account}</small>
              </small>
          </li>
          {/* {this.props.account ? 
            <img className="ml-2" width='30' height='30' src={`data:img/png;base64,${new Identicon(this.props.account,30).toString()}`}/>   
            :<span></span>} */}
          </ul>
        </nav>
    );
  }
}

export default App;
