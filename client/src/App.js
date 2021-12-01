import React, { Component } from 'react'
import FiDisputeManager from './contracts/FiDisputeManager.json'
import FiDiToken from './contracts/FiDiToken.json'
import getWeb3 from "./getWeb3"
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import Col from 'react-bootstrap/Col'

import Table from 'react-bootstrap/Table'
import DiFiOperationsComponent from './components/DiFiOperationsComponent'
import DisputeBuilderComponent from './components/DisputeBuilderComponent'
import ChallengerComponent from './components/ChallengerComponent'
import JudgeAssignerComponent from './components/JudgeAssignerComponent'
import WinnerComponent from './components/WinnerComponent'
import "./App.css";

class App extends Component {
  state = { storageValue: 0, accounts: null, contract: null, isLoaded: false };

  componentDidMount = async () => {
    console.log('root componentDidMount')
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      this.networkId = await this.web3.eth.net.getId();
      this.disputeManger = new this.web3.eth.Contract(
        FiDisputeManager.abi,
        FiDisputeManager.networks[this.networkId] && FiDisputeManager.networks[this.networkId].address
      );
      this.fiDitoken = new this.web3.eth.Contract(
        FiDiToken.abi,
        FiDiToken.networks[this.networkId] && FiDiToken.networks[this.networkId].address
      );
      this.setState({ isLoaded: true, disputeTable: [] });
      this.startPolling()
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getFiDiTokenBalance = async () => {
    console.log(`FiDi token balance for account ${this.state.activeAddress} is ${await this.fiDitoken.methods.balanceOf(this.state.activeAddress).call()}`)
  }

  startPolling = async () => {
    console.log("poll")
    let response = await fetch("http://localhost:9999/disputes")
    let disputes = await response.json()
    this.setState({ disputeTable: disputes })
    setTimeout(async () => { await this.startPolling() }, 5000)
  }

  render() {
    console.log('root render')
    if (this.state.isLoaded) {
      return (<>
        <Container fluid>
          <Col lg={6}>
            <DiFiOperationsComponent fiDitoken={this.fiDitoken} web3={this.web3} disputeManger={this.disputeManger} />
            <DisputeBuilderComponent fiDitoken={this.fiDitoken} web3={this.web3} disputeManger={this.disputeManger} />
            <ChallengerComponent fiDitoken={this.fiDitoken} web3={this.web3} disputeManger={this.disputeManger} />
            <JudgeAssignerComponent fiDitoken={this.fiDitoken} web3={this.web3} disputeManger={this.disputeManger} />
            <WinnerComponent fiDitoken={this.fiDitoken} web3={this.web3} disputeManger={this.disputeManger} />
          </Col>
        </Container>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Dispute address</th>
              <th>Dispute hash</th>
              <th>Intitiaror address</th>
              <th>Challenger address</th>
              <th>Winner address</th>
            </tr>
          </thead>
          <tbody>
            {this.state.disputeTable.map((dispute) => {
              return (
                <tr key={dispute.id}>
                  <td>{dispute.id}</td>
                  <td>{dispute.address}</td>
                  <td>{dispute.hash}</td>
                  <td>{dispute.initiator}</td>
                  <td>{dispute.challenger}</td>
                  <td>{dispute.winner}</td>
                </tr>
              )
            })
            }

          </tbody>
        </Table>
      </>
      )
    } else {
      return (
        <Container style={{ height: '100%' }} id="cont">
          <Spinner animation="border" id="loader" />
        </Container>
      )
    }
  }
}

export default App;
