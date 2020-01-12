export class Conflict_role_name extends Error {
	constructor(name: string) {
		super(`Same role name: "${name}" detected. Role names should be unique in a role tree.`)
	}
}

Conflict_role_name.prototype.name = 'Conflict_role_name'
