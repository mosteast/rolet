export class Lack_role extends Error {
	name = 'Lack_role'

	constructor(name: string) {
		super(`Undefined role "${name}" detected. Role names should be defined before using.`)
	}
}
