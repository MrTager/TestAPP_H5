
var devInfo={}
     


    // getAllDevInfo(" ",function(res){
    //     let newData=JSON.parse(res);
    //     devInfo=newData;
    //     let infoArr=[];
    //     for(let i=0;i<devInfo.rows.length;i++){
    //         if(devInfo.rows[i].config){
    //             if(infoArr.indexOf(devInfo.rows[i].config.modelId)<0){
    //             infoArr.push(devInfo.rows[i])
    //             }
    //         }
    //     }
    //     devInfo.rows=infoArr;
    // })
    devInfo = profile;
        let infoArr=[];
        for(let i=0;i<devInfo.rows.length;i++){
            if(devInfo.rows[i].config){
                if(infoArr.indexOf(devInfo.rows[i].config.modelId)<0){
                infoArr.push(devInfo.rows[i])
                }
            }
        }
        devInfo.rows=infoArr;
    if(devInfo.rows == undefined){
        alert('没收到配置文件')
    }
    for(let r=0;r<100000;r++){
       if(devInfo=={}){
         
       }else{
           break;
       }
    }
    
   


