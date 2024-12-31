    import React from 'react';

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
                <td className="border p-2">{row.sucesors}</td>
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

    export default OutputTable;
