import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';


class DiFiOperationsComponent extends Component {

    componentDidMount = async () => {
        this.fiDitoken = this.props.fiDitoken
        this.disputeManger = this.props.disputeManger
        this.web3 = this.props.web3
    };

    buyFiDiToken = async () => {
        await this.web3.eth.sendTransaction({
            from: this.state.recepientAddress,
            to: this.disputeManger.options.address,
            value: this.state.tokenToBuy
        })
        this.setState({ tokenToBuy: "" })
    }

    giveAllowanceToDisputeManager = async () => {
        await this.fiDitoken.methods.approve(this.disputeManger.options.address, this.state.allowanceAmount).send({ from: this.state.recepientAddress })
        this.setState({ allowanceAmount: "" })
    }

    refundFiDiTokens = async () => {
        let res = await this.disputeManger.methods
            .refund(this.state.refundValue)
            .send({ from: this.state.recepientAddress })
        alert("refund was done successfully")
        this.setState({ refundValue: 0 })
    }

    getFiDiTokenBalance = async () => {
        console.log(`FiDi token balance for account ${this.state.recepientAddress} is ${await this.fiDitoken.methods.balanceOf(this.state.recepientAddress).call()}`)
    }

    onTokenToBuyChange = async (event) => {
        this.setState({ tokenToBuy: event.target.value })
    }

    onRecepientAddressChange = async (event) => {
        this.setState({ recepientAddress: event.target.value })
    }

    onAllowanceAmountChange = async (event) => {
        this.setState({ allowanceAmount: event.target.value })
    }


    onAllowanceAddressChange = async (event) => {
        this.setState({ allowanceAddress: event.target.value })
    }

    onRefundChange = async (event) => {
        this.setState({ refundValue: event.target.value })
    }

    onRefundAddressChange = async (event) => {
        this.setState({ refundAddress: event.target.value })
    }

    render() {
        return (
            <>
                <Container>
                    <Card>
                        <Card.Body>
                            <Container>
                                <Card.Title>DiFi Token Operations (ERC20 Token)</Card.Title>
                            </Container>


                            <Row style={{ margin: '0.2rem' }} >
                                <InputGroup >


                                    <Col sm={8} style={{ margin: '0.2rem' }}>
                                        <FormControl onChange={this.onRecepientAddressChange}
                                            placeholder="Recipient's address"
                                            aria-describedby="basic-addon2"
                                        />
                                    </Col>
                                    <Col style={{ margin: '0.2rem' }}>
                                        <FormControl onChange={this.onTokenToBuyChange}
                                            placeholder="Wei"
                                            aria-describedby="basic-addon2"
                                        />
                                    </Col>
                                    <Col style={{ margin: '0.2rem' }}>
                                        <Button variant="outline-secondary" id="button-addon2" onClick={this.buyFiDiToken}>Buy</Button>
                                    </Col>

                                </InputGroup>
                            </Row>
                            <Row style={{ margin: '0.2rem' }}>
                                <InputGroup >


                                    <Col sm={8} style={{ margin: '0.2rem' }}>
                                        <FormControl onChange={this.onRefundAddressChange}
                                            placeholder="Refund address"
                                            aria-describedby="basic-addon2"
                                        />
                                    </Col>
                                    <Col style={{ margin: '0.2rem' }}>
                                        <FormControl onChange={this.onRefundChange}
                                            placeholder="FiDi"
                                            aria-describedby="basic-addon2"
                                        />
                                    </Col>
                                    <Col style={{ margin: '0.2rem' }}>
                                        <Button variant="outline-secondary" id="button-addon2" onClick={this.refundFiDiTokens}>Refund</Button>
                                    </Col>

                                </InputGroup>
                            </Row>
                            <Row style={{ margin: '0.2rem' }}>
                                <InputGroup >


                                    <Col sm={8} style={{ margin: '0.2rem' }}>
                                        <FormControl onChange={this.onAllowanceAddressChange}
                                            placeholder="Recipient's address"
                                            aria-describedby="basic-addon2"
                                        />
                                    </Col>
                                    <Col style={{ margin: '0.2rem' }}>
                                        <FormControl onChange={this.onAllowanceAmountChange}
                                            placeholder="FiDi"
                                            aria-describedby="basic-addon2"
                                        />
                                    </Col>
                                    <Col style={{ margin: '0.2rem' }}>
                                        <Button variant="outline-secondary" id="button-addon2" onClick={this.giveAllowanceToDisputeManager}>Allow</Button>
                                    </Col>

                                </InputGroup>
                            </Row>



                        </Card.Body>
                    </Card>
            


                </Container>

            </>
        );
    }
}

export default DiFiOperationsComponent;
