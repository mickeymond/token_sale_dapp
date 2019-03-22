import React, { Component } from 'react';
import { Divider, Container, Button, Header, Segment, Message , Input, Progress } from 'semantic-ui-react';
import toastr from 'toastr/build/toastr.min.js';

class TokenSale extends Component {

    state = { message: '', tokens: '' };

    async componentDidMount() {
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload();
            });
        }

        const { DappToken, DappTokenSale } = this.props.drizzle.contracts;
        const { web3 } = this.props.drizzle;

        const account = this.props.drizzleState.accounts[0];
        const accountBalance = await web3.eth.getBalance(account);
        const accountBalanceInEther = web3.utils.fromWei(accountBalance);

        const name = await DappToken.methods.name().call();
        const symbol = await DappToken.methods.symbol().call();
        const clientTokens = await DappToken.methods.balanceOf(account).call();
        const availableTokens = await DappToken.methods.balanceOf(DappTokenSale.address).call();

        const admin = await DappTokenSale.methods.admin().call();
        const tokenPrice = await DappTokenSale.methods.tokenPrice().call();
        const tokensSold = await DappTokenSale.methods.tokensSold().call();

        const totalTokens = Number(availableTokens) + Number(tokensSold);

        const percentageSold = ((tokensSold / totalTokens) * 100).toFixed(2);
        const priceInEther = web3.utils.fromWei(tokenPrice);

        // Set keys on state
        this.setState({
            name, symbol, admin, tokenPrice, clientTokens, tokensSold, availableTokens, percentageSold,
            priceInEther, totalTokens, account, accountBalanceInEther
        });
    }

    async buyTokens(event) {
        event.preventDefault();
        this.props.showLoader();
        const { DappTokenSale } = this.props.drizzle.contracts;
        const { tokens, tokenPrice } = this.state;
        
        try {
            await DappTokenSale.methods.buyTokens(tokens).send({ value: tokenPrice * tokens });

            window.location.reload();
        } catch ({ message }) {
            toastr.error(message);
            this.props.hideLoader();
        }
    }

    async endSale(event) {
        event.preventDefault();
        this.props.showLoader();
        const { DappTokenSale } = this.props.drizzle.contracts;

        try {
            await DappTokenSale.methods.endSale().send();

            window.location.reload();
        } catch ({ message }) {
            toastr.error(message);
            this.props.hideLoader();
        }
    }

    showForm() {
        if(this.state.availableTokens > 0) {
            return (
                <Container>
                    <Segment>
                        <Input
                            placeholder="Number of tokens"
                            type="number"
                            min="1"
                            onChange={(e, data) => this.setState({ tokens: data.value })}
                        />
                    </Segment>
                    <Button
                        disabled={this.state.tokens >= 1 ? false : true}
                        primary
                        onClick={this.buyTokens.bind(this)}
                    >
                        Buy Tokens
                    </Button>
                </Container>
            );
        }

        return this.showEndSaleBtn();
    }

    showEndSaleBtn() {
        if(this.state.admin === this.state.account) {
            return <Button onClick={this.endSale.bind(this)} positive>End Sale</Button>;
        }
    }
    
    render() {
        const {
            name, symbol, priceInEther, clientTokens, availableTokens, admin, percentageSold, tokensSold, totalTokens,
            account, accountBalanceInEther
        } = this.state;
        return (
            <Container textAlign="center">
                <Segment>
                    <Header as="h1">The Future Company | TFC</Header>
                </Segment>
                <Divider />
                <Message>
                    <Message.Header>{symbol} TOKEN ICO SALE</Message.Header>
                    <p>There are <strong>{availableTokens}</strong> {symbol} tokens available.</p>
                </Message>
                <Divider />
                <Message>
                    <Message.Header>ICO MANAGER</Message.Header>
                    <p>ICO is managed by <strong>{admin}</strong></p>
                </Message>
                <Divider />
                <Segment raised>
                    <p>Introducing {name} {symbol}! 1 Token cost {priceInEther} ETH. You currently have <strong>{clientTokens}</strong> {symbol}.</p>
                </Segment>
                <Divider />
                <Segment raised>
                    {this.showForm()}
                </Segment>
                <Divider />
                <Segment raised>
                    <Progress percent={percentageSold} progress active indicating>
                        <p className="mt-3">{tokensSold} / {totalTokens} tokens sold.</p>
                    </Progress>
                </Segment>
                <Message color="orange">
                    <p>This token sale uses the Ropsten Test Network with fake ether. Use a browser extension like Metamask to connect to the test network and participate in the ICO. Please be patient if the test network runs slowly.</p>
                </Message>
                <Segment raised>
                    <p className="text-center text-white">Your account is: <strong>{account}</strong> with <strong>{accountBalanceInEther}</strong> ETH</p>
                </Segment>
            </Container>
        );
    }
}

export default TokenSale;
