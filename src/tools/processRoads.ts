import fs from 'fs';
import { parse as parseSvg, type ElementNode } from 'svg-parser';
import { toPoints, type Point } from 'svg-points';
import { DijkstraCalculator } from 'dijkstra-calculator';

const toIdent = (coords: number[]) => JSON.stringify(coords);

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const y = x2 - x1;
  const x = y2 - y1;

  return Math.sqrt(x * x + y * y);
};

const vectorFileToPoints = async (file: string) => {
  const fileContents = await fs.promises.readFile(file, 'utf-8');
  const svg = parseSvg(fileContents);

  const pathNode = (svg.children[0] as ElementNode).children[0] as ElementNode;

  return toPoints({
    type: 'path',
    d: pathNode.properties!.d as string,
  });
};

const pointsArrayToGraph = (points: Point[]) => {
  const graph = new DijkstraCalculator();

  points.forEach((point, i) => {
    // Dunno yet:
    if (point.curve && point.curve.type !== 'cubic') {
      throw new Error('invariant: can only handle cubic curves');
    }

    // TODO: plot points along the curve at set intervals, and turn
    // those into graph nodes:
    const coords = [point.x, point.y];

    const ident = toIdent(coords);

    graph.addVertex(ident);

    if (i > 0 && !point.moveTo) {
      const previousPoint = points[i - 1];
      const previousIdent = toIdent([previousPoint.x, previousPoint.y]);

      graph.addEdge(
        previousIdent,
        ident,
        getDistance(previousPoint.x, previousPoint.y, point.x, point.y)
      );
    }
  });

  return graph;
};

const cacheAdjacencyList = async (
  graph: DijkstraCalculator,
  filePath: string
) => fs.promises.writeFile(filePath, JSON.stringify(graph.adjacencyList));

const main = async () => {
  const pointsArray = await vectorFileToPoints('./src/data/roads.svg');
  const graph = pointsArrayToGraph(pointsArray);

  await cacheAdjacencyList(graph, './src/data/adjacency.json');
};

void main();
