import { Conflict_role_name } from './error/conflict_role_name';
import { Rolet } from './rolet';
import { T_role } from './type';

it('will validate role name', async () => {
  const invalid_tree_with_same_role_names: T_role = {
    actions: ['a_can1'],
    children: {
      admin: {
        actions: [],
        children: {
          admin: {
            actions: [],
          },
        },
      },
    },
  };

  expect(() => {
    new Rolet(invalid_tree_with_same_role_names);
  }).toThrow(Conflict_role_name);
});

it('typical usage', async () => {
  // Define role tree (or permission tree)
  // _public_ (root)
  //   └─regular
  //        ├─salesman
  //        └─premium
  //             └─enterprise

  const rolet: Rolet = new Rolet({ // Root node, default name '_public_'
    actions: ['user.signup', 'user.login'],
    children: {
      regular: { // Inherit _public_ actions
        actions: ['user.logout', 'user.upgrade'],
        children: {
          salesman: { // Inherit _public_, regular actions
            actions: ['salesman.action1', 'salesman.action2'],
          },
          premium: {  // Inherit _public_, regular actions
            actions: ['premium.action1', 'premium.action2'],
            children: {
              enterprise: {  // Inherit _public_, regular, premium actions
                actions: ['enterprise.action1', 'enterprise.action2'],
              },
            },
          },
        },
      },
    },
  });

  expect(rolet.can('_public_', 'user.signup')).toBeTruthy();
  expect(rolet.can('_public_', 'user.login')).toBeTruthy();
  expect(rolet.can('_public_', 'user.logout')).toBeFalsy();

  expect(rolet.can('regular', 'user.signup')).toBeTruthy();
  expect(rolet.can('regular', 'user.login')).toBeTruthy();
  expect(rolet.can('regular', 'user.logout')).toBeTruthy();
  expect(rolet.can('regular', 'premium.action1')).toBeFalsy();

  expect(rolet.can('premium', 'premium.action1')).toBeTruthy();
  expect(rolet.can('premium', 'premium.action2')).toBeTruthy();
  expect(rolet.can('regular', 'premium.action1')).toBeFalsy();
  expect(rolet.can('salesman', 'premium.action1')).toBeFalsy();

  expect(rolet.can('enterprise', 'user.logout')).toBeTruthy();
  expect(rolet.can('enterprise', 'premium.action1')).toBeTruthy();
  expect(rolet.can('enterprise', 'enterprise.action1')).toBeTruthy();
  expect(rolet.can('enterprise', 'salesman.action1')).toBeFalsy();
});

it('use function and regex as actions', async () => {
  function user_signup() {}

  const enterprise = {
    action2() {},
  };

  // Define role tree (or permission tree)
  // _public_ (root)
  //   └─regular
  //        ├─salesman
  //        └─premium
  //             └─enterprise

  const rolet: Rolet = new Rolet({
    // Action function, will be compared internally using `===`,
    // Function (or any other type) will not be executed (or changed)
    actions: [user_signup, 'user.login'],
    children: {
      regular: {
        actions: ['user.logout', 'user.upgrade'],
        children: {
          salesman: {
            // Action regular expression, which matches actions that start with
            // 'salesman.'
            actions: [/^salesman\./],
          },
          premium: {
            // matches actions that start with 'premium'
            actions: [/^premium/],
            children: {
              enterprise: {
                actions: [
                  // 'enterprise.action1'
                  'enterprise.action1',
                  // Another action function
                  enterprise.action2,
                  // All actions starts with 'enterprise.read_'
                  /^enterprise\.read_/,
                  // All actions like 'enterprise.delete_{xxx}_log'
                  /^enterprise\.delete_\w+_log$/,
                ],
              },
            },
          },
        },
      },
    },
  });

  expect(rolet.can('_public_', user_signup)).toBeTruthy();
  expect(rolet.can('regular', user_signup)).toBeTruthy();
  expect(rolet.can('regular', 'premium.action1')).toBeFalsy();

  expect(rolet.can('premium', 'premium.action1')).toBeTruthy();
  expect(rolet.can('premium', 'premium_extend.action2')).toBeTruthy();
  expect(rolet.can('premium', 'premium_special_action')).toBeTruthy();
  expect(rolet.can('regular', 'premium.action1')).toBeFalsy();
  expect(rolet.can('regular', 'premium_special_action')).toBeFalsy();
  expect(rolet.can('salesman', 'premium.action1')).toBeFalsy();

  expect(rolet.can('salesman', 'salesman.action1')).toBeTruthy();
  expect(rolet.can('salesman', 'not_exist.action1')).toBeFalsy();

  expect(rolet.can('enterprise', 'user.logout')).toBeTruthy();
  expect(rolet.can('enterprise', 'premium.action1')).toBeTruthy();
  expect(rolet.can('enterprise', 'enterprise.action1')).toBeTruthy();
  expect(rolet.can('enterprise', enterprise.action2)).toBeTruthy();
  expect(rolet.can('enterprise', 'enterprise.read_log')).toBeTruthy();
  expect(rolet.can('enterprise', 'enterprise.delete_log')).toBeFalsy();
  expect(rolet.can('enterprise', 'enterprise.delete_access_log')).toBeTruthy();
  expect(rolet.can('enterprise', 'enterprise.update_access_log')).toBeFalsy();
  expect(rolet.can('enterprise', 'salesman.action1')).toBeFalsy();
  expect(rolet.can('premium', enterprise.action2)).toBeFalsy();
});

