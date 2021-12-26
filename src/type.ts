/**
 * Role tree
 *
 * Defines all roles and their abilities.
 */
export interface T_roles<D = any, K = string> {
  [role: string]: T_role<D, K>;
}

export interface T_role<D = any, K = string> {
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
  actions?: T_actions;

  /**
   * Child nodes
   *
   * Its descendents, which will inherit all the abilities defined in `can`.
   */
  children?: T_roles<D, K>;

  /**
   * Custom data
   *
   * All custom data should placed in here.
   */
  custom?: D;

  /**
   * Same as key name
   *
   * This field will be auto generated when convert to rnode.
   */
  role?: K;
}

export type T_actions = T_action[]
export type T_action = string | RegExp | Function
