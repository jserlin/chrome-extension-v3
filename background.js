console.log('chrome service worker loaded!')

//-------------------- background 注入css演示 ------------------------//

function injectJsAndCss() {
  getCurrentTabId(tabId => {
    console.log(
      `既然手边有树叶 ~ file: background.js:10 ~ injectJsAndCss ~ tabId:`,
      tabId
    )
    chrome.scripting.insertCSS({
      target: { tabId }, // 要注入样式的标签页ID
      files: ['/css/custom_233.css'], // 要注入的CSS文件路径，可以是相对插件根目录的路径
    })
  })
  getCurrentTabId(tabId => {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ['/js/show-image-content-size.js'],
      })
      .then(() => console.log('script injected'))
  })
}

//-------------------- 右键菜单演示 ------------------------//

const menuItemId = 'unique_menu_id_测试右键菜单'
const selectionMenuItemId = 'unique_menu_id_使用度娘搜索'

chrome.runtime.onInstalled.addListener(() => {
  const menuList = [
    {
      title: '测试右键菜单',
      id: menuItemId,
    },
    {
      title: '使用度娘搜索：%s', // %s表示选中的文字
      contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
      id: selectionMenuItemId,
    },
  ]
  // 记录已创建菜单项的 id
  menuList.forEach(menuItem => {
    chrome.contextMenus.create(menuItem)
  })

  initRequestRules()
})

// 监听右键菜单项的点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === menuItemId) {
    chrome.notifications.create(
      null,
      {
        type: 'basic',
        iconUrl: 'img/icon.png',
        title: '这是标题',
        message: '您刚才点击了自定义右键菜单!',
      }
      // function (notification) {
      //   console.log(`消息通知已发送。${notification}`)
      // }
    )
  }
  if (info.menuItemId === selectionMenuItemId) {
    chrome.tabs.create({
      url:
        'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(info.selectionText),
    })
  }
})
// 监听来自 Popup 或 Content Script 的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(`既然手边有树叶 ~ file: background.js:72 ~ request:`, request)
  if (request.type === 'inject_background_js') {
    injectJsAndCss()
    return sendResponse({ success: true })
  }
  console.log('收到来自content-script的消息：')
  console.log(request, sender, sendResponse)
  sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request))
  if (request.action === 'modify_title') {
    document.title = message.title
    sendResponse({ success: true })
  }
})

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null)
  })
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
  getCurrentTabId(tabId => {
    chrome.tabs.update(tabId, { url: url })
  })
}

// 新标签打开某个链接
function openUrlNewTab(url) {
  chrome.tabs.create({ url: url })
}

// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log('inputChanged: ' + text)
  if (!text) return
  if (text == '烧烤') {
    suggest([
      { content: '长沙' + text, description: '你要找“长沙烧烤”吗？' },
      { content: '淄博' + text, description: '你要找“淄博烧烤”吗？' },
      { content: '岳阳' + text, description: '你要找“岳阳烧烤”吗？' },
    ])
  }
})

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener(text => {
  console.log('inputEntered: ' + text)
  if (!text) return
  const href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text
  openUrlCurrentTab(href)
})

// 是否显示图片
var showImage
chrome.storage.sync.get({ showImage: true }, function (items) {
  showImage = items.showImage
})

// const allowUrl = '<all_urls>'
const allowUrl = 'https://www.baidu.com/*'

// web请求监听
chrome.webRequest.onBeforeRequest.addListener(
  details => {
    // console.log(`请求拦截 onBeforeRequest:`, details)
    // 仅演示，无实际意义
    if (details.type == 'media') {
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/icon.png',
        title: '检测到音视频',
        message: '音视频地址：' + details.url,
      })
    }
  },
  { urls: [allowUrl] }
)

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   details => {
//     console.log(`请求即将发生并且初始标头已准备好时触发:`, details)
//     // 示例说明如何从所有请求中删除用户代理标头：
//     for (var i = 0; i < details.requestHeaders.length; ++i) {
//       if (details.requestHeaders[i].name === 'Accept') {
//         details.requestHeaders.splice(i, 1)
//         break
//       }
//     }
//     return { requestHeaders: details.requestHeaders }
//   },
//   { urls: [allowUrl] },
//   ['requestHeaders']
// )

// chrome.webRequest.onSendHeaders.addListener(
//   details => {
//     console.log(`在标头发送到网络之前触发:`, details)
//   },
//   { urls: [allowUrl] }
// )

// chrome.webRequest.onResponseStarted.addListener(
//   details => {
//     console.log(`当收到响应body的第一个字节时触发:`, details)
//   },
//   { urls: [allowUrl] }
// )
chrome.webRequest.onCompleted.addListener(
  details => {
    console.log(`请求完成:`, details)
  },
  { urls: [allowUrl] },
  ['responseHeaders']
)

// chrome.webRequest.onErrorOccurred.addListener(
//   details => {
//     console.log(`请求发生错误:`, details)
//   },
//   { urls: [allowUrl] }
// )

// 定义规则拦截请求
function initRequestRules() {
  //定义规则
  const initRules = [
    {
      id: 22,
      priority: 2,
      action: {
        type: 'modifyHeaders', // 参考：https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#type-RuleActionType
        requestHeaders: [
          {
            header: 'custom-header',
            operation: 'set', //还可以是 append remove 等
            value: '233',
          },
        ],
        responseHeaders: [
          // 跨域响应头
          {
            header: 'Access-Control-Allow-Origin',
            operation: 'set',
            value: '*',
          },
          {
            header: 'Access-Control-Allow-Methods',
            operation: 'set',
            value: 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH',
          },
        ],
      },
      condition: {
        urlFilter: '||baidu.com',
        resourceTypes: ['xmlhttprequest'],
      },
    },
  ]
  // 获取当前已存在的动态规则集
  chrome.declarativeNetRequest.getDynamicRules(function (res) {
    let rules = res.map(e => e.id)
    // 添加新的规则集和删除已有的规则集
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: initRules, //Rule[] optional
        removeRuleIds: rules, //number[] optional
      },
      function (callback) {
        console.log('更新规则成功')
      }
    )
  })
}
