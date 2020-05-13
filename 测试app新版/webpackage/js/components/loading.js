
Vue.component("Loading",{
    template:
    `<div class="loading">
        <div class="loading_frame" :class="showAnimation?'loadChange':''">
            <div class="wave">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
            <div class="loading_txt">{{load_txt}}</div>
        </div>
    </div>`,
    data(){
        return{
            // 组件中的属性
            showAnimation:false,
        }
    },
    props:{
        load_txt:{
            type:String,
            required:true,
        }
    },
    method: {
        // 组件中的方法
    },
    created:function(){
        this.showAnimation=true;
        
    },
    beforeDestroy:function(){
        this.showAnimation=false;
    }
    
}) 
