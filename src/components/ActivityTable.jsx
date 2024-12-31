    import React from 'react';

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

    export default ActivityTable;
