import { addGeneratedCoverLetterToPouchDb } from "../background";


export let webSocket:WebSocket;
export let sessionId:string | Blob;

export function connect(server_uri:string) {
  webSocket = new WebSocket(server_uri);

  webSocket.onopen = (event: any) => {
    console.log('websocket open');
    keepAlive();
  };

  webSocket.onmessage = (event: any) => {
    //websocket received message: {"responseType":"cover_letter","coverLetter":"This is a long coverLetter","jobId":"1699606164648"}

    //console.log(`websocket received message: ${event.data}`);
      const parsedResponse = JSON.parse(event.data);
      // console.log("parsedResponse ====> " + JSON.stringify(parsedResponse))
      // console.log("parsedResponse.responseType ==>" + parsedResponse.responseType)
      if(parsedResponse.responseType == "ws_ack"){
          sessionId = parsedResponse.keepAliveSessionId
      } else if (parsedResponse.responseType == "cover_letter"){
        console.log("inside responseType == cover_letter")
        addGeneratedCoverLetterToPouchDb(parsedResponse.coverLetter, parsedResponse.jobId)
      }   
  };

  webSocket.onclose = (event: any) => {
    console.log('websocket connection closed');
  };

}

function disconnect() {
  if (webSocket == null) {
    return;
  }
  webSocket.close();
}

function keepAlive() {
  const keepAliveIntervalId = setInterval(
    () => {
      if (webSocket) {
        webSocket.send('keepalive');
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
    20 * 1000 
  );
}