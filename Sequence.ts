export const BasicAlphabet = [
  "A", "B", "C", "D", "E", "F", "G",
  "H", "I", "J", "K", "L", "M", "N",
  "O", "P", "Q", "R", "S", "T", "U",
  "V", "W", "X", "Y", "Z", "a", "b",
  "c", "d", "e", "f", "g", "h", "i",
  "j", "k", "l", "m", "n", "o", "p",
  "q", "r", "s", "t", "u", "v", "w",
  "x", "y", "z", "0", "1", "2", "3",
  "4", "5", "6", "7", "8", "9", "_"
];

export class Sequence {

  private size = 1;
  private permutation = [] as number[];

  constructor(private alphabet: string[] = BasicAlphabet) {
    this.reset();
  }

  toString(): string {
    let size   = this.size,
        output = new Array(size);
    for (let i = 0; i < size; i++) {
      output[size - i - 1] = this.alphabet[this.permutation[i]];
    }
    return output.join("");
  }

  reset(): void {
    for (let i = 0; i < this.size; i++) {
      this.permutation[i] = 0;
    }
  }

  increment(): void {
    for (let i = 0; true; i++) {
      if (i >= this.size) {
        this.size++;
        this.reset();
      }
      this.permutation[i]++;
      if (this.permutation[i] < this.alphabet.length) {
        break;
      }
      this.permutation[i] = 0;
    }
  }

  next(): string {
    let s = this.toString();
    this.increment();
    return s;
  }

}
