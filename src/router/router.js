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
  namespaced: true,
  state: () => ({ 
    firstName: 'yuzhu',
    lastName: 'zhu'
   }),
  getters: {
    fullName: (state, getters, rootState, rootGetters) => {
      console.log(rootState)
      console.log(rootGetters.global10count)
      return state.firstName + state.lastName;
    }
  },
  mutations: { 
    changeFirstName (state) {//局部state
      state.firstName = 'daya'
      console.log(state.firstName)
    }
   },
  actions: { 
    act ({ state, commit, rootState }) {//局部context多了一个属性：rootState，代表根节点状态
      console.log(rootState)
    }
   }
}

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

window.store = store;