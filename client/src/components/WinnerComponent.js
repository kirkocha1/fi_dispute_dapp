import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import FiDispute from '../contracts/FiDispute.json'
import Card from 'react-bootstrap/Card';

class WinnerComponent extends Component {

    componentDidMount = async () => {
        this.fiDitoken = this.props.fiDitoken
        this.disputeManger = this.props.disputeManger
        this.web3 = this.props.web3
    }

    onDisputeAddressChange = async (event) => {
        this.setState({ disputeAddress: event.target.value })
    }

    onJudgeAddressChange = async (event) => {
        this.setState({ judgeAddress: event.target.value })
    }

    onWinnerAddressChange = async (event) => {
        this.setState({ winnerAddress: event.target.value })
    }

    chooseWinner = async () => {
        const dispute = new this.web3.eth.Contract(
            FiDispute.abi,
            this.state.disputeAddress,
            { from: this.state.judgeAddress }
        )
        await dispute.methods
            .chooseWinner(this.state.winnerAddress)
            .send({ from: this.state.judgeAddress })
    }


    render() {
        return (
            <>
                <Container>
                    <Card>
                        <Card.Body>
                            <Container>
                                <Card.Title>Choose winner</Card.Title>
                            </Container>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dispute address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onDisputeAddressChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Judge address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onJudgeAddressChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Winner address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onWinnerAddressChange} />
                                </Form.Group>
                                <Button variant="primary" onClick={this.chooseWinner}>Choose</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }
}

export default WinnerComponent;
