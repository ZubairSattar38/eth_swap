import React, { Component } from 'react';
import tokenLogo from '../images/token-logo.png';
import ethLogo from '../images/eth-logo.png';
import BuyToken from './BuyToken.js';
import './App.css';
import SellToken from './SellToken';
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: 'buy'

    }
  }
  render() {
    let content;
    if (this.state.currentForm === 'buy') {
      content = <BuyToken
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
      />
    } else {
      content = <SellToken
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellToken={this.props.sellTokens}
      />
    }
    return (
      <div id="content">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-light" onClick={(event) =>{this.setState({currentForm:'buy'})}}>
            Buy
          </button>
          <span className="text-muted">&lt;&nbsp;&gt;</span>
          <button className="btn btn-light" onClick={(event) =>{this.setState({currentForm:'sell'})}}>
            Sell
          </button>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
