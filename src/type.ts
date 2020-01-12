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
	can: T_can

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
}

export type T_can = T_action[]
export type T_action = any
