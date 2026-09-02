class SequenceCache {
  private cache = new Map<string, HTMLImageElement>();
  private activePreloads = new Set<string>();

  public get(url: string): HTMLImageElement | undefined {
    return this.cache.get(url);
  }

  public has(url: string): boolean {
    return this.cache.has(url);
  }

  public set(url: string, img: HTMLImageElement): void {
    this.cache.set(url, img);
  }

  public async preloadImage(url: string, priority: 'high' | 'low' = 'low'): Promise<HTMLImageElement> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.activePreloads.has(url)) {
      return new Promise((resolve) => {
        const check = () => {
          if (this.cache.has(url)) {
            resolve(this.cache.get(url)!);
          } else if (!this.activePreloads.has(url)) {
            resolve(new Image());
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });
    }

    this.activePreloads.add(url);

    return new Promise((resolve) => {
      const img = new Image();
      (img as any).fetchPriority = priority;

      img.onload = async () => {
        try {
          await img.decode();
        } catch {
          // Fall back if decoding fails
        }
        this.cache.set(url, img);
        this.activePreloads.delete(url);
        resolve(img);
      };

      img.onerror = () => {
        this.activePreloads.delete(url);
        resolve(img);
      };

      img.src = url;
    });
  }

  public async preloadSequence(urls: string[], concurrency: number = 6): Promise<void> {
    const queue = [...urls];
    const workers = Array.from({ length: concurrency }, async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (url && !this.cache.has(url)) {
          await this.preloadImage(url, 'low');
        }
      }
    });
    await Promise.all(workers);
  }
}

export const sequenceCache = new SequenceCache();
