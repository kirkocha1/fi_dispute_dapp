import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

class DisputeBuilderComponent extends Component {

    componentDidMount = async () => {
        this.fiDitoken = this.props.fiDitoken
        this.disputeManger = this.props.disputeManger
        this.web3 = this.props.web3
    };

    createDispute = async() => {
        await this.disputeManger.methods
            .registerDisputeIntention(this.web3.utils.soliditySha3(this.state.disputeCondition), this.state.betAmount)
            .send({ from: this.state.initiatorAddress })
        alert("refund was done successfully")
        this.setState({ })
    }

    onInitiatorAddressChange = async (event) => {
        this.setState({ initiatorAddress: event.target.value })
    }

    onBetAmountChange = async (event) => {
        this.setState({ betAmount: event.target.value })
    }


    onDisputeConditionChange = async (event) => {
        this.setState({ disputeCondition: event.target.value })
    }

    render() {
        return (
            <>
                <Container>
                    <Card>
                        <Card.Body>
                            <Container>
                                <Card.Title>Dispute contract creation</Card.Title>
                            </Container>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Initiator address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onInitiatorAddressChange}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dispute condition</Form.Label>
                                    <Form.Control type="text" placeholder="Example: I will lose 10 kg in one month" onChange={this.onDisputeConditionChange}/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Bet (FiDi tokens)</Form.Label>
                                    <Form.Control type="number" placeholder="FiDi" onChange={this.onBetAmountChange}/>
                                </Form.Group>
                                <Button variant="primary" onClick={this.createDispute}>Create</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }
}

export default DisputeBuilderComponent;
