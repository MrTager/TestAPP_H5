/**设备数量 */
var devNumTxt=document.getElementById("devNumTxt");
/**已连接coner */
var onlineCol=document.getElementById("onlineCol");
/**未连接TXT */
var noCon=document.getElementById("noCon");
/**已连接TXT */
var yesCon=document.getElementById("yesCon");
/**日志页面 */
var logView=document.getElementById("logView");
/**日志按钮 */
var logBtn=document.getElementById("logBtn");
/**日志文本框 */
var textarea=document.getElementById("textarea");
/**禁止入网文字 */
var connetTxt=document.getElementById("connetTxt");
/**保存的DevList数据 */
var devList=[];
/**保存配置文件里的DevList数据 */
var fildDevList=[];
/**ul */
var listCon=document.getElementById("listCon");
/**控制页面ul */
var controlContianer=document.getElementById("controlContianer");
/**设备列表页面 */
var viewOne=document.getElementById("viewOne");
/**设备控制页面 */
var viewTwo=document.getElementById("viewTwo");

/**loading页面 */
var loadingView=document.getElementById("loadingView");
loadingView.style.display="block";

/**导航栏 */
var macList=document.getElementById("macList");
/**mac容器 */
var macs=document.getElementById("macs");
/**日志容器 */
var logList=document.getElementById("logList");
var logItem=document.getElementsByClassName("logItem");
/**页面左右滑动标识符 */
var moveFlag=0;
var startX,startY,moveEndX,moveEndY,X,Y=0;



//进入页面发送心跳指令，查询设备指令
setHeartCom();
getDevList();
listCon.style.width=window.innerWidth+"px";
listCon.style.height=window.innerHeight-100+"px";
listCon.style.overflowY="scroll";
macs.style.height=window.innerHeight-50+"px";
macs.style.width=170+"px";
macs.style.overflowY="scroll";
//maclist三大按钮
var onlineBtn=document.getElementById("onlineBtn");
var offlineBtn=document.getElementById("offlineBtn");
var allBtn=document.getElementById("allBtn");
var threeBtnState=0;
/**保存在线设备 */
var onlineDevArr=[];
/**保存离线设备 */
var offlineDevArr=[];
/**保存全部设备 */
var alllineDevArr=[];
/**保存一千条日志 */
var logArray=[];

var macOnlineLis="";
var macOfflineLis="";
var macAlllineLis="";

