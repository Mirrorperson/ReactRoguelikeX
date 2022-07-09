import React, { Component } from 'react';
import Map from './Map';
import { HandleUIChangeUpdateState } from '../Utility';

class MapUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveSpeed: 5
    };
  }

  render() {
    return (
      <div className="MapAndInterface">

        <div className="MapAndSideControls">
          <Map
            rows={this.props.height}
            columns={this.props.width}
            moveSpeed={this.state.moveSpeed}
            test={true}
          />

          <div className="SideControls">
            Interface
          </div>
        </div>

        <div className="BottomControls">
          <label>Move speed: </label>
          <input
            type="int"
            id="moveSpeed"
            value={this.state.moveSpeed}
            onChange={(event) =>
              HandleUIChangeUpdateState(event, () => {
                return this;
              })
            }
          />
        </div>

      </div>
    );
  }
}

export default MapUI;
