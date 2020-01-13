# Rolet - Powerful user permission management

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


## Test

```npm t```
