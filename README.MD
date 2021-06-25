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

