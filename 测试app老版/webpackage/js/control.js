setInterval(() => {
    setHeartCom();
}, 40000);
setHeartCom();
    
var loadInfo=setInterval(()=>{
    if(devInfo.hasOwnProperty("rows")){
    clearInterval(loadInfo);
    updateCtrlView(); 
    loadingView.style.display="none";  
    }else{
        
    }
},10)
//监听页面关闭

window.onbeforeunload=function(e){
    
}

let devCtrlitems=document.getElementById("devCtrlitems");
let firmwareVersion =document.getElementById("firmwareVersion");
let loadingView=document.getElementById("loadingView");
/**日志页面 */
let logView=document.getElementById("logView");
/**日志按钮 */
let logBtn=document.getElementById("logBtn");
/**日志容器 */
let logList=document.getElementById("logList");
let logItem=document.getElementsByClassName("logItem");
/**保存全部设备 */
let alllineDevArr=[];
/**保存一千条日志 */
let logArray=[];

loadingView.style.display="block";
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name
            + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

let ModelId = getQueryString("ModelId");
let DevStates = getQueryString("DevStates");
let DevId = getQueryString("DevId");
DevStates = DevStates.replace(/%22/g,'"');
DevStates = JSON.parse(DevStates);
console.log("URL传入页面值",DevStates);

function updateCtrlView(){
    if(DevStates.FirmwareVersion!==undefined){
    firmwareVersion.innerText="固件版本："+DevStates.FirmwareVersion
    }else{
        firmwareVersion.innerText="固件版本未知"
    }
    for(let i=0;i<devInfo.rows.length;i++){
       if(devInfo.rows[i].config.modelId==ModelId){
            //console.log("配置查询",devInfo.rows[i].config)
            let lis="";
            for(let j=0;j<devInfo.rows[i].config.propertys.length;j++){
               // console.log(devInfo.rows[i].config.propertys[j])
                let keyName=devInfo.rows[i].config.propertys[j].keyName;
                let key=devInfo.rows[i].config.propertys[j].key;
                let operates=devInfo.rows[i].config.propertys[j].operates;
                let configs=devInfo.rows[i].config.propertys[j].valueConfig.configs;
                let dataType=devInfo.rows[i].config.propertys[j].valueConfig.dataType;
                if(operates){
                    if(operates[0]==1){
                        //可控
                        //判断是枚举
                        if(dataType==0){
                            // console.log("这个是枚举选项可控")
                            let btns="";
                            for(let n=0;n<configs.length;n++){
                                let btn=`<button  value=${configs[n].Value} onclick="conBtnClick(this)">${configs[n].Key}</button><span style="display:none">${key}</span>`;
                                btns+=btn;
                            }
                            /**用来临时保存ikey数据 */
                            let a="";
                            let aFlag=false;
                            for(let ikey in DevStates){
                                if(ikey==key){
                                    aFlag=true;
                                    a=DevStates[ikey]
                                }
                            }
                            if(aFlag){
                            }else{
                                a="设备不上报"
                            }
                            let li=`<li class="controlItem">
                            <div class="devInfoTypeName">名称：${keyName}</div>
                            <div><span>当前状态：</span><span>${a}</span></div>
                            <div class="devInfoTypeItem">${btns}</div>
                            </li>`;
                            lis+=li
                        }else if(dataType==1 || dataType==3){
                            //判断是范围 
                           // console.log("这个是范围选项可控")
                            let btns="";
                            let allowValue=[];
                            for(let n=0;n<configs.length;n++){
                                let btn=`<button  value=${configs[n].Value} onclick="conValueClick(this)">${configs[n].Key}</button><span style="display:none">${key}</span>`;
                                allowValue.push(configs[n].Value)
                                btns+=btn;
                            }
                            /**用来临时保存ikey数据 */
                            let a="";
                            let aFlag=false;
                            for(let ikey in DevStates){
                                if(ikey==key){
                                    aFlag=true;
                                    a=DevStates[ikey]
                                }
                            }
                            if(aFlag){
                            }else{
                                a="设备不上报"
                            }
                            let li=`<li class="controlItem">
                            <div class="devInfoTypeName">名称：<span>${keyName}</span></div>
                            <div><span>当前状态：</span><span>${a}</span></div>
                            <div class="devInfoTypeItem"><input type="text" value="" placeholder="输入范围${allowValue[0]}~${allowValue[allowValue.length-1]}"><button onclick="valueSetBtn(this)">设置</button><span style="display:none">${allowValue}</span><span style="display:none">${key}</span></div>
                            <div>${btns}</div>
                            </li>`;
                            lis+=li
                        }
                    }else if(operates[0]==2){
                        /**用来临时保存ikey数据 */
                        let a="";
                        //可上报
                        let aFlag=false;
                        for(let ikey in DevStates){
                            if(ikey==key){
                                aFlag=true;
                                a=DevStates[ikey]
                            }
                        }
                        if(aFlag){

                        }else{
                            a="设备不上报"
                        }
                        let li=`<li class="controlItem">
                        <div class="devInfoTypeName">名称：${keyName}</div>
                        <div><span>当前状态：</span><span>${a}</span></div>
                        
                        <div class="devInfoTypeItem"><span style="display:none">${key}</span><button onclick="queryAttr(this)">查询</button></div>
                        </li>`;
                        lis+=li

                    }else if(operates[0]==4){
                        //可查询
                        let li=`<li class="controlItem">
                        <div class="devInfoTypeName">名称：<span>${keyName}</span></div>
                        <div class="devInfoTypeItem"><button>打开</button><button>关闭</button></div>
                        </li>`;
                        lis+=li
                    }else{

                    }

                }
            }
            devCtrlitems.innerHTML=lis
            break;
       }
    }
}


