/**下发指令，传入下发指令 */
function issueCom(n,func){
    if (window.WebViewJavascriptBridge) {
        //do your work here
        bridge.sendToNative(n, function (res) {
            //  console.log("app res"+res)
            func(res)
        })
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                //do your work here
                bridge.sendToNative(n, function (res) {
                    //  console.log("app res"+res)
                    func(res)
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
            functionCallback(res)
           })
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                //do your work here
                bridge.getProfileData(n, function (res) {
                functionCallback(res)
               })
            },
            false
        );
    }  
}
