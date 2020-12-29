import React from 'react';
import { Component } from 'react';
import AgentsData from '../AgentsContent.json';
import { GetAgentIndexWithId } from '../Utility';

class Agent extends Component {
  state = {};

  constructor(props) {
    super(props);

    let position = props.position
      ? props.position
      : AgentsData[props.type].startPosition;

    this.state = {
      id: props.id,
      type: props.type,
      str: AgentsData[props.type].str,
      agi: AgentsData[props.type].agi,
      dex: AgentsData[props.type].dex,
      wis: AgentsData[props.type].wis,
      int: AgentsData[props.type].int,
      position: position
    };
  }

  // Need to make this generic update agent position
  UpdateAgent = (
    newPlayerPosition,
    mapState
    // Flip when use as rows in columns means need [y,x]
  ) => {
    this.state.tileCodeAgentOn =
      mapState[newPlayerPosition[1]][newPlayerPosition[0]];
    this.state.position = newPlayerPosition;
  };

    let agentIndex = GetAgentIndexWithId(this.state.id, agents);
}

export default Agent;
