    import React, { useState, useEffect } from 'react';

    const GanttChart = () => {
    const [tasks, setTasks] = useState([
        { id: 1, name: '', duration: 0, predecessors: '', start: 0, end: 0 }
    ]);
    const [showCriticalPath, setShowCriticalPath] = useState(false);
    const [maxDuration, setMaxDuration] = useState(0);

    // Calculator function
    const calculateTimings = (taskList) => {
        const tempTasks = [...taskList];
        
        // Forward pass
        tempTasks.forEach(task => {
        if (!task.predecessors) {
            task.start = 0;
            task.end = Number(task.duration);
        } else {
            const predIds = task.predecessors.split(',').map(p => parseInt(p.trim()));
            const maxEnd = Math.max(...predIds.map(id => {
            const pred = tempTasks.find(t => t.id === id);
            return pred ? pred.end : 0;
            }));
            task.start = maxEnd;
            task.end = maxEnd + Number(task.duration);
        }
        });

        // Calculate project end
        const projectEnd = Math.max(...tempTasks.map(t => t.end));
        
        // Backward pass
        tempTasks.reverse().forEach(task => {
        const successors = tempTasks.filter(t => 
            t.predecessors?.split(',').map(p => parseInt(p.trim())).includes(task.id)
        );
        
        if (successors.length === 0) {
            task.lateStart = projectEnd - task.duration;
            task.lateEnd = projectEnd;
        } else {
            task.lateEnd = Math.min(...successors.map(s => s.lateStart));
            task.lateStart = task.lateEnd - task.duration;
        }
        
        task.totalSlack = task.lateStart - task.start;
        task.freeSlack = successors.length 
            ? Math.min(...successors.map(s => s.start)) - task.end 
            : 0;
        });

        return tempTasks.reverse();
    };

    useEffect(() => {
        const updatedTasks = calculateTimings(tasks);
        const newMaxDuration = Math.max(...updatedTasks.map(t => t.end));
        setMaxDuration(newMaxDuration);
        setTasks(updatedTasks);
    }, [tasks.map(t => `${t.name}-${t.duration}-${t.predecessors}`).join(',')]);

    const addTask = () => {
        setTasks([
        ...tasks,
        {
            id: tasks.length + 1,
            name: '',
            duration: 0,
            predecessors: '',
            start: 0,
            end: 0
        }
        ]);
    };

    const removeTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const updateTask = (id, field, value) => {
        setTasks(tasks.map(task => 
        task.id === id ? { ...task, [field]: value } : task
        ));
    };

    return (
        <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>Project Gantt Chart</h1>
        
        {/* Task Input Section */}
        <div style={{ marginBottom: '20px' }}>
            <button 
            onClick={addTask}
            style={{ 
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginBottom: '10px'
            }}
            >
            Add Task
            </button>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Task ID</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Predecessors</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                <tr key={task.id}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.id}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    <input
                        type="text"
                        value={task.name}
                        onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                        style={{ padding: '4px', width: '100%' }}
                    />
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    <input
                        type="number"
                        value={task.duration}
                        onChange={(e) => updateTask(task.id, 'duration', e.target.value)}
                        style={{ padding: '4px', width: '100%' }}
                    />
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    <input
                        type="text"
                        value={task.predecessors}
                        onChange={(e) => updateTask(task.id, 'predecessors', e.target.value)}
                        style={{ padding: '4px', width: '100%' }}
                    />
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    <button
                        onClick={() => removeTask(task.id)}
                        style={{ 
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                        }}
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Gantt Chart */}
        <div style={{ marginBottom: '20px' }}>
            <button
            onClick={() => setShowCriticalPath(!showCriticalPath)}
            style={{ 
                padding: '8px 16px',
                backgroundColor: showCriticalPath ? '#dc3545' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginBottom: '10px'
            }}
            >
            {showCriticalPath ? 'Hide Critical Path' : 'Show Critical Path'}
            </button>

            <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <div style={{ width: '100px' }}>Task</div>
                {Array.from({ length: maxDuration + 1 }).map((_, i) => (
                <div key={i} style={{ width: '40px', textAlign: 'center' }}>{i}</div>
                ))}
            </div>

            {tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', marginBottom: '5px' }}>
                <div style={{ width: '100px' }}>{task.name || `Task ${task.id}`}</div>
                <div style={{ position: 'relative', flex: 1, height: '20px' }}>
                    <div
                    style={{
                        position: 'absolute',
                        left: `${task.start * 40}px`,
                        width: `${task.duration * 40}px`,
                        height: '100%',
                        backgroundColor: showCriticalPath && task.totalSlack === 0 ? '#dc3545' : '#007bff',
                        borderRadius: '4px'
                    }}
                    />
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Slack Table */}
        <div>
            <h2 style={{ marginBottom: '10px' }}>Slack Analysis</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Task</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Early Start</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Early Finish</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Late Start</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Late Finish</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Total Slack</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Free Slack</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                <tr key={task.id}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.name || `Task ${task.id}`}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.start}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.end}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.lateStart}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.lateEnd}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.totalSlack}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.freeSlack}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    };

    export default GanttChart;
