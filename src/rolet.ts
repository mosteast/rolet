import { flatten } from 'lodash';
import uniq from 'lodash.uniq';
import { Conflict_role_name } from './error/conflict_role_name';
import { Rnode } from './rnode';
import { T_action, T_actions, T_role } from './type';

export const DEFAULT_ROOT = '_public_';

export interface T_opt<D = any, K = string> {
  /**
   * Name for default root node (since root node doesn't have a
   * parent which contains it's key name)
   */
  root_name?: K;

  /**
   * Super role, which pass all permissions
   */
  super?: K;
}

/**
 * Role and permission manager
 */
export class Rolet<D = any, K = string> {

  /**
   * All actions
   */
  actions!: T_actions[];
  /**
   * Raw tree
   */
  raw!: T_role<D, K>;
  /**
   * All roles as string
   */
  roles!: K[];
  /**
   * Parsed tree
   */
  root!: Rnode<D, K>;
  /**
   * Options
   */
  protected opt!: T_opt<D, K> & { root_name: K };

  constructor(tree: T_role<D, K>, opt?: T_opt<D, K>) {
    this.opt = {
      root_name: DEFAULT_ROOT as any,
      ...opt,
    };

    this.init(tree);
  }

  /**
   * Analyze Rnode tree and create cache
   */
  analyze() {
    let roles: K[]           = [],
        actions: T_actions[] = [];

    const r: Rnode<D, K> = this.root;

    r.walk_down(node => {
      const name = node.role as K;

      if (roles.includes(name)) {
        throw new Conflict_role_name<K>(name);
      } else {
        roles.push(name);
      }

      actions = actions.concat(node.actions as string[] || []);
    });

    this.roles = roles;
    this.actions = actions;
  }

  /**
   * Collect complete roles upward through ancestors
   */
  calc_complete_actions(roles: K[] | K): T_actions {
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
  calc_complete_roles(roles: K[] | K): K[] {
    roles = this.roles_normalize(roles);

    let r: K[] = [];
    for (const it of roles) {
      r = r.concat(this._calc_complete_values_single<K>(it, 'role') || []);
    }
    return uniq(r);
  }

  /**
   * Collect complete roles upward through ancestors
   */
  calc_complete_values<T = any>(roles: K[] | K, path: string, direction: 'up' | 'down' = 'up'): T[] {
    roles = this.roles_normalize(roles);

    let r: T[] = [];
    for (const it of roles) {
      r = r.concat(this._calc_complete_values_single(it, path) || []);
    }

    return uniq<T>(r);
  }

  /**
   * Permission check
   * @param roles
   * @param {T_action} action
   */
  can(roles: K | K[], action: T_action): boolean {
    roles = this.roles_normalize(roles);

    if (this.opt.super && roles.includes(this.opt.super)) { return true; }

    for (let it of roles) {
      const actions = this
        .find_by_role(it)
        ?.collect_actions();

      if (!actions?.length) { continue; }

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

  find_by_role(role_name: K) {
    return Rnode.find_by_role(this.root, role_name);
  }

  /**
   * Init rolet
   * @param node
   */
  init(node: T_role<D, K>) {
    this.load(node);
    this.analyze();
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
  is(roles: K[] | K, role: K, { all }: { all?: boolean } = { all: false }): boolean {
    roles = this.roles_normalize(roles);

    if (this.opt.super && roles.includes(this.opt.super)) { return true; }

    for (const it of roles) {
      const collection = this._calc_complete_values_single(it, 'role');
      if (!collection?.length) { continue; }
      if (all) {
        if (!collection.includes(role)) { return false; }
      } else {
        if (collection.includes(role)) { return true; }
      }
    }

    return !!all;
  }

  /**
   * Define raw tree and create rnodes
   */
  load(node: T_role<D, K>) {
    this.raw = Object.freeze(node);
    this.root = new Rnode<D, K>(this.opt.root_name, node);
  }

  roles_normalize(roles: K | K[]): K[] {
    if (!roles) {
      roles = [];
    }

    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    const root = this.opt.root_name as K;
    if (!roles.includes(root)) {
      roles.push(root);
    }

    return roles;
  }

  /**
   * Collect roles upward through ancestors
   */
  private _calc_complete_values_single<V>(role: K, path: string): V[] | undefined {
    const node = Rnode.find_by_role<D, K>(this.root, role);
    return node?.collect_values(path);
  }
}
