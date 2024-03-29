import React, { Component } from 'react';
import logo from './logo.svg';
import Map from './components/Map';
import MapUI from './components/MapUI';
import { HandleUIChangeUpdateState } from './Utility';
import './App.css';
import './Game.css';
import ReactDom from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 10,
      height: 10,
      setSize: true,
      invalidSize: false
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // max size 20, min size 7
    if (
      this.state.height > 20 ||
      this.state.width > 20 ||
      this.state.height < 7 ||
      this.state.width < 7
    ) {
      this.setState({ invalidSize: true });
      return;
    }

    const app = (
      // How many rows there are determines heigt, columns determines width
      <MapUI height={this.state.height} width={this.state.width} test={true} />
    );

    ReactDom.render(app, document.getElementById('App'));

    this.setState({ setSize: false });
  };

  render() {
    return (
      <div>
        <form
          className={`App-interface ${this.state.setSize ? '' : 'hidden'}`}
          onSubmit={this.handleSubmit}
        >
          <label>
            Select map size{' '}
            <span className={`${this.state.invalidSize ? 'warning-text' : ''}`}>
              (min: 7, max: 20)
            </span>
          </label>
          <br />
          <label>Height: </label>
          <input
            type="int"
            id="height"
            value={this.state.height}
            onChange={(e) =>
              HandleUIChangeUpdateState(e, () => {
                return this;
              })
            }
          />

          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

          <label id="lblWidth">Width: </label>
          <input
            type="int"
            id="width"
            value={this.state.width}
            onChange={(e) =>
              HandleUIChangeUpdateState(e, () => {
                return this;
              })
            }
          />

          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

          <input id="Submit" type="submit" />
        </form>

        <div id="App" className="App" />
      </div>
    );
  }
}

export default App;
