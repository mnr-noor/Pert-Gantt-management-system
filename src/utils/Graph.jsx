class Node {
    constructor(name, precesorChars, time) {
        this.name = name;
        this.precesorChars = precesorChars;
        this.time = time;
        this.startEarly = 0;
        this.startLate = 0;
        this.endEarly = 0;
        this.endLate = 0;
        this.slack = 0;
        this.precesors = [];
        this.sucesors = [];
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
            if (node.precesorChars.length === 0 || node.precesorChars[0] === "") {
                node.precesors.push(this.start);
                this.start.sucesors.push(node);
            } else {
                node.precesorChars.forEach((precesorChar) => {
                    const precesorNode = this.nodesList.find((n) => n.name === precesorChar);
                    if (precesorNode) {
                        node.precesors.push(precesorNode);
                        precesorNode.sucesors.push(node);
                    }
                });
            }
        });

        this.nodesList.forEach((node) => {
            if (node.sucesors.length === 0) {
                node.sucesors.push(this.end);
                this.end.precesors.push(node);
            }
        });
    }

    calculateEarly() {
        this.nodesList.forEach((node) => {
            if (node.precesors.length === 1) {
                node.startEarly = node.precesors[0].endEarly;
            } else {
                node.startEarly = Math.max(...node.precesors.map((p) => p.endEarly));
            }
            node.endEarly = node.startEarly + node.time;
        });

        this.end.endEarly = Math.max(...this.end.precesors.map((p) => p.endEarly));
        this.end.startEarly = this.end.endEarly;
    }

    calculateLate() {
        this.end.endLate = this.end.startLate = this.end.endEarly;

        for (let i = this.nodesList.length - 1; i >= 0; i--) {
            const node = this.nodesList[i];
            if (node.sucesors.length === 1) {
                node.endLate = node.sucesors[0].startLate;
            } else {
                node.endLate = Math.min(...node.sucesors.map((s) => s.startLate));
            }
            node.startLate = node.endLate - node.time;
            node.slack = node.startLate - node.startEarly;
        }
    }
    getCriticalRoute(node = this.start, route = []) {
        if (node === this.end) {
            return route.join(" -> "); // Join the route with " -> " as a separator
        }

        const criticalSucesor = node.sucesors.find((s) => s.slack === 0);
        if (criticalSucesor) {
            route.push(criticalSucesor.name); // Add the critical successor's name to the route
            return this.getCriticalRoute(criticalSucesor, route);
        }
        return route.join(" -> "); // In case the critical path ends unexpectedly
    }
    // getCriticalRoute(node = this.start, route = []) {
    //     if (node === this.end) {
    //         return route;
    //     }

    //     const criticalSucesor = node.sucesors.find((s) => s.slack === 0);
    //     if (criticalSucesor) {
    //         route.push(criticalSucesor.name);
    //         return this.getCriticalRoute(criticalSucesor, route);
    //     }
    //     return route;
    // }

    getDataMatrix() {
        return this.nodesList.map((node) => {
            const precesors = node.precesors.map((p) => p.name).join(",");
            const sucesors = node.sucesors.map((s) => s.name).join(",");

            return {
                name: node.name,
                predecessors: precesors,
                successors: sucesors,
                time: node.time,
                slack: node.slack,
                startEarly: node.startEarly,
                startLate: node.startLate,
                endEarly: node.endEarly,
                endLate: node.endLate,
            };
        });
    }
}

export default Graph;
