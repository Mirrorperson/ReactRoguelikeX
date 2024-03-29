import React, { Component } from 'react';
import Tile from './Tile';
import Agent from './Agent';
import { HandleEvent, HandleAgentEvents } from './Events';
import { GetNewState } from '../WorldGeneration/MapGeneration';
import { InitializeAgents } from '../WorldGeneration/AgentsGeneration';
import {
  GetPlayerAgentId,
  GetAgentWithId,
  ConsoleLogTest,
  UpdateStateWithAgents
} from '../Utility';
import _ from 'lodash';
import $ from 'jquery';
window.jQuery = window.$ = $;

class Map extends Component {
  state = {
    test: this.props.test,
    agentCounter: 0,
    columns: this.props.columns,
    rows: this.props.rows,
    tilesStates: [[]],
    tilesAgentsStates: [[]],
    tileTypes: {
      grass: 0,
      rock: 1,
      tree: 2,
      water: 3
    },
    tileOccuranceLimits: [0, 60, 75, 85, 100],
    ponds: [],
    condenseLimit: 3,
    agents: [],
    playerPosEdgeGap: 2,
    playersTurn: true
  };

  constructor(props) {
    super(props);

    let newTilesStates = GetNewState(
      props,
      this.state,
      this.state.tileOccuranceLimits
    );
    let newAgents = InitializeAgents(this.state, newTilesStates);
    let newTilesStateWithAgents = UpdateStateWithAgents(
      newTilesStates,
      newAgents
    );

    this.state = {
      ...this.state,
      agents: newAgents,
      tilesStates: newTilesStates,
      tilesAgentsStates: newTilesStateWithAgents,
      agentCounter: this.state.agentCounter + newAgents.length
    };
  }

  // movement controls
  handleKeyPress = (event) => {
    // discard input
    if (!this.state.playersTurn) {
      return;
    }

    let player = GetAgentWithId(GetPlayerAgentId(), this.state.agents);
    let oldPlayerPosition = [...player.state.position];

    let newState = HandleEvent(
      GetPlayerAgentId(),
      oldPlayerPosition,
      event.key,
      this.state
    );

    if (!_.isEqual(player.state.position, oldPlayerPosition)) {
      this.setState((state) => ({
        agents: newState.agents,
        tilesAgentsStates: newState.tilesAgentsStates,
        playersTurn: false
      }));
    }
  };

  componentDidUpdate() {
    // player's turn handled by handleKeyPress
    if (this.state.playersTurn) {
      return;
    }

    let thisAppMap = this,
      newState,
      activeAgentId,
      absolutePosition,
      moveDirection,
      tileDimention = 36;

    let stateActiveAgentIdAndDirection = HandleAgentEvents(this.state);

    if (!stateActiveAgentIdAndDirection) {
      // players turn next
      this.setState((state) => ({ playersTurn: true }));
      return;
    } else {
      [newState, activeAgentId, moveDirection] = stateActiveAgentIdAndDirection;
    }

    let scaledMove = Math.cos(this.props.moveSpeed * 200);
    scaledMove = scaledMove < 0 ? scaledMove * -1 : scaledMove;
    let animateTime = scaledMove * 1000;

    // animation start
    var animateAgent = $(`#${activeAgentId}`);
    absolutePosition = animateAgent.position();

    // Cannot read property 'left' of undefined - absolutePosition occur if
    // original tile is not on dom because of collison - if combat system were
    // in place agent would be removed so it couldn't move if it wasnt in the dom
    $(`#${activeAgentId}`)
      .clone()
      .prop('id', `${activeAgentId}Clone`)
      .css({
        position: 'absolute',
        left: absolutePosition.left,
        top: absolutePosition.top
      })
      .appendTo($(`#${activeAgentId}`).parent());

    $(`#${activeAgentId}`).addClass('tile-clone');

    let movedCss;
    switch (moveDirection) {
      case 'ArrowLeft':
        movedCss = { left: absolutePosition.left - tileDimention };
        break;
      case 'ArrowUp':
        movedCss = { top: absolutePosition.top - tileDimention };
        break;
      case 'ArrowRight':
        movedCss = { left: absolutePosition.left + tileDimention };
        break;
      case 'ArrowDown':
        movedCss = { top: absolutePosition.top + tileDimention };
        break;
    }

    $(`#${activeAgentId}Clone`).animate(movedCss, animateTime, () => {
      // remove clones update state
      $(`div[id$=Clone]`).remove();
      thisAppMap.setState((state) => ({
        agents: newState.agents,
        tilesAgentsStates: newState.tilesAgentsStates
      }));
    });
  }

  render() {
    ConsoleLogTest(this.state.test, this.state.tilesAgentsStates);
    return (
      <div tabIndex="0" onKeyDown={this.handleKeyPress} className="tileRow">
        {this.state.tilesAgentsStates.map((rows, index) => (
          <div key={index} className="tileColumn">
            {this.state.tilesAgentsStates[index].map(
              (tileTypeOrAgentId, colIndex) => (
                <Tile
                  id={tileTypeOrAgentId}
                  tileType={
                    tileTypeOrAgentId[0] === 'a' // is agent
                      ? 'tile ' +
                        GetAgentWithId(tileTypeOrAgentId, this.state.agents)
                          .state.type
                      : tileTypeOrAgentId
                  }
                  agent={GetAgentWithId(tileTypeOrAgentId, this.state.agents)}
                  key={index * this.state.rows + colIndex}
                  test={this.state.test}
                />
              )
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default Map;
