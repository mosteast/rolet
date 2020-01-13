import { T_action, T_actions, T_role, T_roles } from './type'
import { unique } from './util'
import { Lack_role } from './error/lack_role'

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
	name: string

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

	constructor()
	constructor(name: string, role: T_role<T_custom>)
	constructor(name?, role?) {
		this.name = name

		if (role) {
			this.convert(role)
		}
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
			const child = children[key] = new Rnode(key, children[key])
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

		this.walk_up(it => actions = actions.concat(it.actions))

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
	walk_up(fn: { (node: Rnode) }, opt?: T_walk_opt) {
		opt = {
			detect_boolean: false,
			...opt,
		}

		if (opt.stop && opt.stop(this)) {return}
		if (fn(this) === false && opt.detect_boolean) {return}

		if (this.parent) {
			this.parent.walk_up(fn)
		}
	}

	/**
	 * Walk along children
	 * @param {{(node: Rnode)}} fn
	 */
	walk_down(fn: { (node: Rnode) }, opt?: T_walk_opt) {
		opt = {
			detect_boolean: false,
			...opt,
		}

		if (opt.stop && opt.stop(this)) {return}
		if (fn(this) === false && opt.detect_boolean) {return}

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

	/**
	 * Find node by role name
	 */
	static find_by_role(from: Rnode, role_name: string): Rnode {
		let role: Rnode

		from.walk_down(it => {
			if (it.name === role_name) {
				role = it
				return false
			}
		}, { detect_boolean: true })

		if (role) {
			return role
		} else {
			throw new Lack_role(role_name)
		}
	}
}

export type T_rnodes = { [key: string]: Rnode }

export interface T_walk_opt {
	/**
	 * Stop condition
	 */
	stop?: { (node: Rnode): boolean },
	detect_boolean?: boolean
}
