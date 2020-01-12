import { T_role } from './type'
import { Rolet } from './rolet'
import { Conflict_role_name } from './error/conflict_role_name'

it('will validate role name', async () => {
	const invalid_tree_with_same_role_names: T_role = {
		actions: [ 'a_can1' ],
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
	}

	expect(() => {
		new Rolet(invalid_tree_with_same_role_names)
	}).toThrow(Conflict_role_name)
})

it('can()', async () => {
	const rolet = new Rolet({
		actions: [ 'root.action1' ],
		children: {
			a: {
				actions: [ 'a.action1' ],
				children: {
					aa1: {
						actions: [ 'aa1.action1', 'aa1.action2' ],
						children: {},
					},
					aa2: {
						actions: [ 'aa2.action1', 'aa2.action2' ],
					},
				},
			},
			b: {
				actions: [ 'b.action1' ],
				children: {
					bb1: {
						actions: [ 'bb1.action1', 'bb1.action2' ],
					},
					bb2: {
						actions: [ 'bb2.action1', 'bb2.action2' ],
					},
					bb3: {
						actions: [ 'bb3.action1', 'bb3.action2' ],
						children: {
							bbb1: {
								actions: [],
								children: {
									bbbb1: {
										actions: [ 'bbbb1.action1', 'bbbb1.action2' ],
									},
								},
							},
						},
					},
				},
			},
		},
	})

	expect(rolet.can('a', 'a.action1')).toBeTruthy()
	expect(rolet.can('a', 'aa1.action1')).toBeFalsy()
	expect(rolet.can('aa1', 'aa1.action1')).toBeTruthy()
	expect(rolet.can('aa1', 'aa1.action2')).toBeTruthy()
	expect(rolet.can('aa1', 'aa2.action2')).toBeFalsy()

	expect(rolet.can('b', 'b.action1')).toBeTruthy()
	expect(rolet.can('b', 'b1.action1')).toBeFalsy()
	expect(rolet.can('b', 'b1.action1')).toBeFalsy()
	expect(rolet.can('bb1', 'bb1.action1')).toBeTruthy()
	expect(rolet.can('bb1', 'b.action1')).toBeTruthy()
	expect(rolet.can('bb1', 'bb2.action1')).toBeFalsy()
	expect(rolet.can('bb2', 'bb2.action1')).toBeTruthy()
	expect(rolet.can('bb2', 'bb1.action1')).toBeFalsy()
	expect(rolet.can('bb3', 'bb3.action1')).toBeTruthy()
	expect(rolet.can('bb3', 'bb2.action1')).toBeFalsy()

	expect(rolet.can('bbbb1', 'bbbb1.action1')).toBeTruthy()
	expect(rolet.can('bbbb1', 'bbbb1.action2')).toBeTruthy()
	expect(rolet.can('bbbb1', 'b.action1')).toBeTruthy()
})
