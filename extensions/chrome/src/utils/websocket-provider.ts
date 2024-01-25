import { addGeneratedCoverLetterToPouchDb, addPersistentSessionIdtoLocalStorage, getPersistentIdFromLocalStorage } from "../background";
import { FirstMessageAfterConnection, KeepAliveMessage } from "../obj_store/msg_objs";


export let webSocket: WebSocket;
export function connect(server_uri: string) {

  webSocket = new WebSocket(server_uri);

  webSocket.onopen = (event: any) => {
    console.log('websocket open');
    sendFirstMessage()
    keepAlive();
  };

  webSocket.onmessage = (event: any) => {
    //websocket received message: {"responseType":"cover_letter","coverLetter":"This is a long coverLetter","jobId":"1699606164648"}

    console.log(`websocket received message: ${event.data}`);
    const parsedResponse = JSON.parse(event.data);

    console.debug("parsedResponse ====> " + JSON.stringify(parsedResponse))
    console.debug("parsedResponse.responseType ==>" + parsedResponse.responseType)

    if (parsedResponse.responseType == "ws_ack") {
      console.log("KeepAlive Response Received")
    } else if (parsedResponse.responseType == "cover_letter") {
      console.log("inside responseType == cover_letter")
      addGeneratedCoverLetterToPouchDb(parsedResponse.coverLetter, parsedResponse.jobId)
    } else if (parsedResponse.responseType == "missed_p_key") {
      console.log("inside responseType == missed_p_key")
      addPersistentSessionIdtoLocalStorage(parsedResponse.persistentSessionId)
    };
  }

  webSocket.onclose = (event: any) => {
    console.log('websocket connection closed');
  };

}

function keepAlive() {
  let KeepAliveMessage: KeepAliveMessage = {
    msgType: "keep_alive",
  }

  const keepAliveIntervalId = setInterval(
    () => {
      if (webSocket) {
        webSocket.send(JSON.stringify(KeepAliveMessage));
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
    20 * 1000
  );
}

async function sendFirstMessage() {
  var persistentId: string = await getPersistentIdFromLocalStorage()
  if (persistentId == undefined || persistentId == null) {
    persistentId = ""
  }

  let firstMessageAfterConnection: FirstMessageAfterConnection = {
    msgType: "f_msg_cl",
    persistentSessionId: persistentId
  }
  webSocket.send(JSON.stringify(firstMessageAfterConnection));
  console.log("firstMessageAfterConnection sent -> " + firstMessageAfterConnection)

}