/**保存日志 */
var logTxt="";
var headNum="";
var footNum="";
var addStr='';
var arrayDev=[];
var timeCount=0;
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
/**设备返回数据触发 */
function procNativeData(data) {
   
    //  console.log("原始数据",JSON.parse(data))
      let thisCode=JSON.parse(data).code;
      let thisData=JSON.parse(data).data;
      console.log(thisData)
      //打印日志
      consoleLog(thisData);
      let head =thisData.substring(0,1);

      if(thisCode>0){
          // tcp已连接
          onlineCol.style.display="block";
          yesCon.style.display="block";
          noCon.style.display="none";
            if(head==headNum){
                for(let i=0;i<10000;i++){
                    /**检索到的第一个footNum */
                        let index=thisData.indexOf("");
                        let length=thisData.length;
                        if(index>-1){
                            // console.log("有头有尾")
                            let subData=thisData.substring(1,index);
                            //console.log(index,length)
                            thisData=thisData.slice(index+1);
                            //  console.log(subData);
                            subData=JSON.parse(subData);
                            if(subData.Type=="DevList"){
                                if(subData.TotalNumber==subData.AlreadyReportNumber){
                                    arrayDev.push(subData);
                                  //  console.log(subData)
                                   // console.log(arrayDev)
                                    createDevList(arrayDev);
                                   // createMacList(arrayDev);
                                    arrayDev=[];
                                    addStr="";
                                }else{
                                    arrayDev.push(subData) 
                                } 
                            }else{
                                //console.log("其他",subData)
                                if(subData.Type=="Attribute"){
                                    if(subData.Data[0].Key=="PermitJoining"&&subData.Data[0].ModelId=="000000"){
                                        if(subData.Data[0].Value=="0"){
                                            connetTxt.innerHTML="禁止入网中..."
                                            connetTxt.style.color="black";
                                        }else{
                                            connetTxt.innerHTML="允许入网中..."
                                            connetTxt.style.color="green";
                                        }
                                    }
                                }
                                //当有设备入网
                                if(subData.Type=="Register"){
                                    getDevList();
                                }
                                //当有设备注销
                                if(subData.Type=="UnRegister"){
                                    getDevList();
                                }
                                //上报设备状态
                                if(subData.Type=="DevAttri"){
                                   // console.log("设备属性",subData);
                                    let ModelId = subData.Data[0].ModelId;
                                    let DeviceId =subData.Data[0].DeviceId;
                                    let urlStr={};
                                    for(let t=0;t<subData.Data.length;t++){
                                        let key = subData.Data[t].Key;
                                        let value = subData.Data[t].Value;
                                        let str=`{"${key}":"${value}"}`;
                                        let obj=JSON.parse(str);
                                        Object.assign(urlStr, obj);
                                    }
                                    urlStr=JSON.stringify(urlStr);
                                    console.log(urlStr)
                                    window.open("control.html?ModelId="+ModelId+"&DevStates="+urlStr+"&DevId="+DeviceId, "_self");
                                    //window.location.href="control.html?ModelId="+ModelId+"&DevStates="+urlStr+"&DevId="+DeviceId
                                }
                                //设备名称修改上报
                                if(subData.Type=="SubName"){
                                    alert("设备名称修改成功！")
                                }
                                //设备上线下线上报
                                if(subData.Type=="OnOff"){
                                     getDevList();
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
                                    //  console.log(arrayDev)
                                    createDevList(arrayDev);
                                    //  createMacList(arrayDev);
                                    arrayDev=[];
                                    addStr="";
                                }else{
                                    arrayDev.push(subData) 
                                } 
                            }else{
                              //  console.log("其他",subData)
                              //上报设备状态
                              if(subData.Type=="DevAttri"){
                               // console.log("设备属性",subData);
                                let ModelId = subData.Data[0].ModelId;
                                let DeviceId =subData.Data[0].DeviceId;
                                let urlStr={};
                                for(let t=0;t<subData.Data.length;t++){
                                    let key = subData.Data[t].Key;
                                    let value = subData.Data[t].Value;
                                    let str=`{"${key}":"${value}"}`;
                                    let obj=JSON.parse(str);
                                    Object.assign(urlStr, obj);
                                }
                                urlStr=JSON.stringify(urlStr);
                                console.log(urlStr)
                                window.open("control.html?ModelId="+ModelId+"&DevStates="+urlStr+"&DevId="+DeviceId, "_self");
                                //window.location.href="control.html?ModelId="+ModelId+"&DevStates="+urlStr+"&DevId="+DeviceId
                            }
                            }
                    }else{
                    //  console.log("无头无尾");
                        addStr=thisData;
                        break;
                    }
                }
            }  
        }else{
            onlineCol.style.display="none";
            yesCon.style.display="none";
            noCon.style.display="block";
        }
     
    
  
}
var alertFlag=false;

