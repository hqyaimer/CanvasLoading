CanvasLoading Canvas加载效果
===========================

#### Canvas加载动态效果，依赖于jQuery，可调整周期速度、帧数等，支持暂停。

开始使用
-------

### 引入JQuery

`<script src="http://code.jquery.com/jquery-3.4.1.min.js" type="text/javascript"></script>`

### 引入CanvasLoading

`<script src="./canvasloading.js" type="text/javascript"></script>`

### 编写Html

`<canvas id="Loading" height="80" width="80"></canvas>`

### 编写Javascript

```js
$('#Loading').canvasloading();
```

### Options 选项

`rotationCycle` - 设置自转一周的时间, 单位为毫秒, 默认为1500毫秒。

`rotationFrame` - 设置自转帧数, 默认为80帧。

`emputyAngle` - 设置自转留空角度, 默认为45度。

`revolutionCycle` - 设置公转一周的时间, 单位为毫秒, 默认为3800毫秒。

`revolutionFrame` - 设置公转帧数, 默认为80帧。

`accelera` - 设置渐变加速的倍数, 范围0-1, 值越大动态越强, 默认为0.9。

`centerPercent` - 设置渐变加速的位置, 范围0-1, 默认为0.1。

`lineWidth` - 设置线条粗细, 默认为10。

`lineColor` - 设置线条颜色, 默认为#ccc。

### Function 功能

`start` - 开始播放动画。

`stop` - 停止/暂停播放动画。

使用方式

```js
$('#Loading').canvasloading('start');
$('#Loading').canvasloading('stop');
```

Example 示例
-------

Html

`<canvas id="Loading" height="80" width="80"></canvas>`

JavaScript

```js
$('#Loading').canvasloading({
	lineWidth: 8,
	lineColor: '#16799c'
});
$('#Loading').canvasloading('start');
```

