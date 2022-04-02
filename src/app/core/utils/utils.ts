
export function findIndexes(word: string, str: string): number[];
export function findIndexes(word: string, str: string): number[] {
    const indices: number[] = [];
    for (let i = 0; i < word.length; i++) {
        if (word[i] === str) { indices.push(i); };
    }
    return indices;
}
