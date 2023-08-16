title: chrome 扩展开发
speaker: lin

<slide class="bg-black-blue aligncenter" image="https://cn.bing.com/az/hprichbg/rb/RainierDawn_EN-AU3730494945_1920x1080.jpg .dark">

# Chrome 插件开发 {.text-landing.text-shadow}

Click **Url + [?mode=speaker](./?mode=speaker){.bg-primary style="font-size:120%"}** to show Speaker Mode.

- 相关介绍 {.animated.fadeInUp.delay}
- 核心概念介绍 {.animated.fadeInUp.delay-400}
- 几种展现形式 {.animated.fadeInUp.delay-800}
- 几种类型 js 对比 {.animated.fadeInUp.delay-1200}
- 消息通信 {.animated.fadeInUp.delay-1600}
- 其他 {.animated.fadeInUp.delay-1600}

<!-- ![](/文档目录.png) {style="width:300px;" .aligncenter} -->

<!-- [:fa-github: Github](https://github.com/ksky521/nodeppt){.button.ghost.animated.flipInX.delay-1200} -->

<slide :class="size-50 ">

### 什么是 Chrome 插件？

---

Chrome 插件是一个用 Web 技术开发、用来增强浏览器功能的软件，是由一个由 HTML、CSS、JS、图片等资源组成的一个.crx 后缀的压缩包。允许开发者通过添加自定义功能和交互性来改善用户的浏览器体验。 {.animated.fadeInUp}

- 开发门槛低 几乎支持任意的技术栈
- 覆盖范围广 Chrome 在市场份额上以很大, 也可以迁移到其他 chrome 内核的浏览器中如 360 浏览器

<slide :class="size-50 ">

### Chrome 插件能做什么？

---

增强浏览器功能，“定制”属于自己的浏览器

- 个性化：定制化的新标签页，或者浏览器主题 {.animated.fadeInUp}
- 网页内容操作：例如自动填充表单、屏蔽广告、移除页面元素等 {.animated.fadeInUp.delay-400}
- 数据抓取和处理：从网页中提取数据，并进行处理和分析，用于生成报告、展示统计信息等。 {.animated.fadeInUp.delay-800}
- 工具：例如截图工具、翻译、密码管理等，以增强用户的工作效率和便利性。 {.animated.fadeInUp.delay-1200}
- 特定问题解决方案：将某些网站的信息跟现有系统同步，将现有系统信息发布到某些网站。{.animated.fadeInUp.delay-1600}

<slide :class="size-50 ">

### V3 版

---

Chrome 网上应用店不再接受 Manifest V2 扩展, V3 是指 Chrome 插件的第三版扩展规范，它引入了一些重大改变 提供了新的架构功能：

---

- 使用 Service Worker 作为后台脚本的实现方式，取代了 V2 的后台页（background page) {.animated.fadeInUp}
- 通过沙盒环境隔离内容脚本，提高了插件的安全性 {.animated.fadeInUp.delay-400}
- 可以使用 ES 模块语法。许多常用 API 现在原生支持 Promise {.animated.fadeInUp.delay-800}
- 弃用用很多 api，更严格的权限管理，网络拦截，使用新的 declarativeNetRequest 来修改请求。 {.animated.fadeInUp.delay-1200}

<slide :class="size-50 ">

### V2 [弃用时间线](https://developer.chrome.com/docs/extensions/migrating/mv2-sunset/)

![](/v3版本支持时间线.png)
![](/v2弃用说明.png)

<slide :class="size-80">

:::card

## 加载插件

Chrome 插件没有严格的项目结构要求，只要保证本目录有一个 manifest.json 即可.
{.text-intro}

- 从右上角菜单->更多工具->扩展程序可以进入 插件管理页面
- 也可以直接在地址栏输入 chrome://extensions 访问
- 勾选开发者模式即可以文件夹的形式直接加载插件，否则只能安装.crx 格式的文件。

---

![](/加载插件.png)

:::

<slide :class="size-40 aligncenter">

### 核心概念介绍

---

