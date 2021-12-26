export class Conflict_role_name<K = string> extends Error {
	name = 'Conflict_role_name'

	constructor(name: K) {
		super(`Same role name: "${name}" detected. Role names should be unique in a role tree.`)
	}
}
