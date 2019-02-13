import AgentsData from './AgentsContent.json';

const PondHasTile = (pond, tile) => {
  let arrayChecks = pond.map(function(pondTile) {
    // Check if each tile in pond is same as tile
    if (pondTile[0] === tile[0] && pondTile[1] === tile[1]) {
      return true;
    } else {
      return false;
    }
  });

  // if any tile matches return true
  return arrayChecks.includes(true);
};

const GetTile = (state, row, column) => {
  return state[row][column];
};

const GetAgentWithId = (id, agents) => {
  agents.find(agent => {
    return agent.state.id === id;
  });
  return agents[0];
};

const GetAgentTypes = () => {
  return Object.keys(AgentsData);
};

const ConsoleLogTest = (test, message) => {
  if (test) {
    console.log(message);
  }
};

export { PondHasTile, GetTile, GetAgentWithId, GetAgentTypes, ConsoleLogTest };
