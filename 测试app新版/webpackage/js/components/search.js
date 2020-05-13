Vue.component("Search",{
    template:
    `<div class="search">
        <div class="cancal_Btn" @click="cancelClick()" :class="{cancal_Btn_ani:showSearch === true}">取消</div>
        <div class="search_fram" v-if="showSearch === false"  @click="changSearch()"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>搜索</div>
        <input  type="search" ref="inputVal" v-if="showSearch"  :class="{search_animation:showSearch === true,search_input:showSearch === false}" placeholder="搜索" />
    </div>`,
    data(){
        return{
            // 组件中的属性
            showSearch:false,
            search_content:"",
        }
    },
    methods: {
        // 组件中的方法
        changSearch(){
            this.showSearch =!this.showSearch
            this.$nextTick(function () {
                //DOM 更新了
                this.$refs.inputVal.focus()
            })
        },
        cancelClick(){
            this.showSearch =!this.showSearch
        }
    },


}) 