- manifest.json {.animated.fadeInUp.delay}
- content-scripts {.animated.fadeInUp.delay-400}
- background (service worker) {.animated.fadeInUp.delay-800}
- popup {.animated.fadeInUp.delay-1200}
- injected-script (注入的普通 js) {.animated.fadeInUp.delay-1600}

<slide :class="size-50">

### manifest.json

它的作用类似于小程序的 app.json 和前端项目的 package.json。
{.text-intro}

- 是一个 Chrome 插件最重要也是必不可少的文件，用来配置所有和插件相关的配置，必须放在根目录
- 其中，manifest_version、name、version3 个是必不可少的，description 和 icons 是推荐的。

<slide :class="size-50">

### manifest.json 常用配置

```
{
  "manifest_version": 3, // 清单文件版本
  "name": "My Chrome Extension", // 插件名称
  "version": "1.0", // 插件版本
  "action": { // 插件在工具栏中的行为
    "default_popup": "popup.html", // 默认弹出窗口的HTML文件
    "default_icon": "icon.png" // 插件在工具栏中的图标
    "default_title": "My Chrome Extension" // 插件在工具栏中的默认标题
  },
  "background": {
    "service_worker": "background.js" // 后台页面或服务工作线程的配置
  },
  "content_scripts": [  // 内容脚本的配置
    {
      "matches": ["http://*/*", "https://*/*"], // 匹配的URL
      "js": ["contentScript.js"], // 要注入的JavaScript文件
      "css": ["styles.css"] // 要注入的CSS文件
    }
  ],
  "permissions": [ ... ], // 插件需要的权限列表
  "host_permissions": [ ... ],// 插件需要访问的主机权限列表
  "web_accessible_resources": [ // 插件可以访问的Web资源列表
    {
      "resources": ["images/*"], // 可访问的资源路径
      "matches": ["https://www.example.com/*"] // 可访问资源的URL匹配模式
    }
  ]
}

```

<slide :class="size-80 ">

### content-scripts

---

content-scripts 是 Chrome 插件向页面注入脚本（包括 css）的一种形式，通过注入自定义的 js 和 css，可以实现对页面进行动态修改调整。

---

场景

- 修改网页内容: 修改网页的 DOM 结构、样式和行为。 {.animated.fadeInUp.delay-400}
- 与页面交互：content_scripts 可以通过与页面中的 JavaScript 进行交互，实现与网页之间的通信。 {.animated.fadeInUp.delay-800}
- 注入自定义 UI：可以注入自定义的 HTML 和 CSS，创建插件的自定义用户界面。这样可以在页面上添加按钮、菜单、弹出窗口等交互元素。 {.animated.fadeInUp.delay-1200}

<slide :class="size-70">

### content_scripts 配置

```
{
	// 需要直接注入页面的JS
	"content_scripts":
	[
		{
			//"matches": ["http://*/*", "https://*/*"],
			// "<all_urls>" 表示匹配所有地址
			"matches": ["<all_urls>"],
			// 多个JS按顺序注入
			"js": ["js/jquery-1.8.3.js", "js/content-script.js"],
			// JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
			"css": ["css/custom.css"],
			// 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
			"run_at": "document_start"
		}
	],
}

```

<slide :class="size-70">
content_scripts与页面中的 JS 脚本是隔离的，它们运行在不同的上下文中，无法直接访问页面脚本中的变量和函数。如要访问页面 JS（例如某个 JS 变量），可以通过 injected js 来实现。

---

content-scripts 能访问绝大部分 chrome.xxx.api。
如果需要访问其他 API，可以通过消息传递机制与 background 脚本进行通信，由 background 脚本代为执行相关操作，能访问的几种: {.animated.fadeInUp}

- chrome.runtime: 用于与插件的后台脚本进行通信、获取插件信息和管理运行时环境 {.animated.fadeInUp}
- chrome.tabs: 用于获取当前标签页信息、操作标签页、切换标签页等 {.animated.fadeInUp.delay-400}
- chrome.storage: 用于读取和写入插件的本地存储数据。 {.animated.fadeInUp.delay-800}
- chrome.i18n: 用于国际化和本地化支持，包括获取翻译文本、当前语言环境等 {.animated.fadeInUp.delay-1200}
- chrome.contextMenus: 用于创建右键菜单项。{.animated.fadeInUp.delay-1600}
- chrome.action: 用于创建工具栏按钮 {.animated.fadeInUp.delay-1600}

