import { Rnode } from './rnode';
import { DEFAULT_ROOT } from './rolet';
import { T_role } from './type';

it('convert()', async () => {
  const ins = new Rnode();

  const root: T_role = {
    actions: [],
    children: {
      a: {
        actions: [],
        children: {
          a1: {
            actions: [],
          },
        },
      },
      b: {
        actions: [],
      },
    },
  };

  ins.convert(root);

  expect(ins).toBeInstanceOf(Rnode);
  expect(ins.children?.a).toBeInstanceOf(Rnode);
  expect(ins.children?.a.children?.a1).toBeInstanceOf(Rnode);
  expect(ins.children?.b).toBeInstanceOf(Rnode);
});

it('count_children()', async () => {
  const ins = new Rnode(DEFAULT_ROOT, {
    actions: [],
    children: {
      a: {
        actions: [],
        children: {
          a1: {
            actions: [],
          },
        },
      },
      b: {
        actions: [],
      },
    },
  });

  expect(ins.count_children()).toBe(2);
  expect(ins.children?.a.count_children()).toBe(1);
  expect(ins.children?.b.count_children()).toBe(0);
});

it('count_descendants()', async () => {
  const ins = new Rnode(DEFAULT_ROOT, {
    actions: [],
    children: {
      a: {
        actions: [],
        children: {
          a1: {
            actions: [],
          },
          a2: {
            actions: [],
          },
        },
      },
      b: {
        actions: [],
      },
    },
  });

  expect(ins.count_descendants()).toBe(4);
  expect(ins.children?.a.count_descendants()).toBe(2);
  expect(ins.children?.b.count_descendants()).toBe(0);
});

it('count_ascendants()', async () => {
  const ins = new Rnode(DEFAULT_ROOT, {
    actions: [],
    children: {
      a: {
        actions: [],
        children: {
          a1: {
            actions: [],
          },
          a2: {
            actions: [],
          },
        },
      },
      b: {
        actions: [],
      },
    },
  });

  expect(ins.count_ascendants()).toBe(0);
  expect(ins.children?.a.count_ascendants()).toBe(1);
  expect(ins.children?.a.children?.a1.count_ascendants()).toBe(2);
  expect(ins.children?.b.count_ascendants()).toBe(1);
});

it('collect_actions()', async () => {
  const ins = new Rnode(DEFAULT_ROOT, {
    actions: [ 'root_action1' ],
    children: {
      a: {
        actions: [ 'a_action1', 'a_action2' ],
        children: {
          a1: {
            actions: [ 'a1_action1', 'a1_action2' ],
          },
          a2: {
            actions: [ 'a2_action1', 'a2_action2' ],
          },
        },
      },
      b: {
        actions: [ 'b_action1', 'b_action2' ],
        children: {
          b1: {
            actions: [ 'b1_action1', 'b1_action2' ],
          },
        },
      },
    },
  });

  expect(ins.collect_actions()).toEqual([ 'root_action1' ]);
  expect(ins.children?.a.collect_actions()).toEqual([ 'a_action1', 'a_action2', 'root_action1' ]);
  expect(ins.children?.a.children?.a1.collect_actions()).toEqual([ 'a1_action1', 'a1_action2', 'a_action1', 'a_action2', 'root_action1' ]);
  expect(ins.children?.b.collect_actions()).toEqual([ 'b_action1', 'b_action2', 'root_action1' ]);
  expect(ins.children?.b.children?.b1.collect_actions()).toEqual([ 'b1_action1', 'b1_action2', 'b_action1', 'b_action2', 'root_action1' ]);
});

it('collect_values()', async () => {
  const ins = new Rnode(DEFAULT_ROOT, {
    custom: { x: 'root' },
    actions: [ 'root_action1' ],
    children: {
      a: {
        custom: { x: 'a' },
        children: {
          a1: {
            custom: { x: 'a1' },
          },
          a2: {
            custom: { x: 'a2' },
          },
        },
      },
      b: {
        custom: { x: 'b' },
        children: {
          b1: {
            custom: { x: 'b1' },
          },
        },
      },
    },
  });

  expect(ins.collect_values('custom.x')).toEqual([ 'root' ]);
  expect(ins.children?.a.collect_values('custom.x')).toEqual([ 'a', 'root' ]);
  expect(ins.children?.a.children?.a1.collect_values('custom.x')).toEqual([ 'a1', 'a', 'root' ]);
  expect(ins.children?.a.children?.a2.collect_values('custom.x')).toEqual([ 'a2', 'a', 'root' ]);
  expect(ins.children?.b.collect_values('custom.x')).toEqual([ 'b', 'root' ]);
  expect(ins.children?.b.children?.b1.collect_values('custom.x')).toEqual([ 'b1', 'b', 'root' ]);
});
