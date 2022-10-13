import { DijkstraCalculator } from 'dijkstra-calculator';
import roadAdjacencyList from '../data/adjacency.json';

let graph: DijkstraCalculator;
let roadPoints: number[][];

export const getRoadGraph = () => {
  if (!graph) {
    const newGraph = new DijkstraCalculator();
    newGraph.adjacencyList = roadAdjacencyList;

    graph = newGraph;
  }

  return graph;
};

export const getRoadPoints = () => {
  if (!roadPoints) {
    roadPoints = Object.keys(roadAdjacencyList).map(
      (ident) => JSON.parse(ident) as number[]
    );
  }

  return roadPoints;
};
