    import React, { useState } from 'react';

    const ActivityInput = ({ addActivity }) => {
    const [name, setName] = useState('');
    const [predecessors, setPredecessors] = useState('');
    const [time, setTime] = useState('');

    const handleAddActivity = () => {
        if (name && time) {
        addActivity({ name, predecessors, time: parseInt(time) });
        setName('');
        setPredecessors('');
        setTime('');
        } else {
        alert('Please fill in all fields');
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

    export default ActivityInput;
