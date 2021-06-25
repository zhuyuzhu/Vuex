const store = new Vuex.Store({
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
})
window.store = store;