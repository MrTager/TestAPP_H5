/**下发指令，传入下发指令 */
function issueCom(n){
    if (window.WebViewJavascriptBridge) {
        //do your work here
        bridge.sendToNative(n, function (res) {
            //  console.log("app res"+res)
        })
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                //do your work here
                bridge.sendToNative(n, function (res) {
                    //  console.log("app res"+res)
                })
            },
            false
        );
    }
    
}
/**覆盖本地配置数据 */
function getAllDevInfo(n,functionCallback){
    if (window.WebViewJavascriptBridge) {
        //do your work here
        bridge.getProfileData(n, function (res) {
            console.log('拿到',res)
            functionCallback(res)
           })
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                //do your work here
                bridge.getProfileData(n, function (res) {
                    console.log('拿到',res)
                functionCallback(res)
               })
            },
            false
        );
    }

    
}
/**获取当前时间 */
function getTime(){
    let date=new Date();
    let hour=date.getHours();
    let minute=date.getMinutes();
    let second=date.getSeconds();
    let time=hour+":"+minute+":"+second
    return time
}
/**下发心跳指令 */
function setHeartCom(){
    let com={"Command":"TcpBeatHeart","Period":"60"};
    issueCom(com);
}
/**允许入网*/
function allowNet(){
    let com={"Command":"Dispatch","FrameNumber":"00","Type":"Add","Data":[{"DeviceId":"0000000000000000","Key":"Time","Value":"255"}]};
    issueCom(com);
};
/**禁止入网 */
function notAllowNet(){
    let com={"Command":"Dispatch","FrameNumber":"00","Type":"Add","Data":[{"DeviceId":"0000000000000000","Key":"Time","Value":"0"}]};
    issueCom(com);
};
/**注销设备 */
function cancelDev(n){
    let com={"Command":"Dispatch","FrameNumber":"00","Type":"Delete","Data":[{"DeviceId":n+""}]};
    issueCom(com);
}
/**获取设备列表以及列表内设备的所有属性 */
function getDevList(){
    let com={"Command": "Dispatch","FrameNumber":"00","Type":"DevList","Data":[{"DeviceId":"0000000000000000","Key":"DeviceList"}]};
    issueCom(com);
}
/**查询设备所有属性 */
function getDevAllAttr(n){
    let com={"Command":"Dispatch","FrameNumber":"00","Type":"DevAttri","Data":[{"DeviceId":n+"","Key":"All"}]};
    issueCom(com);
}
/**查询设备单个或多个属性 */
function getDevSomeAttr(devId,Key){
    let com={"Command":"Dispatch","FrameNumber":"00","Type":"Attribute","Data":[{"DeviceId":devId+"","Key":Key}]};
    let com2={"Command":"Dispatch","FrameNumber":"00","Type":"Ctrl","Data":[{"DeviceId":devId+"","Key":"GetStatus"}]}
    issueCom(com);
    issueCom(com2);
}
/**控制设备单个属性 */
function ctrlDevOneAttr(devId,key,value){
    let com={"Command":"Dispatch","FrameNumber":"00","Type":"Ctrl","Data":[{"DeviceId":devId+"","Key":key,"Value":value}]};
    issueCom(com);
}
/**修改设备名称 */
function recomposeDevName(devId,devName){
    let com={"Command":"Dispatch","FrameNumber":"00","Type":"SubName","Data":[{"DeviceId":devId+"","Key":"SetName","Value":devName+"" }]};
    issueCom(com);
}
/**点击设备项获取设备在配置文件中的所有属性，传入ModelId */
function getDevInfo(n){
    for(let j=0;j<devInfo.rows.length;j++){
        if(devInfo.rows[j].config !==null){
          if(devInfo.rows[j].config.modelId == n){
               let info=devInfo.rows[j];
               return info;
            }
        }else{
          console.log("未找到相关设备信息")
        }  
    }
}
/**将返回数据格式化json类型 */
function formattingData(n){
    let a=JSON.parse(n).data.substring(1,JSON.parse(n).data.length-1);
    let b=JSON.parse(a);
    return b;
}
//禁止页面滚动
function handler(ev){
    ev.preventDefault();
}




