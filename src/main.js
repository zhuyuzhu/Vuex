let vm = new Vue({
    el: '#app',
    template: `<div>
        <span>{{message}}</span>
        <span>{{num}}</span>
        <span>{{num10}}</span>
        <button @click="add">num++</button>
    </div>`,
    store,
    data: {
        message: 'Hello Vue!',
        //num: store.state.count, //联动无效--原始值赋值，num与store.state.count被隔断
    },
    computed: {
        num() {
            console.log(1111)
            return this.$store.state.count;
        },
        num10 () {
            return this.$store.getters.count10; //Getter 会暴露为 store.getters 对象
        },
        computedFunc () {
            return str => {
                this.$store.getters.todo;
            }
        }
    },
    methods: {
        add() {
            //this.$store.commit('increment') //this.$store代表了vm对象上的属性
            //this.computedFunc('zyz')
            this.$store.getters.todo;
            this.num;
        }
    }
})

