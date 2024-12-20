chrome.runtime.onMessage.addListener(e=>{e.type==="API_CALL"&&window.postMessage({type:"API_CALL",data:e.data},"*")});
