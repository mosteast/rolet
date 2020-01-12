import { T_role, T_roles } from './type'
import { Rolet } from './rolet'

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
	}).toThrow()
})

it('walk all children', async () => {
	const tree: T_roles = {
		a:
			{
				actions: [ 'a_can1' ],
				children: {
					a1: {
						actions: [ 'a1_can1', 'a1_can2' ],
					},
					a2: {
						actions: [ 'a2_can1', 'a2_can2' ],
					},
				},
			},
		b: {
			actions: [ 'b_can1' ],
			children: {
				b1: {
					actions: [ 'b1_can1', 'b1_can2' ],
				},
				b2: {
					actions: [ 'b2_can1', 'b2_can2' ],
				},
				b3: {
					actions: [ 'b3_can1', 'b3_can2' ],

				},
			},
		},
	}

	// const rolet = new Rolet(tree)
	// rolet.can()
})
