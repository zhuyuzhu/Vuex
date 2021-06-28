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
            return this.$store.state.a.count;
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
            this.$store.commit('b/changeFirstName')
            this.$store.dispatch('b/act')
            console.log(this.$store.getters['b/fullName'])
            
        }
    }
})

// 使用 Mock
var data = Mock.mock('http://localhost:52330/getdata',{
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1
    }]
})
// 输出结果
axios.get('http://localhost:52330/getdata').then(
    (res) => {
        console.log(res.data.list)
    }
)
