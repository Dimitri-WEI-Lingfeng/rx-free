# Introduction

`rx-free` is a web **framework-agnostic** and light **rxjs** state management library.

## features

# Usage

## Define store
```ts
import {defineStore} from "@rx-free/react"; // for react:

import {defineStore} from "@rx-free/vue"; // for vue:

const store = defineStore('AppStore', {
  initialState: {
    count: 0,
    user: undefined
  },
  getters: {
    
    countPlus10: {
      get(st) {
        return st.count + 10
      },
      deps: ['count']
    }
  }
})
```
## Use in react component
```tsx
import store from 'src/store'
// get property from store in component scope
const Component = () => {
  const { count, countPlus10 } = store.useStore()
  return <button onClick={() => {
      store.setStore((st) => {
        // mutation in immer way
        st.count ++
      })
    }
  }>{ count } and the bigger one {countPlus10}</button>
}


// selectors
const Profile = () => {
  // only update when user changes
  const { user } = store.useStore({ keys: ['user'] })
  
  return <div>{user?.name}</div>
}
```


## Use in vue component
```vue
<template>
  <button @click="increment">{{ count }}</button>
</template>

<script setup>
import store from 'src/store'
const { count } = store.useStore()
const increment = () => {
  store.setStore((st) => {
    // mutation in immer way
    st.count ++
  })
}
</script>
```

selectors
```vue
<template>
  <div>{{ user?.name }}</div>
</template>

<script setup>
import store from 'src/store'
const { user } = store.useStore({ keys: ['user'] })
</script>
```

## Use everywhere

### get current state in your functions
```ts

function fetchCurrentPage() {
  const { page } =  store.state
  return fetch(`/pages/${page}`)
}
```

## Use rxjs' operators
```ts

store.observable$.pip()
```
