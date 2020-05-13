
var devInfo={}
    getAllDevInfo(" ",function(res){
        let newData=JSON.parse(res);
        devInfo=newData;
        let infoArr=[];
        for(let i=0;i<devInfo.rows.length;i++){
            if(devInfo.rows[i].config){
                        if(infoArr.indexOf(devInfo.rows[i].config.modelId)<0){
                        infoArr.push(devInfo.rows[i])
                        }
                }
        }
        devInfo.rows=infoArr;
    })
    for(let r=0;r<100000;r++){
       if(devInfo=={}){
         
       }else{
           break;
       }
    }
    
   


