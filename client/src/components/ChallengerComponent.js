import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';


class ChallengerComponent extends Component {

    componentDidMount = async () => {
        console.log('componentDidMount')
        console.log(this.props)
        this.fiDitoken = this.props.fiDitoken
        this.disputeManger = this.props.disputeManger
        this.web3 = this.props.web3
    };

    onChallengerAddressChange = async (event) => {
        this.setState({ partyAddress: event.target.value })
    }

    onDisputeAddressChange = async (event) => {
        this.setState({ disputeAddress: event.target.value })
    }

    acceptDispute = async () => {
        await this.disputeManger.methods
            .acceptDispute(this.state.disputeAddress)
            .send({ from: this.state.partyAddress })
    }

    render() {
        return (
            <>
                <Container>
                    <Card>
                        <Card.Body>
                            <Container>
                                <Card.Title>Accept bet</Card.Title>
                            </Container>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Challenger address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onChallengerAddressChange}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dispute address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onDisputeAddressChange}/>
                                </Form.Group>
                                <Button variant="primary" onClick={this.acceptDispute}>Accept</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }
}

export default ChallengerComponent;
