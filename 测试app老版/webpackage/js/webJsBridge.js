//
//  NativeJsBridge
//
//  Version: V1.0.0
//
//  Copyright (c) 2018年 HonYar. All rights reserved.
//
//****************************************************************************//
/**
 1. General Conventions:
 interactive data format: json string.
 
 ① js -> native: the request json data structure
 {
 "platform": 0,          // 云平台，0-阿里iLop，1-... (根据需求自定，不传默认为0)
 "url": "/test/get.do",  // 仅透传接口有效，请求的url地址(不包含Host部分)
 "apiVer": "1.0.0",      // 仅透传接口有效，API版本
 "isAuth": 0,            // 仅透传接口有效，标识该接口是否需要身份认证，0-不需要，1-需要
 "params": {             // 仅透传接口有效，接口请求附加参数
 ......              // 参数区，<根据实际接入平台、设备而定，请查看相关文档>
 },
 "datas": {              // 接口请求Body内容
 ......              // 数据区，<根据实际接入平台、设备而定，请查看相关文档>
 }
 }
 
 ② native -> js: the response json data structure
 {
 "errCode": 0,           // 接口请求返回的错误码
 “errDesc": "",          // errCode非0时的错误描述(不一定有)
 "data": {               // 接口请求返回的数据内容，errCode非0时data可能为空或不存在
 ......              // 请求返回内容，<根据实际接入平台、设备而定，请查看相关文档>
 }
 }
 
 ③ the message subscribe returned json data structure:
 {
 "topic": "message topic",   // 消息主题
 "data": {                   // 消息订阅返回的数据内容
 ......                  // 上报内容，<根据实际接入平台、设备而定，请查看相关文档>
 }
 }
 
 2. Native call javascript method:
 (you need to implement the following method in javascript where you are using it.)
 ① procUploadData (resData)             // 数据上报接口，resData格式见上面 1.3 小节
 ② procNativeData (resData)             // Native到Web的透传接口 (resData格式根据实际业务需求协商定义)
 
 3. javascript method call demo:
 ① 状态提示
 bridge.showMessage("{\"type\": \"...\", \"mesg\":\"...\"}");   // 显示提示框
 ......
 bridge.showMessage();   // 隐藏提示框，(非 status 类型不需要主动调用此方法进行隐藏)
 
 ② 透传接口 <接口第一个参数按实际接入平台、设备而定，请查看相关文档>
 bridge.sendToNative({...}, function(response){
 ......  // response 结构见 1.2 小节
 });
 
 */
//****************************************************************************//

function connectWebViewJavascriptBridge(callback) {

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

    // Android
    if (isAndroid) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function () {
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
    }

    // iOS
    if (isiOS) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }

        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }

        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
}

// 调试log信息输出控制
// 0x00-disable, 0x1X-native, 0x2X-web
// 0xX1-error, 0xX2-warn, 0xX4-debug, 0xX8-info, 0xXF-all
var wvjbEnableNativeLog = 0x00;

var wbjsBridge = wbjsBridge || {};
(function (wbjsBridge) {

    if (wbjsBridge.method) {
        console.warn("wbjsBridge.method is already defined.");
        return;
    }

    wbjsBridge.method = wbjsBridge.method || {};
    connectWebViewJavascriptBridge(function (bridge) {

        /**
         * app to web 数据透传接口
         *
         * @param   data    从App发送来的数据
         */
        bridge.registerHandler('dataFromGateWay', function (data, responseCallback) {

            if (typeof procNativeData == 'function') {
              //  console.info('dataFromGateWay got response: ', data)
                procNativeData(data);
                responseCallback("{\"errCode\": 0}");
            } else {
                // 不存在或不是function
                console.error('procNativeData function not found.');
                responseCallback("{\"errCode\": -1}");
            }
        });

        wbjsBridge.method.bridge = bridge;
    });

})(wbjsBridge);


/**
 * 从 H5 发送数据到 Native
 *
 * @note
 *     一般在 H5 页面全屏带导航栏时使用.
 */

wbjsBridge.method.sendToNative = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler('sendData', params, function (response) {
        //console.info('sendToNative got response: ', response)

        if (typeof funcCallback == 'function') {
            funcCallback(response);
        }
    });
};
wbjsBridge.method.getProfileData = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler('getProfileData', params, function (response) {
        //console.info('sendToNative got response: ', response)

        if (typeof funcCallback == 'function') {
            funcCallback(response);
        }
    });
};


//****************************************************************************//

function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    }

    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + obj2string(o[i]));
            }

            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }

            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(obj2string(o[i]))
            }

            r = "[" + r.join() + "]";
        }

        return r;
    }

    return o.toString();
}

(function (window, undefined) {
    if (0 !== (wvjbEnableNativeLog & 0x1F)) {
        var uniqueId = 1;

        console = new Object();
        console.log = function () {
            var logString = "";
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == "object") {
                    logString += obj2string(arguments[i]);
                } else {
                    logString += arguments[i];
                }
            }

            if (wvjbEnableNativeLog & 0x10) {
                var iframe = document.createElement("IFRAME");
                iframe.setAttribute("src", "wvjblog:#JSBRIDGE#" + logString);
                document.documentElement.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            } else if (wvjbEnableNativeLog & 0x20) {
                var logEle = document.getElementById('log');
                if (logEle) {
                    var el = document.createElement('div');
                    el.className = 'logLine';
                    el.innerHTML = '(' + uniqueId++ + '). ' + logString + '<br/><hr>';

                    if (logEle.children.length) {
                        logEle.insertBefore(el, logEle.children[0]);
                    } else {
                        logEle.appendChild(el);
                    }
                }
            }
        };

        console.info = function () {
            if (wvjbEnableNativeLog & 0x08) {
                console.log.apply(this, arguments);
            }
        };

        console.debug = function () {
            if (wvjbEnableNativeLog & 0x04) {
                console.log.apply(this, arguments);
            }
        };

        console.warn = function () {
            if (wvjbEnableNativeLog & 0x02) {
                console.log.apply(this, arguments);
            }
        };

        console.error = function () {
            if (wvjbEnableNativeLog & 0x01) {
                console.log.apply(this, arguments);
            }
        };

        console.trace = function () {
            if (wvjbEnableNativeLog & 0x10) {
                console.log.apply(this, arguments);
            }
        };
    }

    bridge = wbjsBridge.method;
})(window);