/**处理DevList列表类数据 */
function createDevList(n){
    let lis="";
    macOnlineLis="";
    macOfflineLis="";
    macAlllineLis="";
    let devArrs=n;
    let count=0;
    onlineDevArr=[];
    offlineDevArr=[];
    alllineDevArr=[];
    for(let i=0;i<devArrs.length;i++){
        for(let j=0;j<devArrs[i].Data.length;j++){
            count++;
            //设备总数
            devNumTxt.innerText=count;
            
            let DeviceId=devArrs[i].Data[j].DeviceId;
            let ModelId=devArrs[i].Data[j].ModelId;
            let Name=devArrs[i].Data[j].Name;
            let Online=devArrs[i].Data[j].Online;
            let OnlineState="";
            if(Online=="1"){
                OnlineState="在线"
                let macOnlineLi=`<li onclick="macJumpLocation(this)">${DeviceId}<span style="display:none">${count}</span></li>`
                macOnlineLis+=macOnlineLi;
            }
            else{
                OnlineState="离线"
                let macOfflineLi=`<li onclick="macJumpLocation(this)">${DeviceId}<span style="display:none">${count}</span></li>`
                macOfflineLis+=macOfflineLi;
            }
            let macAlllineLi=`<li onclick="macJumpLocation(this)">${DeviceId}<span style="display:none">${count}</span></li>`
            macAlllineLis+=macAlllineLi;

            let RegisterStatus=devArrs[i].Data[j].RegisterStatus;
            let Version=devArrs[i].Data[j].Version;
            let devType="";
            let headFlag=false;
            for(let m=0;m<devInfo.rows.length;m++){
                if(devInfo.rows[m].config.modelId==ModelId){
                    headFlag=true;
                    devType=devInfo.rows[m].labelModel;
                    let li=`<li id="devOneLi${count}">
                    <div class="liTitle">设备${count}</div>
                    <div class="devItem">&nbsp&nbsp&nbsp名称：<input type="text" onFocus="saveOldValue(this)" onblur="setOldValue(this)" onkeyup="confirmBtn(this)"  class="devName" value=${Name}></div>
                    <div class="devItem">&nbsp&nbsp&nbspModel ID：<span class="devName">${ModelId}</span></div>
                    <div class="devItem">&nbsp&nbsp&nbsp版本号：<span class="devName">${Version}</span></div>
                    <div class="devItem">&nbsp&nbsp&nbsp子设备类型：<span class="devName">${devType}</span></div>
                    <div class="devItem">&nbsp&nbsp&nbsp状态：<span class="devName">${OnlineState}</span></div>
                    <div class="devItem">&nbsp&nbsp&nbspMAC：<span class="devName">${DeviceId}</span></div>
                    <div class="delDev">
                        <button class="delDevBtn" onclick="delDev(this)">删除</button>
                        <button class="controlBtn" onclick="devDetailInfo(this)">控制</button>
                    </div>
                    </li>`
                    lis+=li;
                    break;
                }
            }
            if(headFlag==false){
                let li=`<li id="devOneLi${count}">
                   <div class="liTitle">设备${count}</div>
                   <div class="devItem">&nbsp&nbsp&nbspMAC：<span class="devName">${DeviceId}</span></div>
                   <div class="devItem">&nbsp&nbsp&nbsp名称：<input type="text" onFocus="saveOldValue(this)" onblur="setOldValue(this)" onkeyup="confirmBtn(this)"  class="devName" value=${Name}></div>
                    <div class="devItem">&nbsp&nbsp&nbspModel ID：<span class="devName">${ModelId}</span></div>
                    <div class="devItem">&nbsp&nbsp&nbsp版本号：<span class="devName">${Version}</span></div>
                    <div class="devItem">&nbsp&nbsp&nbsp状态：<span class="devName">${OnlineState}</span></div>
                    <div class="devItem">&nbsp&nbsp&nbspMAC：<span class="devName">${DeviceId}</span></div>
                    <div class="delDev">
                        <button class="delDevBtn" onclick="delDev(this)">删除</button>
                        &nbsp&nbsp&nbsp此设备没有相应的配置文件
                    </div>
                   </li>`
                   lis+=li;
                if(alertFlag==false){
                   //alert(`配置文件中没有ModelId为${ModelId}的配置信息，请更新配置文件！`);
                   alertFlag=true;
                } 
            }
            
        }
    }
    listCon.innerHTML=lis;
    if(threeBtnState==1){
        macs.innerHTML=macOnlineLis;
    }else if(threeBtnState==2){
        macs.innerHTML=macOfflineLis;
    }else if(threeBtnState==3){
        macs.innerHTML=macAlllineLis;
    }else{

    }
    loadingView.style.display="none";
    //查询入网状态
    getDevSomeAttr("0000000000000000","PermitJoining")
}

/**隔40秒查询一下设备查询 */

