import { T_action, T_role } from './type'
import { Rnode } from './rnode'
import { Conflict_role_name } from './error/conflict_role_name'

export const DEFAULT_ROOT = '_public_'

export interface T_opt {
	/**
	 * Name for default root node (since root node doesn't have a parent which
	 * contains it's key name)
	 */
	root_name: string
}

/**
 * Role and permission manager
 */
export class Rolet<T_custom = any> {

	/**
	 * Raw tree
	 */
	raw: T_role<T_custom>

	/**
	 * Parsed tree
	 */
	root: Rnode<T_custom>

	/**
	 * All roles as string
	 */
	roles: string[]

	/**
	 * All actions
	 */
	actions: string[]

	/**
	 * Options
	 */
	protected opt?: T_opt

	constructor(tree: T_role<T_custom>, opt?: T_opt) {
		this.opt = {
			root_name: DEFAULT_ROOT,
			...opt,
		}

		this.init(tree)
	}

	init(node: T_role<T_custom>) {
		this.load(node)
		this.analyze()
	}

	/**
	 * Define raw tree and create rnodes
	 * @param {T_role<T_custom>} node
	 */
	load(node: T_role<T_custom>) {
		this.raw = Object.freeze(node)
		this.root = new Rnode<T_custom>(this.opt.root_name, node)
	}

	/**
	 * Analyze Rnode tree and create cache
	 */
	analyze() {
		let roles   = []
			, actions = []

		const r: Rnode = this.root

		r.walk_down(node => {
			const name = node.name

			if (roles.includes(name)) {
				throw new Conflict_role_name(name)
			} else {
				roles.push(name)
			}

			actions = actions.concat(node.actions)
		})

		this.roles = roles
		this.actions = actions
	}

	/**
	 * Permission check
	 * @param {string|string[]} node
	 * @param {T_action} action
	 */
	can(role_name: string | string[], action: string): boolean {
		if (typeof role_name === 'string') {
			role_name = [ role_name ]
		}

		for (let it of role_name) {
			const actions = this
				.find_by_role(it)
				.collect_actions()

			for (let it2 of actions) {
				if (typeof it2 === 'string') {
					if (it2 === action) {
						return true
					}
				} else {
					if (it2 instanceof RegExp && it2.test(action)) {
						return true
					} else if (it2 instanceof Function && it2() === action) {
						return true
					}
				}
			}
		}

		return false
	}

	find_by_role(role_name: string) {
		return Rnode.find_by_role(this.root, role_name)
	}
}
