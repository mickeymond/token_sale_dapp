import React from 'react';

export default () =>  {
    return (
        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm fixed-top">
            <h5 className="my-0 mr-md-auto font-weight-normal">The Future Company | TFC</h5>
            <nav className="my-2 my-md-0 mr-md-3">
                {/* eslint-disable-next-line */}
                <a className="p-2 text-dark" href="">Buy Tokens</a>
                {/* eslint-disable-next-line */}
                <a className="p-2 text-dark" href="">Transfer Tokens</a>
                {/* eslint-disable-next-line */}
                <a className="p-2 text-dark" href="">Approve Tokens</a>
                {/* eslint-disable-next-line */}
                <a className="p-2 text-dark" href="">Spend Tokens</a>
            </nav>
        </div>
    );
}