setInterval(() => {
        getDevList();
}, 40000);
// setInterval(()=>{ setHeartCom();},10000)
var oldValue="";
var enter=false;
function saveOldValue(n){
    oldValue=n.value;
}
function setOldValue(n){
    if(enter==false){
        if(n.value!==oldValue){
        n.value=oldValue;
        oldValue="";
        }
    }else{
        enter=false;
    }
   
}
/**更改名字提交按钮 */
function confirmBtn(n){
    let devId=n.parentNode.parentNode.children[6].children[0].innerText;
    document.onkeydown=function(e){
       if(e.keyCode==13){
           if(n.value.length==0){
                alert("输入不得为空！")
                n.value=oldValue;
           }else
           if(n.value.length>30){
                alert("最多输入10个汉字或30个字母！");
                n.value=oldValue;
           }else{
                if (window.confirm(`确认修改名称为${n.value}吗？`)) {
                    recomposeDevName(devId,n.value);
                    enter=true;
                    n.blur();
                    oldValue="";
                } else {
                //取消

                }
               
           }   
       }
    }
}

/**删除当前设备 */
function delDev(e){
    let devId="";
    devId=e.parentNode.parentNode.children[6].children[0].innerText;
    if (window.confirm("确认吗?")) {
    //删除
    loadingView.style.display="block";
    cancelDev(devId);
    } else {
    //取消
    }
}

/**点击当前设备,进入控制页面 */
function devDetailInfo(e){
   let DeviceId=e.parentNode.parentNode.children[6].children[0].innerText;
   let onlineState=e.parentNode.parentNode.children[5].children[0].innerText;
   if(onlineState == "在线"){
       //进入控制页面之前先查询设备信息
       getDevAllAttr(DeviceId);
   }else{
       alert("设备离线状态不能控制！");
   }
}
/**返回设备列表 */
function backDevList(){
    viewOne.style.display="block";
    viewTwo.style.display="none";
   
}

// // 禁止页面滚动
// document.body.addEventListener('touchmove', handler, { passive: false });
// // 开启页面滚动
// document.body.removeEventListener('touchmove', handler, { passive: false });
/**检测向右滑动页面 */

document.body.addEventListener("touchstart", function(e) {
　　e.preventDefault();
　　startX = e.changedTouches[0].pageX,
　　startY = e.changedTouches[0].pageY;
});

document.body.addEventListener("touchmove", function(e) {
　　e.preventDefault();
　　moveEndX = e.changedTouches[0].pageX,
　　moveEndY = e.changedTouches[0].pageY,
　　X = moveEndX - startX;
　　Y = moveEndY - startY;

    
　　if ( X > 100 ) {
        if(moveFlag==0){
            macList.className="listMoveRight"
            moveFlag=1;
        }
　　}
　　else if ( X < -50 ) {   
        if(moveFlag==1){
            macList.className="listMoveLeft"
            moveFlag=0;
        }
　　}
　　else if ( Y > 0) {
　　}
　　else if ( Y < 0 ) {
　　}
　　else{
　　}
　}
)
/**允许入网 */
function allowNetBtn(){
    allowNet();
}
/**禁止入网 */
function notAllowNetBtn(){
    notAllowNet();
}
// /**形成MAC列表 */
// function createMacList(devArray){
//   console.log("数组是",devArray)
// }
/**在线设备筛选按钮 */
function clickOnlineBtn(){
    macs.innerHTML=macOnlineLis;
    threeBtnState=1;
}
/**离线设备筛选按钮 */
function clickOfflineBtn(){
    macs.innerHTML=macOfflineLis;
    threeBtnState=2;
}
/**全部设备筛选按钮 */
function clickAlllineBtn(){
    macs.innerHTML=macAlllineLis;
    threeBtnState=3;
}
/**点击Mac单行跳转到相应的位置 */

function macJumpLocation(e){
    let index=e.children[0].innerText;
    let thisdev=document.getElementById(`devOneLi${index}`)
    listCon.scrollTop=thisdev.offsetTop-200;
}
/**点击日志按钮 */
function showLogView(){
    logBtn.style.display="none";
    logView.style.display="block";
    closeMacList()
}
/**关闭日志 */
function closeLogView(){
    logBtn.style.display="block";
    logView.style.display="none";
    openMacList()
}
/**显示MacList页面 */
function openMacList(){
    macList.style.display="block";
    moveFlag=0;
    macList.style.left=-170+"px";
    macList.className="sudfisfysufsfiusdyf"
}
/**关闭MacList页面 */
function closeMacList(){
    macList.style.display="none";
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
/**清空日志 */
function clearLog(){
    logList.innerHTML="";
}