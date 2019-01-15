import React, { Component } from 'react';
import toastr from 'toastr/build/toastr.min.js';

class Dapp extends Component {

    state = { message: '' };

    async componentDidMount() {
        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload();
        });

        const { DappToken, DappTokenSale } = this.props.drizzle.contracts;
        const { web3 } = this.props.drizzle;

        const account = this.props.drizzleState.accounts[0];

        const name = await DappToken.methods.name().call();
        const symbol = await DappToken.methods.symbol().call();
        const clientTokens = await DappToken.methods.balanceOf(account).call();
        const availableTokens = await DappToken.methods.balanceOf(DappTokenSale.address).call();

        const admin = await DappTokenSale.methods.admin().call();
        const tokenPrice = await DappTokenSale.methods.tokenPrice().call();
        const tokensSold = await DappTokenSale.methods.tokensSold().call();

        const percentageSold = ((tokensSold / 750000) * 100).toFixed(2);
        const priceInEther = web3.utils.fromWei(tokenPrice);

        // Set keys on state
        this.setState({
            name, symbol, admin, tokenPrice, clientTokens, tokensSold, availableTokens, percentageSold,
            priceInEther
        });
    }

    async buyTokens(event) {
        event.preventDefault();
        this.props.showLoader();
        const { DappTokenSale } = this.props.drizzle.contracts;
        const { tokens, tokenPrice } = this.state;
        
        try {
            await DappTokenSale.methods.buyTokens(tokens).send({
                value: tokenPrice * tokens
            });

            window.location.reload();
        } catch ({ message }) {
            this.setState({ message });
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
            this.setState({ message });
            toastr.error(message);
            this.props.hideLoader();
        }
    }

    showForm() {
        if(this.state.availableTokens > 0) {
            return (
                <form className="mt-5" onSubmit={this.buyTokens.bind(this)}>
                    <div className="input-group">
                        <input
                            type="number"
                            min="1"
                            onChange={(event) => this.setState({ tokens: event.target.value })}
                            required
                            className="form-control"
                            placeholder="Number of tokens"
                        />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="submit">Buy Tokens</button>
                        </div>
                    </div>
                </form>
            );
        }

        return this.showEndSaleBtn();
    }

    showEndSaleBtn() {
        if(this.state.admin === this.state.account) {
            return <button onClick={this.endSale.bind(this)} className="btn btn-success">End Sale</button>;
        }
    }
    
    render() {
        const {
            name, symbol, priceInEther, clientTokens, availableTokens, admin, percentageSold, tokensSold, message
        } = this.state;
        return (
            <div>
                <h1 className="mb-5"><strong>{symbol} TOKEN ICO SALE</strong></h1>
                <p>Introducing {name} {symbol}! 1 Token cost {priceInEther} ETH. You currently have <strong>{clientTokens}</strong> {symbol}.</p>
                <p>There are <strong>{availableTokens}</strong> {symbol} tokens available.</p>
                <p>ICO is managed by <strong>{admin}</strong></p>
                {this.showForm()}
                <div className="progress mt-4">
                    <div className="progress-bar bg-info" style={{ width: percentageSold+"%" }}>
                        {percentageSold}%
                    </div>
                </div>
                <p className="mt-3">{tokensSold} / 750000 tokens sold.</p>
            </div>
        );
    }
}

export default Dapp;
