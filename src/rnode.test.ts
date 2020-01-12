import { Rnode } from './rnode'
import { T_role } from './type'

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
	const ins = new Rnode({
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
	const ins = new Rnode({
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
	const ins = new Rnode({
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