<slide :class="size-80 ">

### background

---

后台（background）脚本在插件启动时被加载，V2 中是一直保持运行，在 V3 中是惰性的，空闲时休眠，触发事件时执行指定的逻辑。后台脚本会贯穿插件应用的全生命周期。

---

场景

- 后台任务处理：Background Service 可用于执行长时间运行的任务，例如定时任务、数据处理、数据同步等。 {.animated.fadeInUp.delay-400}
- 事件监听和响应：Background Service 可以监听和响应各种事件，例如浏览器启动、页面加载、标签页切换、网络请求等。通过注册相应的事件处理函数，可以在后台实时监控和响应这些事件，实现更复杂的功能和交互。 {.animated.fadeInUp.delay-800}
- 与其他组件通信：背景脚本作为插件的中央处理单元，与其他组件进行通信，接收和处理消息、命令或事件。 {.animated.fadeInUp.delay-800}

<slide :class="size-60 ">

background 的权限非常高，几乎可以调用所有的 Chrome 扩展 API，而且没有跨域限制，也就是可以跨域访问任何网站而无需要求对方设置 CORS。 {.animated.fadeInUp.delay}

---

在 V2 版本是配置 background.html 和 background.js。 在 V3 版本中改成了用 servic worker 实现， 配置 service_worker 字段指向一个 js 即完成了注册。跟网页端的有不一样，网页是先对 serviceWorker in navigator 进行功能检测，然后调用 register() 内部功能检测来注册服务。 {.animated.fadeInUp.delay-1600}

<slide :class="size-50">
### background配置

---

manifest.json

```
{
  "manifest_version": 3,
  "name": "My Chrome Extension",
  "version": "1.0",
  "background": {
    "service_worker": "background.js"
  },
  ...
}

```

background.js

```

// 示例：监听插件安装事件
chrome.runtime.onInstalled.addListener(function() {
console.log('Extension installed');
});

```

<slide :class="size-50">

### popup（弹出窗口）

---

- popup（弹出窗口）可以通过点击插件图标触发，点击插件图标会打开弹出窗口。通常用于展示插件的快速操作 {.animated.fadeInUp}
- 由于单击图标打开 popup，焦点离开又立即关闭，所以 popup 页面的生命周期一般很短，需要长时间运行的代码不要写在 popup 里面。{.animated.fadeInUp.delay-400}

<slide :class="size-50">
### popup配置 
```
{ // manifest.json
  "action": {
    "default_popup": "popup.html",
  },
  "permissions": [
    "notifications"
  ]
}
```

```
 // popup.html
  <h1>这是一个popup页面！</h1>
  <button id="myButton">点我抽卡</button>
  <script src="popup.js"></script>
```

```
// popup.js
document.addEventListener('DOMContentLoaded', function() {
// 在弹出窗口加载完成后执行的逻辑 可以在这里添加事件监听器等操作
const button = document.getElementById('myButton');
button.addEventListener('click', function() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title: '欧皇来了',
    message: "太欧了，一发入魂！"
  });
})
```

<slide :class="size-60">

### injected-script

---

injected-script 指的是通过 DOM 操作的方式向页面注入的普通 JS 文件。为什么需要通过这种方式注入 JS 呢？ {.animated.fadeInUp.delay}

---

这是因为 content-script 有一个很大的“缺陷”，也就是无法访问页面中的 JS，虽然它可以操作 DOM，但是 DOM 却不能调用它，也就是无法在 DOM 中通过绑定事件的方式调用 content-script 中的代码（包括直接写 onclick 和 addEventListener2 种方式都不行），但是，“在页面上添加一个按钮并调用插件的扩展 API”是一个很常见的需求，那该怎么办呢？ {.animated.fadeInUp.delay-400}

