    import React, { useEffect } from 'react';
    import { DataSet, Network } from 'vis-network/standalone/umd/vis-network.min.js';

    const NetworkGraph = ({ graphData }) => {
    useEffect(() => {
        const nodes = new DataSet(graphData.nodes);
        const edges = new DataSet(graphData.edges);
        
        const container = document.getElementById('mynetwork');
        const data = { nodes, edges };
        const options = {
        nodes: {
            shape: 'box',
            color: { border: '#007bff', background: '#28a745' },
            font: { color: '#ffffff', bold: { color: '#ffffff' } },
        },
        edges: { arrows: { to: { enabled: true } } },
        interaction: { dragNodes: true, dragView: true, zoomSpeed: 1 },
        };
        
        new Network(container, data, options);
    }, [graphData]);

    return <div id="mynetwork" className="my-4 h-96"></div>;
    };

    export default NetworkGraph;
