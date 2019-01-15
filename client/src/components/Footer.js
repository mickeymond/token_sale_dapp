import React from 'react';

export default ({ drizzle, drizzleState }) => {
    const { web3 } = drizzle;

    const account = drizzleState.accounts[0];
    const accountBalance = web3.utils.fromWei(drizzleState.accountBalances[account]);
    return (
        <footer className="footer bg-dark mt-auto pt-3 fixed-bottom">
            <div className="container">
                <p className="text-center text-white">Your account is: <strong>{account}</strong> with <strong>{accountBalance}</strong> ETH</p>
            </div>
        </footer>
    );
}