/**控制页面单项btn */
function conBtnClick(e){
   let keyName=e.nextElementSibling.innerText;
   let value=e.value;
   ctrlDevOneAttr(DevId,keyName,value);
  // getDevAllAttr(DevId);
  // loadingView.style.display="block";
}
/**范围值控制项 */
function conValueClick(e){
    let keyName=e.nextElementSibling.innerText;
    let value=e.value;
    let input=e.parentNode.parentNode.children[2].children[0];
    input.value=value;
}
//判断是否为数字
function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}
/**范围值设置按钮 */
function valueSetBtn(e){
    let value=e.parentNode.children[0].value;
    let allowValue =e.parentNode.children[2].innerHTML;
    let keyName=e.parentNode.children[3].innerText;
    let o=allowValue.split(",");
    let newAllowValue=[];
    for(let i=0;i<o.length;i++){
        newAllowValue.push(Number(o[i]))
    }
    if(isNumber(value)){
       if(Number(value)<newAllowValue[0]){
           alert(`请输入${newAllowValue[0]}~${newAllowValue[newAllowValue.length-1]}之间的值`)
           return;
        }else if(Number(value)>newAllowValue[newAllowValue.length-1]){
           alert(`请输入${newAllowValue[0]}~${newAllowValue[newAllowValue.length-1]}之间的值`)
           return;
        }else{
           ctrlDevOneAttr(DevId,keyName,value);
           loadingView.style.display="block"; 
           e.parentNode.children[0].value="";
           return;
       }
    }else{
       alert("输入正确的数字");
       return;
    }
    // ctrlDevOneAttr(DevId,keyName,value);
    // getDevAllAttr(DevId);
    loadingView.style.display="block";
    e.parentNode.children[0].value="";
}
/**查询设备属性 */
function queryAttr(e){
    let key=e.parentNode.children[0].innerText
    getDevSomeAttr(DevId,key)
}
/**保存日志 */
let logTxt="";
let headNum="";
let footNum="";
let addStr='';
let arrayDev=[];
let timeCount=0;
//打印日志
function consoleLog(data){
    if(logList.childNodes.length<=1000){
        let time =getTime();
        let logTxt =time+"上报数据:" +"      "+data;
        let li=document.createElement("li");
        let hr=document.createElement("hr");
        li.className="logItem";
        // li.innerHTML(logTxt); 
        li.innerText=logTxt
        li.appendChild(hr)
        logList.insertBefore(li,logList.childNodes[0])
      }else{
        logList.removeChild(logList.childNodes[999])
      }
}
/**数据接收接口 */
function procNativeData(data) {
      loadingView.style.display="none";
      let thisCode=JSON.parse(data).code;
      let thisData=JSON.parse(data).data;
      let head =thisData.substring(0,1);
      console.log(thisData);
      //打印日志
      consoleLog(thisData)
      if(thisCode>0){
          // tcp已连接
            if(head==headNum){
                for(let i=0;i<10000;i++){
                    /**检索到的第一个footNum */
                        let index=thisData.indexOf("");
                        let length=thisData.length;
                        if(index > -1){
                            // console.log("有头有尾")
                            let subData=thisData.substring(1,index);
                            //console.log(index,length)
                            thisData=thisData.slice(index+1);
                            //  console.log(subData);
                            subData=JSON.parse(subData);
                            if(subData.Type=="DevList"){
                                if(subData.TotalNumber==subData.AlreadyReportNumber){
                                    arrayDev.push(subData);
                                   // console.log(subData)
                                   // console.log(arrayDev)
                                    createDevList(arrayDev);
                                    arrayDev=[];
                                    addStr="";
                                }else{
                                    arrayDev.push(subData) 
                                } 
                            }else{
                                console.log("其他",subData)
                               
                                if(subData.Type=="DevAttri"){
                                    loadingView.style.display="none";
                                    return;
                                }
                                if(subData.Type=="Attribute"){
                                    let Key = subData.Data[0].Key;
                                    let Value = subData.Data[0].Value;
                                    for(let key in DevStates){
                                        if(key==Key){
                                            DevStates[key]=Value;
                                            updateCtrlView();   
                                            loadingView.style.display="none";
                                            return;
                                        }
                                    }
                                }
                                if(subData.Type=="Event"){
                                    let Key = subData.Data[0].Key;
                                    let Value = subData.Data[0].Value;
                                    for(let key in DevStates){
                                        if(key==Key){
                                            DevStates[key]=Value;
                                            updateCtrlView();   
                                            loadingView.style.display="none";
                                            return;
                                        }
                                    }
                                }
                            }
                        }else{
                            //  console.log("有头无尾");
                            addStr=thisData;
                            break;
                        }
                }
                
            }else{
                
                // console.log("addStr",addStr)
                addStr+=thisData;
                thisData=addStr;
                for(let i=0;i<10000;i++){
                    /**检索到的第一个footNum */
                    let index=thisData.indexOf("");
                    let length=thisData.length;
                    if(index>-1){
                    //  console.log("无头有尾");
                        let subData=thisData.substring(1,index);
                        thisData=thisData.slice(index+1);
                        //console.log(subData);
                        subData=JSON.parse(subData);
                            if(subData.Type=="DevList"){
                                if(subData.TotalNumber==subData.AlreadyReportNumber){
                                    arrayDev.push(subData);
                                    //console.log(arrayDev)
                                    createDevList(arrayDev);
                                    arrayDev=[];
                                    addStr="";
                                }else{
                                    arrayDev.push(subData) 
                                } 
                            }else{
                                //console.log("其他",subData)
                                
                            }
                    }else{
                    //  console.log("无头无尾");
                        addStr=thisData;
                        break;
                    }
                }
                
            }
            
      }else{
            
      }
}
/**点击日志按钮 */
function showLogView(){
    logBtn.style.display="none";
    logView.style.display="block";
}
/**关闭日志 */
function closeLogView(){
    logBtn.style.display="block";
    logView.style.display="none";

}

/**清空日志 */
function clearLog(){
    logList.innerHTML="";
}