<slide :class="size-60 ">
content-script中通过DOM方式向页面注入inject-script代码示例：
```
// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.head.appendChild(temp);
}
```

<slide :class="size-60 ">
如果注入的js文件是插件的资源，没有在配置文件中配置，否则会出现如下错误：
```
Denying load of chrome-extension://efbllncjkjiijkppagepehoekjojdclc/js/inject.js. 
Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
```
配置文件中增加如下：
```
{
	"web_accessible_resources": [
    // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
    {
      "resources": ["js/*"], // 可访问的资源路径
      "matches": ["https://www.example.com/*"] // 可访问资源的URL匹配模式
    }
  ]
}
```

<slide :class="size-40 aligncenter" >

### 插件的几种展示形式

---

- action {.animated.fadeInUp.delay}
- 右键菜单 {.animated.fadeInUp.delay-400}
- override {.animated.fadeInUp.delay-600}
- devtools {.animated.fadeInUp.delay-800}
- options {.animated.fadeInUp.delay-1200}
- omnibox {.animated.fadeInUp.delay-1400}
- 桌面通知 {.animated.fadeInUp.delay-1600}

<slide :class="size-40 ">

### action(浏览器右上角)

---

通过配置 action 可以在浏览器的右上角增加一个图标，还可以配置 tooltip、badge 和 popup。
示例配置如下：

```
{
   "action": {
    "default_popup": "popup.html", // 默认弹出窗口的HTML文件
    "default_icon": "icon.png" // 插件在工具栏中的图标
    "default_title": "这是一个示例chrome插件" // 插件在工具栏中的默认标题
  }
}
```

<slide :class="size-40 ">

### icon 图标

---

action 图标推荐使用宽高都为 19 像素的图片，更大的图标会被缩小，格式随意，一般推荐 png，可以通过 manifest 中 default_icon 字段配置，也可以调用 setIcon()方法。

<slide :class="size-40 ">

### tooltip

---

修改 manifest 中 action 的 default_title 字段，或者调用 setTitle()方法。

![](/右上角插件标题.png)

<slide :class="size-40 ">

### badge

---

badge 可以在图标上显示一些文本，可以用来更新一些小的扩展状态提示信息。

- badge 空间有限，所以只支持 4 个以下的字符（英文 4 个，中文 2 个）。
- badge 无法通过配置文件来指定，必须通过代码实现，设置 badge 文字和颜色可以分别使用 setBadgeText()和 setBadgeBackgroundColor()。

```
chrome.action.setBadgeText({text: 'new'});
chrome.action.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
```

效果
![](/bdage示例.png)

<slide :class="size-40 ">

### 右键菜单

---

Chrome 插件可以自定义浏览器的右键菜单，主要是通过 chrome.contextMenus API 实现，右键菜单可以出现在不同的上下文，比如普通页面、选中的文字、图片、链接，等等，如果有同一个插件里面定义了多个菜单，Chrome 会自动组合放到以插件名字命名的二级菜单里，如下

![](/右键菜单多个重合.png)

<slide :class="size-60">

:::card

### 简单的右键菜单示例

```
// manifest.json
{"permissions": ["contextMenus"]}

// background.js
chrome.contextMenus.create(
  {
    id: "menuItemId",
    title: "测试右键菜单",
  }
)
```

---

![](/右键菜单简单.png)

:::

<slide :class="size-80">

:::card

### 添加右键百度搜索

```
// manifest.json
{"permissions": ["contextMenus"， "tabs"]}

// background.js
chrome.contextMenus.create(
  {
      title: '使用度娘搜索：%s', // %s表示选中的文字
      contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
      id: "selectionMenuItemId",
  }
);

// 监听右键菜单项的点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "selectionMenuItemId") {
    chrome.tabs.create({
      url:
        'https://www.baidu.com/s?ie=utf-8&wd=' +
        encodeURI(info.selectionText),
    })
  }
})
```

---

![](/右键菜单百度搜索.png)

:::

<slide :class="size-60">

