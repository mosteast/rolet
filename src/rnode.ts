import { T_can, T_role, T_roles } from './type'

/**
 * Role node
 *
 * Each node stands for a role, and there is a set of potential permissions
 * behind it.
 */
export class Rnode<T_custom = any> implements T_role {

	/**
	 * @see {T_role}
	 */
	can: T_can

	/**
	 * @see {T_role}
	 */
	children: T_rnode_map

	/**
	 * Parent node
	 */
	parent?: Rnode<T_custom>

	/**
	 * @see {T_role}
	 */
	custom: any

	constructor(role?: T_role<T_custom>) {
		this.convert(role)
	}

	/**
	 * Convert children to rnodes
	 */
	convert(role: T_role) {

		for (let key in role) {
			this[key] = role[key]
		}

		const children = this.children

		for (let key in children) {
			const child = children[key] = new Rnode(children[key])
			child.parent = this
		}
	}

	count_children(): number {
		return Object.keys(this.children).length
	}

	count_descendent(): number {
		let count = 0
		this.walk_down(node => count += node.count_children())
		return count
	}

	count_ascendent(): number {
		let count = 0
		this.walk_up(node => count += 1)
		return count
	}

	walk_up(fn: { (node: Rnode) }) {
		fn(this)
		if (this.parent) {
			this.parent.walk_up(fn)
		}
	}

	walk_down(fn: { (node: Rnode) }) {
		fn(this)
		const children = this.children
		if (children) {
			for (let key in children) {
				children[key].walk_down(fn)
			}
		}
	}

	up(fn: { (parent: T_role<T_custom>) }) {
		fn(this.parent)
	}

	down(fn: { (children: T_roles<T_custom>) }) {
		fn(this.children)
	}
}

export type T_rnode_map = { [key: string]: Rnode }