it('can', async () => {
  const rolet = new Rolet({
    actions: ['root.action1'],
    children: {
      a: {
        actions: ['a.action1'],
        children: {
          aa1: {
            actions: ['aa1.action1', 'aa1.action2'],
            children: {},
          },
          aa2: {
            actions: ['aa2.action1', 'aa2.action2'],
          },
        },
      },
      b: {
        actions: ['b.action1'],
        children: {
          bb1: {
            actions: ['bb1.action1', 'bb1.action2'],
          },
          bb2: {
            actions: ['bb2.action1', 'bb2.action2'],
          },
          bb3: {
            actions: ['bb3.action1', 'bb3.action2'],
            children: {
              bbb1: {
                actions: ['bbb1.action1', 'bbb1.action2'],
                children: {
                  bbbb1: {
                    actions: ['bbbb1.action1', 'bbbb1.action2'],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  expect(rolet.can('a', 'a.action1')).toBeTruthy();
  expect(rolet.can('a', 'aa1.action1')).toBeFalsy();
  expect(rolet.can('aa1', 'aa1.action1')).toBeTruthy();
  expect(rolet.can('aa1', 'aa1.action2')).toBeTruthy();
  expect(rolet.can('aa1', 'aa2.action2')).toBeFalsy();

  expect(rolet.can('b', 'b.action1')).toBeTruthy();
  expect(rolet.can('b', 'b1.action1')).toBeFalsy();
  expect(rolet.can('b', 'b1.action1')).toBeFalsy();
  expect(rolet.can('bb1', 'bb1.action1')).toBeTruthy();
  expect(rolet.can('bb1', 'b.action1')).toBeTruthy();
  expect(rolet.can('bb1', 'bb2.action1')).toBeFalsy();
  expect(rolet.can('bb2', 'bb2.action1')).toBeTruthy();
  expect(rolet.can('bb2', 'bb1.action1')).toBeFalsy();
  expect(rolet.can('bb3', 'bb3.action1')).toBeTruthy();
  expect(rolet.can('bb3', 'bb2.action1')).toBeFalsy();

  expect(rolet.can('bbbb1', 'bbbb1.action1')).toBeTruthy();
  expect(rolet.can('bbbb1', 'bbbb1.action2')).toBeTruthy();
  expect(rolet.can('bbbb1', 'b.action1')).toBeTruthy();

  // Any can
  expect(rolet.can(['b'], 'b.action1')).toBeTruthy();
  expect(rolet.can(['a', 'b'], 'b.action1')).toBeTruthy();
  expect(rolet.can(['b', 'bbbb1'], 'bbb1.action2')).toBeTruthy();
  expect(rolet.can(['bb1', 'b'], 'bb2.action1')).toBeFalsy();
  expect(rolet.can(['b'], 'bbbb1.action2')).toBeFalsy();
});

it('is', async () => {
  const rolet = new Rolet({
    children: {
      a: {
        children: {
          aa1: {
            children: {
              aaa1: {},
            },
          },
          aa2: {},
        },
      },
      b: {
        children: {
          bb1: {},
          bb2: {},
          bb3: {
            children: {
              bbb1: {
                children: {
                  bbbb1: {},
                },
              },
            },
          },
        },
      },
    },
  });

  expect(rolet.is(['aa2'], 'a')).toBeTruthy();
  expect(rolet.is(['aa2'], 'a')).toBeTruthy();
  expect(rolet.is(['aaa1'], 'a')).toBeTruthy();
  expect(rolet.is(['a', 'b'], 'a')).toBeTruthy();
  expect(rolet.is(['aaa1', 'b'], 'aa1')).toBeTruthy();
  expect(rolet.is(['aaa1', 'b'], 'b')).toBeTruthy();
  expect(rolet.is(['aaa1', 'bb1'], 'b')).toBeTruthy();

  expect(rolet.is(['b'], 'bb1')).toBeFalsy();
  expect(rolet.is(['aaa1'], 'b')).toBeFalsy();
  expect(rolet.is(['b'], 'a')).toBeFalsy();
  expect(rolet.is([], 'a')).toBeFalsy();
  expect(rolet.is([], 'aa1')).toBeFalsy();
  expect(rolet.is([], 'invalid_name' as any)).toBeFalsy();
});

it('calc_complete_actions', () => {
  const rolet = new Rolet<any, any>({
    actions: ['root.action1'],
    children: {
      a: {
        actions: ['a.action1'],
        children: {
          aa1: {
            actions: ['aa1.action1', 'aa1.action2'],
            children: {},
          },
          aa2: {
            actions: ['aa2.action1', 'aa2.action2'],
          },
        },
      },
      b: {
        actions: ['b.action1'],
        children: {
          bb1: {
            actions: ['bb1.action1', 'bb1.action2'],
          },
          bb2: {
            actions: ['bb2.action1', 'bb2.action2'],
          },
          bb3: {
            actions: ['bb3.action1', 'bb3.action2'],
            children: {
              bbb1: {
                actions: ['bbb1.action1', 'bbb1.action2'],
                children: {
                  bbbb1: {
                    actions: ['bbbb1.action1', 'bbbb1.action2'],
                  },
                },
              },
            },
          },
        },
      },
    },
  }, { super: 'super' });

  expect(rolet.calc_complete_actions('a')).toEqual(['a.action1', 'root.action1']);
  expect(rolet.calc_complete_actions('aa1')).toEqual(['aa1.action1', 'aa1.action2', 'a.action1', 'root.action1']);
  expect(rolet.calc_complete_actions('aa2')).toEqual(['aa2.action1', 'aa2.action2', 'a.action1', 'root.action1']);
  expect(rolet.calc_complete_actions('b')).toEqual(['b.action1', 'root.action1']);
  expect(rolet.calc_complete_actions('bb1')).toEqual(['bb1.action1', 'bb1.action2', 'b.action1', 'root.action1']);
  expect(rolet.calc_complete_actions('bb2')).toEqual(['bb2.action1', 'bb2.action2', 'b.action1', 'root.action1']);
  expect(rolet.calc_complete_actions('super')).toEqual([
    'root.action1', 'a.action1',
    'aa1.action1', 'aa1.action2',
    'aa2.action1', 'aa2.action2',
    'b.action1', 'bb1.action1',
    'bb1.action2', 'bb2.action1',
    'bb2.action2', 'bb3.action1',
    'bb3.action2', 'bbb1.action1',
    'bbb1.action2', 'bbbb1.action1',
    'bbbb1.action2'
  ]);
});

it('enum roles', async () => {
  enum N_role {
    a = 'a',
    b = 'b',
  }

  new Rolet<any, N_role>({
    children: {
      [N_role.a]: {
        children: {
          [N_role.b]: {},
        },
      },
    },
  });
  new Rolet<any, string>({
    children: {
      [N_role.a]: {},
      aa: {},
    },
  });
  new Rolet<any, string | N_role>({
    children: {
      [N_role.a]: {},
      [N_role.b]: {},
      aa: {},
    },
  });
});
