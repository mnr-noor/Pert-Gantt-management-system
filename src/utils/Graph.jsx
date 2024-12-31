    class Graph {
        constructor() {
        this.activities = [];
        this.edges = [];
        this.earlyStart = {};
        this.lateStart = {};
        this.slack = {};
        this.criticalPath = [];
        }
    
        addNodes(activities) {
        this.activities = activities;
        // Initialize early start and late start times for all activities
        this.activities.forEach((activity) => {
            this.earlyStart[activity.name] = 0;
            this.lateStart[activity.name] = Infinity;
            this.slack[activity.name] = 0;
        });
        }
    
        setEdges() {
        this.edges = [];
        this.activities.forEach((activity) => {
            const predecessors = activity.predecessors.split(',');
            predecessors.forEach((predecessor) => {
            this.edges.push({ from: predecessor, to: activity.name });
            });
        });
        }
    
        calculateEarly() {
        // Implement logic for early start times here
        }
    
        calculateLate() {
        // Implement logic for late start times here
        }
    
        getCriticalRoute() {
        // Return the critical path based on early and late start calculations
        return 'Activity1 → Activity2 → Activity3';  // Sample return
        }
    
        getDataMatrix() {
        return this.activities.map((activity) => ({
            name: activity.name,
            predecessors: activity.predecessors,
            sucesors: '...',  // You would need logic for successors as well
            time: activity.time,
            slack: this.slack[activity.name],
            startEarly: this.earlyStart[activity.name],
            startLate: this.lateStart[activity.name],
            endEarly: this.earlyStart[activity.name] + activity.time,
            endLate: this.lateStart[activity.name] + activity.time,
        }));
        }
    }
    
    export default Graph;
    