import React, { Component } from 'react';
import { DrizzleContext } from 'drizzle-react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'toastr/build/toastr.min.css'

import Header from './components/Header';
import Dapp from './components/Dapp';
import Spinner from './components/Spinner';
import Footer from './components/Footer';

class App extends Component {

  state = { loading: false };

  showLoader() {
    this.setState({ loading: true });
  }

  hideLoader() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
      
          if (!initialized || this.state.loading) {
            return (
              <div className="container text-center mt-5">
                <Spinner />
              </div>
            );
          }
    
          return (
            <div>
              <Header />
              <div
                className="container text-center"
                style={{ marginTop: "150px" }}
              >
                <Dapp
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  showLoader={this.showLoader.bind(this)}
                  hideLoader={this.hideLoader.bind(this)}
                />
              </div>
              <Footer
                drizzle={drizzle}
                drizzleState={drizzleState}
              />
            </div>
          );
        }}
      </DrizzleContext.Consumer>
    );
  }
}

export default App;
