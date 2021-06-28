[toc] 

# Vuex3.0 官网文档理解

>  官网地址：https://vuex.vuejs.org/zh/



### 1、Vue版本理解

> 2.6.0之前：老版vue
>
> 2.6.0之后：对插槽等进行修改
>
> 3.0：全新vue



Vuex版本理解：

> 3.0
>
> 4.0

### 2、搭配版本：

Vue2.6.14 + Vuex3.6.2



### 3、Vue中关于赋值

data对象上直接赋值时，特别注意：原始值将失去与源数据的联动！

```js
    data: {
        message: 'Hello Vue!',
        num: store.state.count, //联动无效--原始值赋值，num与store.state.count被隔断
    },
```

有时开发中，需要与源数据失去联动的情况，比如组件上添值，关闭组件后再次打开时，还渲染默认的值，而非上一次修改后的值

通过computed来关联属性：

```js
    computed: {
        num() {
            return this.$store.state.count;
        },
    },
```



### 4、Vue实例对象上的属性，通过$来访问：

```js
new Vue({
    el: '#app',
    router,
    store,
    methods: {
        fun() {
            console.log(this.$router)//访问路由对象
            console.log(this.$store)//访问vuex对象
        }
    }
})
```



### 5、Vuex store对象上的属性访问

```js
this.$store.state //访问state
this.$store.getters //访问getters--> Getter 会暴露为 store.getters 对象
```



### 6、Vuex中的getters

> 说明：getters指Vuex中的getters对象；getter是getters中的每个属性

可以得到Vuex的计算属性，也可以得到Vuex的计算方法

通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

使用该计算方法：

```js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。——相当于Vuex提供了methods方法



实际上，计算属性computed也可以返回方法，从而提供方法使用——类似于methods

```js
    computed: {
        computedFunc () {
            return str => {
                console.log(...str)
            }
        }
    },
```

```html
<button @click="computedFunc('abc')">点击我</button>
```



那么为什么computed计算属性不特别这么做，而Vuex中的getters有时候需要这么做呢？因为vue实例和组价中的有methods方法，就是提供方法的。

而Vuex中，没有提供方法的入口，可以通过getters来提供相对应的方法。



getters，为什么叫getters，就在于有getter特性：

每次访问getters内的属性时，就会执行对应的函数体。——有别于computed

比如：

```js
    getters: {
      count10: state => 10*(state.count),
      todo (state, getters) {
        console.log(getters.count10)
      }
    },
```

其他地方访问该属性：

```js
this.$store.getters.todo;
```



getter还可以接收第二个参数getters，来访问getters下的其他getter

```js
getters: {
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```



### 7、vue中的computed

computed内是多个方法，代表计算属性，如下：

```js
    computed: {
        num() {
            console.log(1111)
            return this.$store.state.count;
        },
        num10 () {
            return this.$store.getters.count10; //Getter 会暴露为 store.getters 对象
        },
    },
```

初始化时，每个计算属性的函数都必须执行一次，因为函数变量从未初始化到初始化赋值，是一次赋值行为，会执行函数体；函数return值发生变化时，也会执行函数体。



### 8、mutation

> 说明：mutations对象内的每个属性方法为mutation

通过commit提交mutation的方式，来修改store中的状态

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```

```js
store.commit('increment')
```



commit提交mutation时，可以负载参数，参数最好是一个对象，也可以是别的类型的值。

比如：

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

```js
store.commit('increment', {
  amount: 10
})
```



mutation在操作store时，要遵从Vue的响应式原则，尤其是在添加新的属性时



使用常量代替mutation事件类型：——大项目或多人协作时，可以考虑

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```



```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
}
```

### 9、Vuex的store状态是响应式的

1. 最好提前在你的 store 中初始化好所有所需属性。
2. 当需要在对象上添加新属性时，你应该

- 使用 `Vue.set(obj, 'newProp', 123)`, 或者

- 以新对象替换老对象。例如，利用展开运算符，我们可以这样写：

  ```js
  state.obj = { ...state.obj, newProp: 123 }
  ```



### 10、actions

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters。

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

可以通过ES6解构参数，来简化代码：



通过Action 通过 `store.dispatch` 方法触发：

```js
store.dispatch('increment')
```



Actions 支持同样的载荷方式和对象方式进行分发：

```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```



##### actions的核心：异步

定时器触发一个任务：

```js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Action 通常是异步的，那么如何知道 action 什么时候结束呢？