### contextMenus 语法说明

---

完整 API 参见：[https://developer.chrome.com/extensions/contextMenus](https://developer.chrome.com/extensions/contextMenus)

```
chrome.contextMenus.create({
  id: 'menuId', // 菜单id
	type: 'normal'， // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
	title: '菜单的名字', // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
	contexts: ['page'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
	parentId: 1, // 右键菜单项的父菜单项ID。指定父菜单项将会使此菜单项成为父菜单项的子菜单
	documentUrlPatterns: 'https://*.baidu.com/*' // 只在某些页面显示此右键菜单
});
// 删除某一个菜单项
chrome.contextMenus.remove(menuItemId)；
// 删除所有自定义右键菜单
chrome.contextMenus.removeAll();
// 更新某一个菜单项
chrome.contextMenus.update(menuItemId, updateProperties);
```

<slide :class="size-60">
### override(覆盖特定页面)

---

使用 override 可以将 Chrome 默认的一些特定页面替换掉，改为使用扩展提供的页面。
扩展可以替代如下页面：

- 历史记录：从工具菜单上点击历史记录时访问的页面，或者从地址栏直接输入 chrome://history {.animated.fadeInUp}
- 新标签页：当创建新标签的时候访问的页面，或者从地址栏直接输入 chrome://newtab {.animated.fadeInUp.delay-400}
- 书签：浏览器的书签，或者直接输入 chrome://bookmarks {.animated.fadeInUp.delay-800}

<slide :class="size-50">
### override 注意项
---

- 一个扩展只能替代一个页面 {.animated.fadeInUp}
- 不能替代隐身窗口的新标签页 {.animated.fadeInUp.delay-400}
- 网页要设置 title，否则用户可能会看到网页的 URL，造成困扰 {.animated.fadeInUp.delay-800}

<slide :class="size-50">
### 更改示例
```
"chrome_url_overrides":
{
	"newtab": "newtab.html",
	"history": "history.html",
	"bookmarks": "bookmarks.html"
}
```
![](更改默认页提示.png) 
![](新标签页.png) {.animated.fadeInUp.delay-400}

<slide :class="size-60">
### devtools(开发者工具)

---

Chrome 允许插件在开发者工具(devtools)上动手脚，主要表现在：

- 自定义一个和多个和 Elements、Console、Sources 等同级别的面板
- 自定义侧边栏(sidebar)，目前只能自定义 Elements 面板的侧边栏

![](/vue开发者工具.png) {.animated.fadeInUp.delay-400}

<slide :class="size-80" image="/官方devtools图.png .right-bottom" style="padding-right: 400px">

### devtools [扩展介绍](https://developer.chrome.com/extensions/devtools)

---

每打开一个开发者工具窗口，都会创建 devtools 页面的实例，F12 窗口关闭，页面也随着关闭，所以 devtools 页面的生命周期和 devtools 窗口是一致的。devtools 页面可以访问一组特有的 DevTools API 以及有限的扩展 API，这组特有的 DevTools API 只有 devtools 页面才可以访问，background 都无权访问，这些 API 包括

- chrome.devtools.panels：面板相关
- chrome.devtools.inspectedWindow：获取被审查窗口的有关信息
- chrome.devtools.network：获取有关网络请求的信息

<slide :class="size-60">
### 创建一个devtools扩展
首先，要针对开发者工具开发插件，需要在清单文件声明如下：

```
{
	// 只能指向一个HTML文件，不能是JS文件
	"devtools_page": "devtools.html"
}
```

这个 devtools.html 里面一般什么都没有，就引入一个 js：

```
<!DOCTYPE html>
<html>
<head></head>
<body>
	<script type="text/javascript" src="js/devtools.js"></script>
</body>
</html>
```

可以看出来，其实真正代码是 devtools.js，html 文件是“多余”的
再来看 devtools.js 的代码：

<slide :class="size-70 ">
### devtools.js 的代码：

```
// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create('MyPanel', 'img/icon.png', 'mypanel.html', function(panel)
{
	console.log('自定义面板创建成功！'); // 注意这个log看不到
});

// 创建自定义侧边栏
chrome.devtools.panels.elements.createSidebarPane("Images", function(sidebar)
{
	// sidebar.setPage('../sidebar.html'); // 指定加载某个页面
	sidebar.setExpression('document.querySelectorAll("img")', 'All Images'); // 通过表达式来指定
	//sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
});
```

<slide :class="size-60">

### devtools 调试

修改了 devtools 页面的代码时，需要先在 chrome://extensions 页面按下 Ctrl+R 重新加载插件，然后关闭再打开开发者工具即可，无需刷新页面（而且只刷新页面不刷新开发者工具的话是不会生效的）。
由于 devtools 本身就是开发者工具页面，所以几乎没有方法可以直接调试它，直接用 chrome-extension://extid/devtools.html"的方式打开页面肯定报错，因为不支持相关特殊 API，只能先自己写一些方法屏蔽这些错误，调试通了再放开。

<slide :class="size-60 ">
### option(选项页)
就是插件的设置页面，有2个入口 一个是右键图标有一个“选项”菜单，还有一个在插件管理页面：

![](/options选项入口1.png)

![](/选项入口2.png)

<slide :class="size-60 ">
### 在配置文件中配置
配置之后在插件管理页就会看到一个选项按钮入口，点进去就是打开一个网页
```
{
  ...
  "options_page": "options.html",
  "permissions": [
    "notifications"
  ]
  ...
}
```

<slide :class="size-60">
### omnibox
omnibox是向用户提供搜索建议的一种方式。注册某个关键字可以触发插件自己的搜索建议界面，只能设置一个关键字。

![](/omnibox搜索建议.png)

<slide :class="size-60">
### omnibox配置
配置文件如下：
```
{
	// 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
	"omnibox": { "keyword" : "go" },
}
```
然后background.js中注册监听事件：
```
// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
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
  if (!text) return
    const href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text
    openUrlCurrentTab(href)
  })
  // 当前标签打开某个链接
  function openUrlCurrentTab(url) {
    getCurrentTabId(tabId => {
    chrome.tabs.update(tabId, {url: url});
  })
}
````

<slide :class="size-60">
### 桌面通知
Chrome提供了一个chrome.notifications API以便插件推送桌面通知

```
chrome.notifications.create(null, {
	type: 'basic',
	iconUrl: 'img/icon.png',
	title: '这是标题',
	message: '您刚才点击了自定义右键菜单！'
});
```

![](/桌面通知.png)

<slide :class="size-80 ">
### 5种类型的JS对比
| JS种类 | 可访问的API | DOM访问情况 | JS访问情况 | 直接跨域 | 调试方式 |
| --- | --- | --- | --- | --- | --- |
| background js | 可访问绝大部分API，除了devtools系列 | 不可直接访问 | 不可以 | 可以  | 插件管理页点击检查视图 |
| content script | 只能访问 runtime等部分API | 可以访问 | 不可以 | 不可以 | 打开Console,切换到插件脚本 |
| popup js | 可访问绝大部分API，除了devtools系列 | 不可直接访问 | 不可以 | 可以  | popup页面右键审查元素 |
| devtools js | 只能访问 devtools、runtime等部分API | 可以  | 可以  | 不可以 | 无有效方式 |
| injected script | 和普通JS无任何差别，不能访问任何扩展API | 可以访问 | 可以访问 | 不可以 | 普通js方式 |

<slide :class="size-60 ">
### 消息通信
不同组件之间经常需要进行消息通信来进行数据的传递，常用的通信api是 chrome.runtime.sendMessage
- Popup、Background和Content Script之间进行通信  {.animated.fadeInUp}
- 长链接 {.animated.fadeInUp.delay-400}
- injected script和content-script通信{.animated.fadeInUp.delay-800}

<slide :class="size-80">
### Popup、Background和Content Script之间进行通信
在Popup中发送消息：
```
// 向Background发送消息
chrome.runtime.sendMessage({ message: "Hello from Popup!" }, function(response) {
  console.log("Response from Background: ", response);
});
```

在 Background 中接收消息并回复：

```
// 监听来自Popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Message from Popup: ", request.message);
  // 回复消息给Popup
  sendResponse({ message: "Hello from Background!" });
});
```

在 Content Script 中接收消息：

```
// 监听来自Background的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Message from Background: ", request.message);
  // 在Content Script中执行操作
  // 回复消息给Background
  sendResponse({ message: "Hello from Content Script!" });
});
```

<slide :class="size-70">
### 长链接
有些情况下，需要持续对话，这时候就需要用到长链接，类似于websocket，可以在通信双方之间进行持久链接

---

在 Content Script 中建立长连接并与 Background 通信：

```

