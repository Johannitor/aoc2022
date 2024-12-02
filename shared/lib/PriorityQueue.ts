export class PriorityQueue<T> {
  private storage: [number, T][] = [];

  get hasNext() {
    return !!this.storage.length;
  }

  toString() {
    return this.storage
      .map(([prio, value]) => `[${prio}] ${String(value)}`)
      .join('; ');
  }

  enqueue(priority: number, item: T) {
    this.storage.push([priority, item]);

    if (this.storage.length > 1) {
      this.storage.sort(([a], [b]) => a - b);
    }
  }

  dequeue(): T | undefined {
    if (!this.storage.length) return undefined;

    return this.storage.shift()![1];
  }

  dequeueLast(): T | undefined {
    if (!this.storage.length) return undefined;

    return this.storage.pop()![1];
  }
}
