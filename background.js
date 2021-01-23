function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    // Just change any instance of Example in the HTTP response
    // to WebExtension Example.
    // str = str.replace(/Example/g, 'WebExtension Example');
    try {
        foo = JSON.parse(str)
    } catch (e) {
        filter.write(encoder.encode(str));
        filter.disconnect();
        return;
    }

    // if (foo?.AddMsgList[0]?.MsgType == 10002) {
    if (foo && foo.AddMsgList && foo.AddMsgList[0] && foo.AddMsgList[0].MsgType == 10002) {
      foo.AddMsgList[0].MsgType = 1
      // foo.AddMsgList[0].Content = "一条猥琐的消息被撤回"
      str = JSON.stringify(foo)
    }
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxsync*"], types: ["xmlhttprequest"]},
  ["blocking"]
);
