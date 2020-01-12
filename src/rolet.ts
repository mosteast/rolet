import { T_action, T_role } from './type'
import { Rnode } from './rnode'

export interface T_opt {}

export class Rolet<T_custom = any> {

	/**
	 * Raw tree
	 */
	public raw: T_role<T_custom>

	/**
	 * Parsed tree
	 */
	public root: Rnode<T_custom>

	constructor(tree: T_role<T_custom>, protected opt?: T_opt) {
		this.init(tree)
		this.opt = {
			...opt,
		}
	}

	init(node: T_role<T_custom>) {
		this.define(node)
		this.analyze()
	}

	define(node: T_role<T_custom>) {
		this.raw = Object.freeze(node)
		this.root = new Rnode<T_custom>(node)
	}

	/**
	 * Analyze Rnode tree
	 */
	analyze() {
		const r: Rnode = this.root

	}

	/**
	 * Permission check
	 * @param {string} node
	 * @param {T_action} action
	 */
	can(node: string, action: T_action) {

	}

	// /**
	//  * Walk down role tree
	//  * @param {Function} fn - Run on each node.
	//  * @param {T_role} current - Current node.
	//  * @param {string} current_key - Current node key in parent node.
	//  * @param {T_role} parent - Parent node.
	//  */
	// walk_down(fn: T_walk_down_callback, current?: T_role<T_custom>, current_key?:
	// string, parent?: T_role<T_custom>) { if (!current) {return}  fn(current_key,
	// parent)  const children: T_roles = current.children if (children) { for (let
	// key in children) { const child = children[key] this.walk_down(fn, child, key,
	// current) } } }
}