// 建立与 Background 的长连接
var port = chrome.runtime.connect({ name: "content-script-connection" });
// 监听来自 Background 的消息
port.onMessage.addListener(function(message) {
    console.log("Message from Background: ", message);
});
// 向 Background 发送消息
port.postMessage({ message: "Hello from Content Script!" });

```

在 Background 中建立长连接并与 Popup 通信：

```
// 监听来自 Content Script 的连接请求
chrome.runtime.onConnect.addListener(function(port) {
    console.log("Connected to Content Script");
    // 监听来自 Content Script 的消息
    port.onMessage.addListener(function(message) {
        console.log("Message from Content Script: ", message);
        port.postMessage({ message: "Hello from Background!" });
    });
});

```

<slide :class="size-60">
###  injected script和content-script通信
content-script和页面内的脚本（injected-script自然也属于页面内的脚本）之间唯一共享的东西就是页面的DOM元素，有2种方法可以实现二者通讯：
-  可以通过window.postMessage和window.addEventListener来实现二者消息通讯； {.animated.fadeInUp}
- 通过自定义DOM事件来实现；{.animated.fadeInUp.delay-400}

<slide :class="size-60">
###  第一种方式 postMessage
injected-script中
```
window.postMessage({"test": '你好！'}, '*');
```
content script中：
```
window.addEventListener("message", function(e)
{
	console.log(e.data);
}, false);
```

<slide :class="size-60">
###  第二种方式 Dom事件
injected-script中
```
const customEvent = document.createEvent('Event');
customEvent.initEvent('myCustomEvent', true, true);
document.dispatchEvent(customEvent);

