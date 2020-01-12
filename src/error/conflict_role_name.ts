export class Conflict_role_name extends Error {
	name = 'Conflict_role_name'

	constructor(name: string) {
		super(`Same role name: "${name}" detected. Role names should be unique in a role tree.`)
	}
}
