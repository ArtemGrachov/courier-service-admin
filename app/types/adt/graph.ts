export class Graph<T> {
  private adjacency = new Map<T, Set<T>>();

  private getNode(x: T) {
    const node = this.adjacency.get(x);

    if (node) {
      return node;
    }

    throw new Error(`There is no node ${x}`);
  }

  public addNode(x: T) {
    if (this.adjacency.has(x)) {
      return;
    }

    this.adjacency.set(x, new Set);
  }

  public addEdge(x: T, y: T) {
    const nodeX = this.getNode(x);
    const nodeY = this.getNode(y);

    nodeX.add(y);
    nodeY.add(x);
  }

  public removeEdge(x: T, y: T) {
    const nodeX = this.getNode(x);
    const nodeY = this.getNode(y);

    nodeX.delete(y);
    nodeY.delete(x);
  }

  public neighbours(x: T) {
    return Array.from(this.getNode(x));
  }
}
