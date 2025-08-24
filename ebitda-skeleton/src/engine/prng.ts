// Simple Mulberry32 PRNG (deterministic)
export class PRNG {
  private state: number
  constructor(seed: number) {
    this.state = seed >>> 0
  }
  next(): number {
    // returns [0,1)
    let t = this.state += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }
  range(min: number, max: number): number {
    return min + (max - min) * this.next()
  }
  normalRandom(mean: number = 0, stdDev: number = 1): number {
    // Box-Muller transform for normal distribution
    const u1 = this.next()
    const u2 = this.next()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return z0 * stdDev + mean
  }
}
