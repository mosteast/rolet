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
					a1: {
						actions: [ 'a1.action1', 'a1.action2' ],
					},
					a2: {
						actions: [ 'a2.action1', 'a2.action2' ],
					},
				},
			},
			b: {
				actions: [ 'b.action1' ],
				children: {
					b1: {
						actions: [ 'b1.action1', 'b1.action2' ],
					},
					b2: {
						actions: [ 'b2.action1', 'b2.action2' ],
					},
					b3: {
						actions: [ 'b3.action1', 'b3.action2' ],
					},
				},
			},
		},
	})

	expect(rolet.can('a', 'a.action1')).toBeTruthy()
	expect(rolet.can('a', 'a1.action1')).toBeFalsy()
	expect(rolet.can('a1', 'a1.action1')).toBeTruthy()
	expect(rolet.can('a1', 'a1.action2')).toBeTruthy()

	expect(rolet.can('b', 'b.action1')).toBeTruthy()
	expect(rolet.can('b', 'b1.action1')).toBeFalsy()
	expect(rolet.can('b', 'b1.action1')).toBeFalsy()
	expect(rolet.can('b1', 'b1.action1')).toBeTruthy()

})
