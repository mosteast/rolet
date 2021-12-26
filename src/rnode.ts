import { get, isNil } from 'lodash';
import uniq from 'lodash.uniq';
import { T_action, T_actions, T_role, T_roles } from './type';

/**
 * Role node
 *
 * Each node stands for a role, and there is a set of potential
 * permissions behind it.
 */
export class Rnode<D = any, K extends string = string> implements T_role<D, K> {
  /**
   * Action type
   */
  actions?: T_actions;
  /**
   * Child nodes map
   */
  children?: T_rnodes<D, K>;
  /**
   * @see {T_role}
   */
  custom?: D;
  /**
   * Parent node
   */
  parent?: Rnode<D, K>;
  /**
   * Role name
   */
  role?: K;

  constructor()
  constructor(name: K, role: T_role<D, K>)
  constructor(name?: K, role?: any) {
    this.role = name;

    if (role) {
      this.convert(role);
    }
  }

  /**
   * Get all actions (include inherited actions)
   */
  collect_actions(): T_action[] {
    let r: T_action[] = [];
    this.walk_up(it => r = r.concat(it.actions || []));
    return uniq(r);
  }

  /**
   * Sum node roles
   */
  collect_roles(direction: 'up' | 'down' = 'up'): string[] {
    return this.collect_values('role', direction);
  }

  /**
   * Sum node roles
   */
  collect_values<T = any>(path: keyof Rnode | string, direction: 'up' | 'down' = 'up'): T[] {
    let r = [get(this, path)];

    const method = ('walk_' + direction) as keyof Rnode;
    // @ts-ignore
    this[method]((it: Rnode) => {
      const value = get(it, path);
      if (isNil(value)) { return; }
      r.push(value);
    });

    return uniq(r);
  }

  /**
   * Convert children to rnodes
   */
  convert(role: T_role<D, K>) {

    for (let key in role) {
      // @ts-ignore
      this[key] = role[key];
    }

    const children = this.children as T_rnodes<D, K>;

    if (!children) { return; }
    for (let key in children) {
      // @ts-ignore
      const child: Rnode<D, K> = children[key] = new Rnode(key, children[key]);
      child.parent = this;
    }
  }

  /**
   * Count all ascendants
   * @returns {number}
   */
  count_ascendants(): number {
    let count = 0;
    this.walk_up(node => count += 1);
    return count - 1;
  }

  /**
   * Count direct children
   * @returns {number}
   */
  count_children(): number {
    const children = this.children;
    if (!children) {return 0;}
    return Object.keys(children).length;
  }

  /**
   * Count all descendants
   * @returns {number}
   */
  count_descendants(): number {
    let count = 0;
    this.walk_down(node => count += node.count_children());
    return count;
  }

  /**
   * Walk down 1 level
   * @param {{(parent: T_role<T_custom>)}} fn
   */
  down(fn: (children: T_roles<D, K>) => any) {
    if (this.children) {
      fn(this.children);
    }
  }

  /**
   * Walk up 1 level
   * @param {{(parent: T_role<T_custom>)}} fn
   */
  up(fn: (parent: T_role<D, K>) => any) {
    if (this.parent) {
      fn(this.parent);
    }
  }

  /**
   * Walk along children
   * @param {{(node: Rnode)}} fn
   */
  walk_down(fn: (node: Rnode<D, K>) => any, opt?: T_walk_opt<D, K>) {
    opt = {
      detect_boolean: false,
      ...opt,
    };

    if (opt.stop && opt.stop(this)) {return;}
    if (fn(this) === false && opt.detect_boolean) {return;}

    const children = this.children;
    if (children) {
      for (let key in children) {
        children[key]?.walk_down(fn);
      }
    }
  }

  /**
   * Walk along parents
   * @param {{(node: Rnode)}} fn
   */
  walk_up(fn: (node: Rnode<D, K>, name?: K) => any, opt?: T_walk_opt<D, K>) {
    opt = {
      detect_boolean: false,
      ...opt,
    };

    if (opt.stop && opt.stop(this)) {return;}
    if (fn(this, this.role) === false && opt.detect_boolean) {return;}

    if (this.parent) {
      this.parent.walk_up(fn, opt);
    }
  }

  /**
   * Find node by role name
   */
  static find_by_role<D = any, K extends string = string>(from: Rnode<D, K>, name: K): Rnode<D, K> | undefined {
    let role: Rnode<D, K>;

    from.walk_down(it => {
      if (it.role === name) {
        role = it;
        return false;
      }
    }, { detect_boolean: true });

    // @ts-ignore
    if (role) {
      return role;
    }
  }
}

export type T_rnodes<D = any, K extends string = string> = {
  [key in K]?: Rnode<D, K>;
};

export interface T_walk_opt<D = any, K extends string = string> {
  detect_boolean?: boolean
  /**
   * Stop condition
   */
  stop?: { (node: Rnode<D, K>): boolean },
}
