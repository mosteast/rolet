import { T_action, T_actions, T_role, T_roles } from './type'
import { unique } from './util'

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
	actions: T_actions

	/**
	 * @see {T_role}
	 */
	children: T_rnodes

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

	/**
	 * Count direct children
	 * @returns {number}
	 */
	count_children(): number {
		const children = this.children
		if (!children) {return 0}
		return Object.keys(children).length
	}

	/**
	 * Get all actions (include inherited actions)
	 * @returns {T_action[]}
	 */
	collect_actions(): T_action[] {
		let actions = []

		this.walk_up(it => {
			console.log(it)
			actions = actions.concat(it.actions)
		})

		return unique(actions)
	}

	/**
	 * Count all descendants
	 * @returns {number}
	 */
	count_descendants(): number {
		let count = 0
		this.walk_down(node => count += node.count_children())
		return count
	}

	/**
	 * Count all ascendants
	 * @returns {number}
	 */
	count_ascendants(): number {
		let count = 0
		this.walk_up(node => count += 1)
		return count - 1
	}

	/**
	 * Walk along parents
	 * @param {{(node: Rnode)}} fn
	 */
	walk_up(fn: { (node: Rnode) }) {
		fn(this)
		if (this.parent) {
			this.parent.walk_up(fn)
		}
	}

	/**
	 * Walk along children
	 * @param {{(node: Rnode)}} fn
	 */
	walk_down(fn: { (node: Rnode) }) {
		fn(this)
		const children = this.children
		if (children) {
			for (let key in children) {
				children[key].walk_down(fn)
			}
		}
	}

	/**
	 * Walk up 1 level
	 * @param {{(parent: T_role<T_custom>)}} fn
	 */
	up(fn: { (parent: T_role<T_custom>) }) {
		fn(this.parent)
	}

	/**
	 * Walk down 1 level
	 * @param {{(parent: T_role<T_custom>)}} fn
	 */
	down(fn: { (children: T_roles<T_custom>) }) {
		fn(this.children)
	}
}

export type T_rnodes = { [key: string]: Rnode }