让action返回一个Promise对象：

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

```js
store.dispatch('actionA').then(() => {
  // ...
})
```

在action中，也可以调用其他的action：**——组合action**

以下实例`{ dispatch, commit }`的思考：**commit和dispatch都是store对象上的方法**

```js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

通过async和await来组合action：

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

一个 `store.dispatch` 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。



### 辅助函数mapState、mapGetters、mapMutations、mapActions

#### mapState函数：

传入一个对象，返回一个对象

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

对象展开运算符

```js
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

#### mapGetters

将 store 中的 getter 映射到局部计算属性：

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

如果你想将一个 getter 属性另取一个名字，使用对象形式：

```js
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

#### mapMutations

可以在组件中使用 `this.$store.commit('xxx')` 提交 mutation，或者使用 `mapMutations` 辅助函数将组件中的 methods 映射为 `store.commit` 调用（需要在根节点注入 `store`）

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

#### mapActions

组件中使用 `this.$store.dispatch('xxx')` 分发 action，或者使用 `mapActions` 辅助函数将组件的 methods 映射为 `store.dispatch` 调用（需要先在根节点注入 `store`）

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

### 模块化store

> 如果是模块化，store对象上的state、getters、mutations、actions要如何使用？模块中的state、getters、mutations、actions书写格式

store中getters、mutations、接收的参数是state；而actions，接收的参数是context，等价于store。

实例：

```js
const moduleA = {
  state: {
    count: 0,
  },
  getters: {
    count10: state => 10*(state.count),
    todo (state, getters) {
      console.log(getters.count10)
    }
  },  
  mutations: {
    increment(state) {
        state.count ++;
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  }
}

const moduleB = {
  state: () => ({ //模块的state可以是函数，在多处使用该模块时，具有独立性
    firstName: 'yuzhu',
    lastName: 'zhu'
   }),
  getters: {
    fullName: (state, getters, rootState) => {//局部state,getters, 根节点状态。rootState可以获取所有的state
      return state.firstName + state.lastName;
    }
  },
  mutations: { 
    changeFirstName (state) {//局部state
      state.firstName = 'daya'
    }
   },
  actions: { 
    act ({ state, commit, rootState }) {//局部context多了一个属性：rootState，代表根节点状态

    }
   }
}

const store = new Vuex.Store({
  modules: {//接收modules参数
    a: moduleA,
    b: moduleB
  }
})
```



```js
this.$store.state.a.acount
this.$store.state.b.firstName

this.$store.getters.fullName //getters上有所有getter

//局部模板中的mutation和action也是直接触发
this.$store.commit('increment')
this.$store.dispatch('act')
```



#### 命名空间：

默认情况下，模块内部的 action、mutation 和 getter 是注册在**全局命名空间**的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望你的模块具有更高的封装度和复用性，你可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。启用了命名空间的 getter 和 action 会收到局部化的 `getter`，`dispatch` 和 `commit`。例如：

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: () => ({ ... }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

触发方式是，添加`/`

```js
this.$store.getters['b/fullName']

this.$store.commit('b/changeFirstName')

this.$store.dispatch('b/act')
```



如果你希望使用全局 state 和 getter，`rootState` 和 `rootGetters` 会作为第三和第四参数传入 getter，也会通过 `context` 对象的属性传入 action。

若需要在全局命名空间内分发 action 或提交 mutation，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit` 即可。

```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

在模块中，可以访问根state、根getters、已经根的commit和dispatch

```js
const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  },
  state: {
    globalCount: 100
  },
  getters: {
    global10count (state) {
      return state.globalCount * 10;
    }
  }
})
```

命名空间：

https://vuex.vuejs.org/zh/guide/modules.html#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4

