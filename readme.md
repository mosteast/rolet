# Rolet - Powerful user permission manager

Simple, yet powerful.

## Install

```npm i rolet```

## Getting started

```typescript
// Define role tree (or permission tree)
// _public_ (root)
//   └─regular
//        ├─salesman
//        └─premium
//             └─enterprise

const rolet = new Rolet({ // Root node, default name '_public_'
    actions: [ 'user.signup', 'user.login' ],
    children: {
        regular: { // Inherit _public_ actions
            actions: [ 'user.logout', 'user.upgrade' ],
            children: {
                salesman: { // Inherit _public_, regular actions
                    actions: [ 'salesman.action1', 'salesman.action2' ],
                },
                premium: {  // Inherit _public_, regular actions
                    actions: [ 'premium.action1', 'premium.action2' ],
                    children: {
                        enterprise: {  // Inherit _public_, regular, premium actions
                            actions: [ 'enterprise.action1', 'enterprise.action2' ],
                        },
                    },
                },
            },
        },
    },
})

rolet.can('_public_', 'user.signup') // true
rolet.can('_public_', 'user.login') // true
rolet.can('_public_', 'user.logout') // false

rolet.can('regular', 'user.signup') // true
rolet.can('regular', 'user.login') // true
rolet.can('regular', 'user.logout') // true
rolet.can('regular', 'premium.action1') // false

rolet.can('premium', 'premium.action1') // true
rolet.can('premium', 'premium.action2') // true
rolet.can('regular', 'premium.action1') // false
rolet.can('salesman', 'premium.action1') // false

rolet.can('enterprise', 'user.logout') // true
rolet.can('enterprise', 'premium.action1') // true
rolet.can('enterprise', 'enterprise.action1') // true
rolet.can('enterprise', 'salesman.action1') // false
```

### Function and Regex action

```typescript
// Define role tree (or permission tree)
// _public_ (root)
//   └─regular
//        ├─salesman
//        └─premium
//             └─enterprise

const rolet: Rolet = new Rolet({
    // Action function, which returns an action name
    actions: [ () => 'user.signup', 'user.login' ],
    children: {
        regular: {
            actions: [ 'user.logout', 'user.upgrade' ],
            children: {
                salesman: {
                    // Action regular expression, which matches actions that start with
                    // 'salesman.'
                    actions: [ /^salesman\./ ],
                },
                premium: {
                    // matches actions that start with 'premium'
                    actions: [ /^premium/ ],
                    children: {
                        enterprise: {
                            actions: [
                            	// 'enterprise.action1'
                                'enterprise.action1',
                                // A function that returns 'enterprise.action2'
                                () => 'enterprise.action2',
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
})

rolet.can('_public_', 'user.signup') // true

rolet.can('regular', 'user.signup') // true
rolet.can('regular', 'premium.action1') // false

rolet.can('premium', 'premium.action1') // true
rolet.can('premium', 'premium_extend.action2') // true
rolet.can('premium', 'premium_special_action') // true
rolet.can('regular', 'premium.action1') // false
rolet.can('regular', 'premium_special_action') // false
rolet.can('salesman', 'premium.action1') // false

rolet.can('salesman', 'salesman.action1') // true
rolet.can('salesman', 'not_exist.action1') // false

rolet.can('enterprise', 'user.logout') // true
rolet.can('enterprise', 'premium.action1') // true
rolet.can('enterprise', 'enterprise.action1') // true
rolet.can('enterprise', 'enterprise.action2') // true
rolet.can('enterprise', 'enterprise.read_log') // true
rolet.can('enterprise', 'enterprise.delete_log') // false
rolet.can('enterprise', 'enterprise.delete_access_log') // true
rolet.can('enterprise', 'enterprise.update_access_log') // false
rolet.can('enterprise', 'salesman.action1') // false
rolet.can('premium', 'enterprise.action2') // false

```

## Test

```npm t```
