import { Rnode } from './rnode'
import { T_role } from './type'
import { DEFAULT_ROOT } from './rolet'

it('convert()', async () => {
	const ins = new Rnode()

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
	}

	ins.convert(root)

	expect(ins).toBeInstanceOf(Rnode)
	expect(ins.children.a).toBeInstanceOf(Rnode)
	expect(ins.children.a.children.a1).toBeInstanceOf(Rnode)
	expect(ins.children.b).toBeInstanceOf(Rnode)
})

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
	})

	expect(ins.count_children()).toBe(2)
	expect(ins.children.a.count_children()).toBe(1)
	expect(ins.children.b.count_children()).toBe(0)
})

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
	})

	expect(ins.count_descendants()).toBe(4)
	expect(ins.children.a.count_descendants()).toBe(2)
	expect(ins.children.b.count_descendants()).toBe(0)
})

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
	})

	expect(ins.count_ascendants()).toBe(0)
	expect(ins.children.a.count_ascendants()).toBe(1)
	expect(ins.children.a.children.a1.count_ascendants()).toBe(2)
	expect(ins.children.b.count_ascendants()).toBe(1)
})

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
	})

	expect(ins.collect_actions()).toEqual([ 'root_action1' ])
	expect(ins.children.a.collect_actions()).toEqual([ 'a_action1', 'a_action2', 'root_action1' ])
	expect(ins.children.a.children.a1.collect_actions()).toEqual([ 'a1_action1', 'a1_action2', 'a_action1', 'a_action2', 'root_action1' ])
	expect(ins.children.b.collect_actions()).toEqual([ 'b_action1', 'b_action2', 'root_action1' ])
	expect(ins.children.b.children.b1.collect_actions()).toEqual([ 'b1_action1', 'b1_action2', 'b_action1', 'b_action2', 'root_action1' ])
})


