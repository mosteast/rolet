export function unique<T = any>(a: T[]): T[] {
	return a.filter((v, i, a) => a.indexOf(v) === i)
}