```
content script中：
```

document.addEventListener('myCustomEvent', function(eventData) {
console.log('收到自定义事件消息：' eventData);
});

````


<slide :class="size-40">
### 其它

---

- 动态注入或执行JS  {.animated.fadeInUp}
- 动态注入CSS {.animated.fadeInUp.delay-400}
- 获取当前窗口ID {.animated.fadeInUp.delay-800}
- 获取当前标签页ID {.animated.fadeInUp.delay-1200}
- 本地存储 {.animated.fadeInUp.delay-1600}
- webRequest {.animated.fadeInUp.delay-1600}


<slide :class="size-80">

:::column {.vertical-align}

### 动态注入或执行JS

 虽然在background和popup中无法直接访问页面DOM，但是可以通过注入的js来执行脚本，从而实现访问web页面的DOM（注意，这种方式也不能直接访问页面JS）。  {.text-intro}


---

```
 {
  "name": "动态JS注入演示r",
  "manifest_version": 3
  "version": "1.0",
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "background": {
    "service_worker": "service-worker.js"
  },
  "action": {
    "default_title": "Make this page red"
  },
}
 ```
background js
```
function reddenPage() {
  document.body.style.backgroundColor = 'red';
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage
    });
  }
});
```
:::

---

Vertical sliding? `<article id="webslides" class="vertical">` {.aligncenter}
````

<slide :class="size-60">
### 动态注入CSS
```
chrome.scripting.insertCSS({
  target: { tabId: tabId }, // 要注入样式的标签页ID
  files: ["styles.css"] // 要注入的CSS文件路径，可以是相对插件根目录的路径
});
```
<slide :class="size-60">
### 获取当前窗口ID
```
chrome.windows.getCurrent(function(currentWindow)
{
	console.log('当前窗口ID：' + currentWindow.id);
});
```
<slide :class="size-70">
### 获取当前标签页ID
```
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}
```

