import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import FiDispute from '../contracts/FiDispute.json'
import Card from 'react-bootstrap/Card';


class JudgeAssignerComponent extends Component {

    componentDidMount = async () => {
        this.fiDitoken = this.props.fiDitoken
        this.disputeManger = this.props.disputeManger
        this.web3 = this.props.web3
    };

    onPartyAddressChange = async (event) => {
        this.setState({ partyAddress: event.target.value })
    }

    onDisputeAddressChange = async (event) => {
        this.setState({ disputeAddress: event.target.value })
    }

    onJudgeCandidateAddressChange = async (event) => {
        this.setState({ judgeCandidate: event.target.value })
    }

    assignJudge = async () => {
        const dispute = new this.web3.eth.Contract(
            FiDispute.abi,
            this.state.disputeAddress,
            { from: this.state.partyAddress }
        )
        await dispute.methods
            .assignJudge(this.state.judgeCandidate)
            .send({ from: this.state.partyAddress })

    }

    render() {
        return (
            <>
                <Container>
                    <Card>
                        <Card.Body>
                            <Container>
                                <Card.Title>Offer judge</Card.Title>
                            </Container>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dispute address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onDisputeAddressChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dispute party address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onPartyAddressChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Judge candidate address</Form.Label>
                                    <Form.Control type="text" placeholder="Valid Ethereum address" onChange={this.onJudgeCandidateAddressChange} />
                                </Form.Group>
                                <Button variant="primary" onClick={this.assignJudge}>Offer</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }
}

export default JudgeAssignerComponent;
