import { flatten } from 'lodash';
import uniq from 'lodash.uniq';
import { Conflict_role_name } from './error/conflict_role_name';
import { Rnode } from './rnode';
import { T_action, T_actions, T_role } from './type';

export const DEFAULT_ROOT = '_public_';

export interface T_opt {
  /**
   * Name for default root node (since root node doesn't have a
   * parent which contains it's key name)
   */
  root_name?: string;

  /**
   * Super role, which pass all permissions
   */
  super?: string;
}

/**
 * Role and permission manager
 */
export class Rolet<T_custom = any> {

  /**
   * Raw tree
   */
  raw!: T_role<T_custom>;

  /**
   * Parsed tree
   */
  root!: Rnode<T_custom>;

  /**
   * All roles as string
   */
  roles!: string[];

  /**
   * All actions
   */
  actions!: T_actions[];

  /**
   * Options
   */
  protected opt!: T_opt & { root_name: string };

  constructor(tree: T_role<T_custom>, opt?: T_opt) {
    this.opt = {
      root_name: DEFAULT_ROOT,
      ...opt,
    };

    this.init(tree);
  }

  /**
   * Init rolet
   * @param node
   */
  init(node: T_role<T_custom>) {
    this.load(node);
    this.analyze();
  }

  /**
   * Define raw tree and create rnodes
   */
  load(node: T_role<T_custom>) {
    this.raw = Object.freeze(node);
    this.root = new Rnode<T_custom>(this.opt.root_name, node);
  }

  /**
   * Analyze Rnode tree and create cache
   */
  analyze() {
    let roles: string[]      = [],
        actions: T_actions[] = [];

    const r: Rnode = this.root;

    r.walk_down(node => {
      const name = node.role;

      if (roles.includes(name)) {
        throw new Conflict_role_name(name);
      } else {
        roles.push(name);
      }

      actions = actions.concat(node.actions as string[] || []);
    });

    this.roles = roles;
    this.actions = actions;
  }

  /**
   * Is {roles} a {role}?
   *
   * is(['admin'], 'admin') --> true
   * is(['admin'], '_public_') --> true
   * is(['admin', 'employee'], 'employee') --> true
   *
   * is(['employee'], 'admin') --> false
   * is(['_public_'], 'admin') --> false
   * is(['_public_'], 'employee') --> false
   */
  is(roles: string[] | string, role: string, { all }: { all?: boolean } = { all: false }): boolean {
    roles = this.roles_normalize(roles);

    if (this.opt.super && roles.includes(this.opt.super)) { return true; }

    for (const it of roles) {
      const collection = this._calc_complete_values_single(it, 'role');
      if ( ! collection?.length) { continue; }
      if (all) {
        if ( ! collection.includes(role)) { return false; }
      } else {
        if (collection.includes(role)) { return true; }
      }
    }

    return !! all;
  }

  /**
   * Collect complete roles upward through ancestors
   */
  calc_complete_actions(roles: string[] | string): T_actions {
    roles = this.roles_normalize(roles);

    let r: T_actions[] = [];
    for (const it of roles) {
      r = r.concat(this._calc_complete_values_single<T_actions>(it, 'actions') || []);
    }

    return uniq(flatten(r));
  }

  /**
   * Collect complete roles upward through ancestors
   */
  calc_complete_roles(roles: string[] | string): string[] {
    roles = this.roles_normalize(roles);

    let r: string[] = [];
    for (const it of roles) {
      r = r.concat(this._calc_complete_values_single(it, 'role') || []);
    }
    return uniq(r);
  }

  /**
   * Collect complete roles upward through ancestors
   */
  calc_complete_values<T = any>(roles: string[] | string, path: string, direction: 'up' | 'down' = 'up'): T[] {
    roles = this.roles_normalize(roles);

    let r: T[] = [];
    for (const it of roles) {
      r = r.concat(this._calc_complete_values_single(it, path) || []);
    }

    return uniq<T>(r);
  }

  /**
   * Collect roles upward through ancestors
   */
  private _calc_complete_values_single<T = any>(role: string, path: string): T[] | undefined {
    const node = Rnode.find_by_role(this.root, role);
    return node?.collect_values(path);
  }

  /**
   * Permission check
   * @param roles
   * @param {T_action} action
   */
  can(roles: string | string[], action: string | object | Function | RegExp): boolean {
    roles = this.roles_normalize(roles);

    if (this.opt.super && roles.includes(this.opt.super)) { return true; }

    for (let it of roles) {
      const actions = this
        .find_by_role(it)
        ?.collect_actions();

      if ( ! actions?.length) { continue; }

      for (let it2 of actions) {
        if (it2 instanceof RegExp && typeof action === 'string' && it2.test(action)) {
          return true;
        } else {
          if (it2 === action) {
            return true;
          }
        }
      }
    }

    return false;
  }

  find_by_role(role_name: string) {
    return Rnode.find_by_role(this.root, role_name);
  }

  roles_normalize(roles: string | string[]): string[] {
    if ( ! roles) {
      roles = [];
    }

    if ( ! Array.isArray(roles)) {
      roles = [ roles ];
    }
    const root = this.opt.root_name;
    if ( ! roles.includes(root)) {
      roles.push(root);
    }

    return roles;
  }
}