<slide :class="size-60">
### 本地存储
本地存储建议用chrome.storage而不是普通的localStorage，主要的2点区别是：
- chrome.storage是针对插件全局的，即使你在background中保存的数据，在content-script也能获取到
- chrome.storage.sync 在用户登录谷歌账户的时候并且开启了同步可以将存储同步到任何一个同样登录的浏览器,没有进行登录或开启同步的时候和local一样保存在本地

需要声明 storage 权限，有 chrome.storage.sync 和 chrome.storage.local 2 种方式可供选择，使用示例如下：

```
 //执行存储
 chrome.storage.local.set({ 'key': "2333" })
 //获取存储
 chrome.storage.local.get(["key"], (result)=> {
     console.log(`chrome.storage.local.get ~ result:`, result)
 })
 //删除存储
 chrome.storage.local.remove("value")
 chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes))  {
      //存储的名字
      console.log(key)
      //存储的类型local或者sync
      console.log(namespace)
      //存储更新前的数据,首次存储为undefined
      console.log(oldValue)
      //存储更新后的数据
      console.log(newValue)
    }
  });
```

<slide :class="size-80" image="/webrequest生命周期.png .right-bottom" style="padding-right: 300px">

### [webRequest](https://developer.chrome.com/docs/extensions/reference/webRequest/)

chrome.webRequest API 的机制是当网络请求发起就会拦截，然后就可以观察和分析请求，V3 保留了 webRequest API，但是不能使用它继续拦截和修改 web 请求。
webRequest 生命周期

- onBeforeRequest 在请求即将发生时触发。此事件在建立任何 TCP 连接之前发送。
- onBeforeSendHeaders 当请求即将发生且初始标头已准备好时触发。
- onSendHeaders 在所有扩展有机会修改请求标头后触发，并显示最终 （\*） 版本。该事件在标头发送到网络之前触发。此事件是信息性的，以异步方式处理。它不允许修改或取消请求。
- onHeadersReceived 每次收到 HTTP（S） 响应标头时触发。由于重定向和身份验证请求，每个请求可能会发生多次。此事件旨在允许扩展添加、修改和删除响应标头，例如传入的内容类型标头。缓存指令在触发此事件之前处理，因此修改标头（如 Cache-Control）对浏览器的缓存没有影响。它还允许您取消或重定向请求。
- onAuthRequired 当请求需要对用户进行身份验证时触发。可以同步处理此事件以提供身份验证凭据。请注意，扩展可能会提供无效的凭据。注意不要通过重复提供无效凭据来进入无限循环。这也可用于取消请求。
- onBeforeRedirect 在即将执行重定向时触发。重定向可以由 HTTP 响应代码或扩展触发。此事件是信息性的，以异步方式处理。
- onResponseStarted 收到响应正文的第一个字节时触发。。
- onCompleted 成功处理请求时触发。
- onErrorOccurred 当请求无法成功处理时触发。

<slide :class="size-80">

:::column {.vertical-align}

### [declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/)

可以使用 declarativeNetRequest 对网络请求做处理，实质上是定义一些 json 格式的规则，这些规则会匹配所有的网络请求，并遵从这些规则做相应处理。匹配规则有静态规则和动态规则两种。{.text-intro}

---

```json
//manifest.json
{
	"declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "rules_1.json"
      }
    ]
  },
}
// rules_1 json

  [{
    "id": 2,
    "priority": 1,
    "action": {
      "type": "block"
    },
    "condition": {
      "urlFilter": "baidu.com",
      "resourceTypes": ["script", "image"]
    }
  }]
```

:::

<slide :class="size-60">

### 打包与发布

打包的话直接在插件管理页有一个打包按钮：

---

![](打包扩展选择.png)
![](打包扩展完成.png)

---

<slide :class="size-60">
### 发布  [账号注册](https://developer.chrome.com/docs/webstore/publish/)
---

## ![](注册开发者账号.png)
