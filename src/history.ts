export type HistoryEntry = {
  query: string;
  response: string;
};

export class History {
  private currentEntry: number = 0;

  constructor(
    private entries: HistoryEntry[] = [],
    currentEntry: number = 0,
  ) {
    this.currentEntry = this.between(0, this.entries.length - 1, currentEntry);
  }

  public getAllEntries(): HistoryEntry[] {
    return this.entries;
  }

  public addNewEntry(entry: HistoryEntry) {
    this.entries.push(entry);
    this.currentEntry = this.entries.length - 1;
  }

  public goBack() {
    if (this.canGoBack()) {
      this.currentEntry -= 1;
    }
  }

  public goForward() {
    if (this.canGoForward()) {
      this.currentEntry += 1;
    }
  }

  public canGoForward() {
    return this.currentEntry < this.entries.length - 1;
  }

  public canGoBack() {
    return this.currentEntry > 0;
  }

  public getCurrentNumber(): number {
    return this.currentEntry + 1;
  }

  public getCurrentEntry(): HistoryEntry | null {
    return this.entries[this.currentEntry];
  }

  public size(): number {
    return this.entries.length;
  }

  private between(lower: number, upper: number, value: number): number {
    if (value < lower) {
      return lower;
    } else if (value > upper) {
      return upper;
    } else {
      return value;
    }
  }
}
