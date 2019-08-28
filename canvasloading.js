(function ($) {
    'use serict';
    var CanvasLoading = function (element, options) {
        this.$element = $(element);
        this.element = $(element)[0];
        this.context = $(element)[0].getContext('2d');
        this.revolutionCycle = options.revolutionCycle || this.revolutionCycle;
        this.revolutionFrame = options.revolutionFrame || this.revolutionFrame;
        this.rotationCycle = options.rotationCycle || this.rotationCycle;
        this.rotationFrame = options.rotationFrame || this.rotationFrame;
        this.emputyAngle = options.emputyAngle || this.emputyAngle;
        this.accelera = options.accelera || this.accelera;
        this.centerPercent = options.centerPercent || this.centerPercent;
        this.lineWidth = options.lineWidth || this.lineWidth;
        this.lineColor = options.lineColor || this.lineColor;
        this.context.translate(this.element.width / 2, this.element.height / 2);
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = this.lineColor;
        var minsize = this.element.width > this.element.height ? this.element.height : this.element.width;
        this.arcsize = (minsize - this.context.lineWidth * 2) / 2; //圆半径
        this.revolution = null;
        this.rotation = null;
        console.log(this);
    };
    CanvasLoading.prototype = {
        constructor: CanvasLoading,
        revolutionCycle: 3800, //公转周期时间
        revolutionFrame: 80, //公转帧数
        rotationCycle: 1500, //自转周期时间
        rotationFrame: 80, //自转帧数
        emputyAngle: 45, //自转留空角度
        accelera: 0.9, //渐变加速倍数
        centerPercent: 0.1, //加速位置百分比
        lineWidth: 10, //线条粗细
        lineColor: '#ccc', //线条颜色
        effect: 0, //动画样式
        revolution: null, //公转定时器
        rotation: null, //自转定时器
        revolutionCurrentGangle: 0, //公转当前角度
        rotationCurrentFrame: 0, //自转当前帧
        isbegin: false,
        start: function () {
            if (this.isbegin) {
                return;
            }
            this.isbegin = true;
            var parent = this;
            var canvas = this.element;
            var interval = Math.floor(1000 / this.rotationFrame); //每帧时间
            var angle = this.rotationCycle / (360 - this.emputyAngle); //每帧渐进角度
            var context = this.context;
            var arcsize = this.arcsize;
            var emputyangle = this.emputyAngle;
            var rotationCurrentFrame = 0;
            var rotationPath = this.createAcceleratingPathAtPosition(interval, this.rotationCycle, angle, this.accelera, this.centerPercent);
            this.rotation = setInterval(function () {
                parent.rotationCurrentFrame++;
                if (parent.rotationCurrentFrame == rotationPath.length) {
                    parent.rotationCurrentFrame = 0;
                    parent.effect = parent.effect == 0 ? 1 : 0;
                }
                context.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
                var tangle = rotationPath[parent.rotationCurrentFrame];
                if (tangle > 360) {
                    tangle = 360;
                }
                context.beginPath();
                switch (parent.effect) {
                    case 0:
                        context.arc(0, 0, arcsize, 0, tangle * (Math.PI / 180));
                        break;
                    case 1:
                        context.arc(0, 0, arcsize, tangle * (Math.PI / 180), 2 * Math.PI - (emputyangle * (Math.PI / 180)));
                        break;
                    default:
                        parent.effect = 0;
                        context.arc(0, 0, arcsize, 0, tangle * (Math.PI / 180));
                        break;
                }
                context.stroke();
            }, interval);
            //公转
            //var gcycle = 3800;//循环一周时间/毫秒revolutionCycle
            var gcycle = this.revolutionCycle; //循环一周时间/毫秒revolutionCycle
            //var gframe = 80;//帧数revolutionFrame
            var gframe = this.revolutionFrame; //帧数revolutionFrame
            var ginterval = Math.floor(1000 / gframe); //每帧时间
            var gangle = 360 / (gcycle / 1000 * gframe); //每帧渐进角度
            var ngangle = 0; //当前角度
            this.revolution = setInterval(function () {
                if (parent.revolutionCurrentGangle >= 360) {
                    parent.revolutionCurrentGangle = 0;
                    context.rotate(-gangle * Math.PI / 180);
                }
                parent.revolutionCurrentGangle += gangle;
                context.rotate(gangle * Math.PI / 180);
            }, ginterval);
        },
        stop: function () {
            if (this.rotation != null) {
                window.clearInterval(this.rotation);
                this.rotation = null;
            }
            if (this.revolution != null) {
                window.clearInterval(this.revolution);
                this.revolution = null;
            }
            this.isbegin = false;
            //console.log(this.rotationCurrentFrame);
        },
        createPath: function (interval, cycle, angle) {
            var arr = [];
            for (var addtime = 0; addtime < cycle; addtime += interval) {
                arr.push(addtime / angle);
            }
            return arr;
        },
        createAcceleratingPath: function (interval, cycle, angle, multiple) {
            var arr = []; //创建差值填充集合
            for (var addtime = 0; addtime < cycle; addtime += interval) {
                arr.push(interval / angle);
            }
            var middle = arr.length % 2 == 0 ? arr.length / 2 + 1 : Math.ceil(arr.length / 2); //集合中间位置
            var precot = middle - 1; //集合前半段数量
            var aftcot = arr.length - middle; //集合后半段数量
            var aftoffset = multiple / aftcot; //递增偏移系数量
            for (var i = 0; i < middle; i++) {
                var temp = arr[arr.length - i - 1] * multiple;
                arr[arr.length - i - 1] += temp;
                arr[i] -= temp;
                multiple -= aftoffset;
            }
            return this.accumulationArr(arr);
        },
        createAcceleratingPathAtPosition: function (interval, cycle, angle, multiple, center) {
            var arr = []; //创建差值填充集合
            for (var addtime = 0; addtime < cycle; addtime += interval) {
                arr.push(interval / angle);
            }
            var middle = Math.floor(arr.length * center);
            var precot = middle - 1; //集合前半段数量
            var aftcot = arr.length - middle; //集合后半段数量
            var preoffset = multiple / precot; //递增偏移系数量
            var aftoffset = multiple / aftcot; //递增偏移系数量
            var tpmultiple = multiple;
            for (var i = 0; i < middle; i++) {
                var temp = arr[middle - i - 1] * tpmultiple;
                arr[middle - i - 1] += temp;
                arr[i] -= temp;
                tpmultiple -= preoffset;
            }
            var tamultiple = multiple;
            var j = 0;
            for (var i = middle + 1; i < arr.length; i++, j++) {
                var temp = arr[i] * tamultiple;
                arr[i] += temp;
                arr[arr.length - j - 1] -= temp;
                tamultiple -= aftoffset;
            }
            return this.accumulationArr(arr);
        },
        accumulationArr: function (arr) {
            var prevval = arr[0];
            for (var i = 1; i < arr.length; i++) {
                arr[i] += prevval;
                prevval = arr[i];
            }
            return arr;
        }
    }
    $.fn.canvasloading = function (option, e) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('loading'),
                options = (typeof option == 'object') && option;
            if (!data) $this.data('loading', (data = new CanvasLoading($this, options)));
            if (typeof option == 'string') data[option].call(data, e);
        });
    }
    $.fn.canvasloading.Constructor = CanvasLoading;
})(jQuery);