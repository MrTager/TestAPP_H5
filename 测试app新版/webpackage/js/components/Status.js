
Vue.component("Status",{
    template:
    `<div class="top_state">
        <p class="p1">设备总数:<span>0</span></p>
        <div class="signal_light">
            <div class="lamp" :class="{lamp_1:netstatu.netFlag === true}" v-for="(item,i) in lightLength" :key="i" ></div>
        </div> 
        <div class="netbtn_group">
            <div class="allowNet" @click="changNetState()">{{netstatu.netBtn_txt}}</div>
        </div>
    </div>`,
    data(){
        return{
            // 组件中的属性
            netstatu:{netFlag:false,netBtn_txt:'允许入网'},
            lightLength:Array(5),
        }
    },
    methods: {
        // 组件中的方法
        changNetState(){
            this.netstatu.netFlag === true ? (this.netstatu.netFlag =false, this.netstatu.netBtn_txt='允许入网'):(this.netstatu.netFlag =true, this.netstatu.netBtn_txt='禁止入网');
        }
    },


}) 
