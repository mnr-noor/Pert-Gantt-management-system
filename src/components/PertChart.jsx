    import React, { useState, useEffect } from "react";
    import { DataSet, Network } from "vis-network/standalone/umd/vis-network.min.js";

    // Activity Input Component
    const ActivityInput = ({ addActivity }) => {
    const [name, setName] = useState("");
    const [predecessors, setPredecessors] = useState("");
    const [time, setTime] = useState("");

    const handleAddActivity = () => {
        if (name && time) {
        addActivity({ name, predecessors, time: parseInt(time) });
        setName("");
        setPredecessors("");
        setTime("");
        } else {
        alert("Please fill in all fields");
        }
    };

    return (
        <div className="flex flex-col space-y-4 p-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Activity Name</label>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Predecessors</label>
            <input
            type="text"
            value={predecessors}
            onChange={(e) => setPredecessors(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <small className="text-gray-500">Separate by commas. NO SPACES.</small>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
            <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
        </div>
        <button
            type="button"
            onClick={handleAddActivity}
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
        >
            Add Activity
        </button>
        </div>
    );
    };

    // Activity Table Component
    const ActivityTable = ({ activities }) => {
    return (
        <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto border-collapse">
            <thead>
            <tr>
                <th className="border p-2">Activities</th>
                <th className="border p-2">Predecessors</th>
                <th className="border p-2">Duration</th>
            </tr>
            </thead>
            <tbody>
            {activities.map((activity, index) => (
                <tr key={index}>
                <td className="border p-2">{activity.name}</td>
                <td className="border p-2">{activity.predecessors}</td>
                <td className="border p-2">{activity.time}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

    // Network Graph Component
    const NetworkGraph = ({ graphData }) => {
    useEffect(() => {
        const nodes = new DataSet(graphData.nodes);
        const edges = new DataSet(graphData.edges);

        const container = document.getElementById("mynetwork");
        const data = { nodes, edges };
        const options = {
        nodes: {
            shape: "box",
            color: { border: "#007bff", background: "#28a745" },
            font: { color: "#ffffff", bold: { color: "#ffffff" } },
        },
        edges: { arrows: { to: { enabled: true } } },
        interaction: { dragNodes: true, dragView: true, zoomSpeed: 1 },
        };

        new Network(container, data, options);
    }, [graphData]);

    return <div id="mynetwork" className="my-4 h-96"></div>;
    };

    // Output Table Component
    const OutputTable = ({ matrix }) => {
    return (
        <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto border-collapse">
            <thead>
            <tr>
                <th className="border p-2">Activities</th>
                <th className="border p-2">Predecessors</th>
                <th className="border p-2">Successors</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Slack</th>
                <th className="border p-2">Early Start</th>
                <th className="border p-2">Late Start</th>
                <th className="border p-2">Early Termination</th>
                <th className="border p-2">Late Termination</th>
            </tr>
            </thead>
            <tbody>
            {matrix.map((row, index) => (
                <tr key={index}>
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{row.predecessors}</td>
                <td className="border p-2">{row.successors}</td>
                <td className="border p-2">{row.time}</td>
                <td className="border p-2">{row.slack}</td>
                <td className="border p-2">{row.startEarly}</td>
                <td className="border p-2">{row.startLate}</td>
                <td className="border p-2">{row.endEarly}</td>
                <td className="border p-2">{row.endLate}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

    // Node and Graph Classes
    class Node {
    constructor(name, predecessors, time) {
        this.name = name;
        this.predecessors = predecessors;
        this.time = time;
        this.startEarly = 0;
        this.startLate = 0;
        this.endEarly = 0;
        this.endLate = 0;
        this.slack = 0;
        this.predecessorsList = [];
        this.successors = [];
    }
    }

    class Graph {
    constructor() {
        this.start = new Node("Initial", [], 0);
        this.end = new Node("Finish", [], 0);
        this.nodesList = [];
    }

    addNodes(data) {
        data.forEach((activity) => {
        this.nodesList.push(new Node(activity.name, activity.predecessors.split(","), activity.time));
        });
    }

    setEdges() {
        this.nodesList.forEach((node) => {
        if (!node.predecessors[0]) {
            node.predecessorsList.push(this.start);
            this.start.successors.push(node);
        } else {
            node.predecessors.forEach((pred) => {
            const predecessorNode = this.nodesList.find((n) => n.name === pred);
            if (predecessorNode) {
                node.predecessorsList.push(predecessorNode);
                predecessorNode.successors.push(node);
            }
            });
        }
        });

        this.nodesList.forEach((node) => {
        if (node.successors.length === 0) {
            node.successors.push(this.end);
            this.end.predecessorsList.push(node);
        }
        });
    }

    calculateEarly() {
        this.nodesList.forEach((node) => {
        node.startEarly = Math.max(0, ...node.predecessorsList.map((p) => p.endEarly));
        node.endEarly = node.startEarly + node.time;
        });

        this.end.startEarly = this.end.endEarly = Math.max(...this.end.predecessorsList.map((p) => p.endEarly));
    }

    calculateLate() {
        this.end.startLate = this.end.endLate = this.end.endEarly;

        for (let i = this.nodesList.length - 1; i >= 0; i--) {
        const node = this.nodesList[i];
        node.endLate = Math.min(...node.successors.map((s) => s.startLate));
        node.startLate = node.endLate - node.time;
        node.slack = node.startLate - node.startEarly;
        }
    }

    getCriticalRoute(node = this.start, route = []) {
        if (node === this.end) return route.join(" -> ");
        const criticalSuccessor = node.successors.find((s) => s.slack === 0);
        if (criticalSuccessor) route.push(criticalSuccessor.name);
        return this.getCriticalRoute(criticalSuccessor, route);
    }

    getDataMatrix() {
        return this.nodesList.map((node) => ({
        name: node.name,
        predecessors: node.predecessorsList.map((p) => p.name).join(","),
        successors: node.successors.map((s) => s.name).join(","),
        time: node.time,
        slack: node.slack,
        startEarly: node.startEarly,
        startLate: node.startLate,
        endEarly: node.endEarly,
        endLate: node.endLate,
        }));
    }
    }

    // Main App Component
    const PertChart = () => {
    const [activities, setActivities] = useState([]);
    const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
    const [matrix, setMatrix] = useState([]);
    const [criticalPath, setCriticalPath] = useState("");

    const addActivity = (activity) => setActivities((prev) => [...prev, activity]);

    const calculateGraphData = () => {
        const graph = new Graph();
        graph.addNodes(activities);
        graph.setEdges();
        graph.calculateEarly();
        graph.calculateLate();

        setCriticalPath(graph.getCriticalRoute());
        setMatrix(graph.getDataMatrix());

        setGraphData({
        nodes: activities.map((a) => ({ id: a.name, label: a.name })),
        edges: activities.flatMap((a) =>
            a.predecessors.split(",").map((p) => ({ from: p, to: a.name }))
        ),
        });
    };

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">PERT Chart</h1>
        <ActivityInput addActivity={addActivity} />
        <button
            onClick={calculateGraphData}
            className="bg-blue-500 text-white py-2 px-4 rounded-md my-4"
        >
            Calculate Critical Path
        </button>
        <ActivityTable activities={activities} />
        {graphData.nodes.length > 0 && <NetworkGraph graphData={graphData} />}
        {matrix.length > 0 && <OutputTable matrix={matrix} />}
        {criticalPath && (
            <div className="my-4">
            <h2 className="text-xl font-semibold">Critical Path</h2>
            <p>{criticalPath}</p>
            </div>
        )}
        </div>
    );
    };

    export default PertChart;
