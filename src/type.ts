/**
 * Role tree
 *
 * Defines all roles and their abilities.
 */
export interface T_roles<T_custom = any> {
	[role: string]: T_role<T_custom>
}

export interface T_role<T_custom = any> {
	/**
	 * List of abilities
	 *
	 * This node and all its descendents have these abilities.
	 *
	 * @example
	 * `[ 'change_user_password' , 'refund_order' ]`
	 *
	 * @example
	 * `[ 'user.changePassword' , 'order.refund' ]`
	 * *
	 * @example
	 * `[ changePasswordFn , Order.refundMethod ]`
	 */
	actions: T_actions

	/**
	 * Child nodes
	 *
	 * Its descendents, which will inherit all the abilities defined in `can`.
	 */
	children?: T_roles

	/**
	 * Custom data
	 *
	 * All custom data should placed in here.
	 */
	custom?: T_custom

	/**
	 * Same as key name
	 *
	 * This field will be auto generated when convert to rnode.
	 */
	name?: string
}

export type T_actions = T_action[]
export type T_action = string | RegExp | Function
