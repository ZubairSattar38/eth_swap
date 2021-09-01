import React, { Component } from 'react';
import Navbar from './Navbar';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Main from './Main';
import './App.css';
class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }
  async loadBlockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethBalance })


    //  Load Token
    const networkId = await web3.eth.net.getId()//  get network Id from metamask
    const tokendata = Token.networks[networkId];
    if (tokendata) {
      //                      Now  connect to the smart contract
      const token = await web3.eth.Contract(Token.abi, tokendata.address);
      this.setState({ token });
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();   // call is used when we fetching the data from blockchain
      if (tokenBalance) {
        this.setState({ tokenBalance: tokenBalance.toString() });
      }
    } else {
      alert("Token Contrack Not deployed to Detected Network ")
    }


    //  Load ETH Swap
    const ethSwapData = EthSwap.networks[networkId]
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }


    this.setState({ loading: false })

  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected.You should consider trying metamask')
    }
  }
  buyTokens = (etherAmount) => {
    console.log("etherAmount :- ", this.state.ethSwap)
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({
        loading: false
      })
    })
    console.log("token Balance :- ", this.state.tokenBalance);
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
          loading: false
        })
      })
    })
    console.log("token Balance :- ", this.state.tokenBalance);
  }
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      token: {},
      loading: true
    }
  }
  render() {
    let content;
    if (this.state.loading) {
      content = <a id='loader' className="text-center"> Loading...</a>
    } else {
      content = <Main ethBalance={this.state.ethBalance} tokenBalance={this.state.tokenBalance} buyTokens={this.buyTokens} sellTokens={this.sellTokens} />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
