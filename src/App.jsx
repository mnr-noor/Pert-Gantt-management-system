import React, { useState } from 'react';
import ActivityInput from './components/ActivityInput';
import ActivityTable from './components/ActivityTable';
import NetworkGraph from './components/NetworkGraph';
import OutputTable from './components/OutputTable';
import Graph from './utils/Graph'; // The class that will handle graph logic (to be defined)

const App = () => {
  const [activities, setActivities] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [matrix, setMatrix] = useState([]);
  const [criticalPath, setCriticalPath] = useState('');

  const addActivity = (activity) => {
    setActivities((prevActivities) => [...prevActivities, activity]);
  };

  const calculateGraphData = () => {
    const graph = new Graph();
    graph.addNodes(activities);
    graph.setEdges();
    graph.calculateEarly();
    graph.calculateLate();

    setCriticalPath(graph.getCriticalRoute());
    setMatrix(graph.getDataMatrix());

    // Prepare data for the graph visualization
    const nodes = activities.map((activity) => ({
      id: activity.name,
      label: activity.name,
    }));
    const edges = activities.flatMap((activity) =>
      activity.predecessors.split(',').map((predecessor) => ({
        from: predecessor,
        to: activity.name,
      }))
    );

    setGraphData({ nodes, edges });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">PERT/CPM Calculator</h1>

      <ActivityInput addActivity={addActivity} />

      <div className="my-4">
        <button
          onClick={calculateGraphData}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Calculate Critical Path
        </button>
      </div>

      <ActivityTable activities={activities} />

      {activities.length > 0 && <NetworkGraph graphData={graphData} />}

      {matrix.length > 0 && (
        <div className="my-4">
          <h2 className="text-xl font-semibold">Calculated Matrix</h2>
          <OutputTable matrix={matrix} />
        </div>
      )}

      {criticalPath && (
        <div className="my-4">
          <h2 className="text-xl font-semibold">Critical Path</h2>
          <p>{criticalPath}</p>
        </div>
      )}
    </div>
  );
};

export default App;
