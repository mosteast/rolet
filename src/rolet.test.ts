import { T_role, T_roles } from './type'
import { Rolet } from './rolet'

it('will validate role name', async () => {
	const invalid_tree_with_same_role_names: T_role = {
		can: [ 'a_can1' ],
		children: {
			admin: {
				can: [],
			},
		},
	}

	const r = new Rolet(invalid_tree_with_same_role_names)
	console.log(r.root)
	// expect(() => {
	// }).toThrow()
})

it('walk all children', async () => {
	const tree: T_roles = {
		a:
			{
				can: [ 'a_can1' ],
				children: {
					a1: {
						can: [ 'a1_can1', 'a1_can2' ],
					},
					a2: {
						can: [ 'a2_can1', 'a2_can2' ],
					},
				},
			},
		b: {
			can: [ 'b_can1' ],
			children: {
				b1: {
					can: [ 'b1_can1', 'b1_can2' ],
				},
				b2: {
					can: [ 'b2_can1', 'b2_can2' ],
				},
				b3: {
					can: [ 'b3_can1', 'b3_can2' ],

				},
			},
		},
	}

	// const rolet = new Rolet(tree)
	// rolet.can()
})
