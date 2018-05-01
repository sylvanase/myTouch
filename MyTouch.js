/*
 * @Author: sylvanase
 * @Date:   2018-04-27 18:19:45
 * @Last Modified by:   sylvanase
 * @Last Modified time: 2018-05-01 22:00:23
 */

;
(function(global, factory) {
	// 检测与其他模块的匹配
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		global.MyTouch = factory();
	}

}(this, (function() {
	function MyTouch(selector, opt) {
		this._initial(selector, opt); // 基本配置
	}

	// 工具函数
	/**
	 * [extend 合并对象]
	 * @param  {[object]} o        [原始对象值]
	 * @param  {[object]} n        [新对象值]
	 * @param  {[boolean]} override [是否重写]
	 * @return {[object]}          [description]
	 */
	function extend(o, n, override) {
		// 使用新的值覆盖默认值，如果没有重置，使用默认值
		for (var key in n) { // 属性来自实例hasOwnProperty返回true，false来自原型
			if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
				o[key] = n[key];
			}
		}
		return o;
	}

	// 查找dom
	function $(selector) {
		var el,
			_el = [];
		if (typeof selector == 'string') { // 传入的选择器限定为id或class，唯一
			var html = selector.trim();
			if (html[0] === '#') { // 根据id查找
				el = document.getElementById(html.split('#')[1]);
			} else if (html[0] === '.') { // 根据classname查找
				_el = document.getElementsByClassName(html.split('.')[1]);
				if (_el.length > 1) {
					alert('classname不唯一，请检验。');
					return;
				} else {
					el = _el[0];
				}
			} else {
				alert('选择器只支持id或类名。');
				return;
			}
		}
		return el;
	}

	/**
	 * 返回计算后的最终值
	 * @param  {[type]} min [最小值]
	 * @param  {[type]} max [最大值]
	 * @param  {[type]} now [目前的值]
	 * @return {[number]}     [description]
	 */
	function calculateVal(min, max, now) {
		var _val = now;
		if (now <= min) {
			_val = min;
		} else if (now > max) {
			_val = max;
		}
		return _val;
	}

	MyTouch.prototype = { // prototype：指针，指向对象
		constructor: this, // 指向构造函数
		_initial: function(selector, opt) {
			var _this = this;
			var def = { // 默认参数值
				isMove: true, // 是否可拖动
				isZoom: false, // 是否开启缩放
				moveRange: [], // 移动的范围
				zoomRange: [] // 缩放的范围
			}
			_this.dom = $(selector);
			if (_this.dom !== undefined) { // 找到符合的dom元素，进行绑定
				_this.parentDom = $(selector).parentNode;
				_this.def = extend(def, opt, true); // 对值进行合并覆盖
				_this._touch();
			}
		},
		_touch: function() {
			var _this = this;
			_this.dom.addEventListener('touchstart', function(e) {
				e.preventDefault();
				var _coordOld, // 原始坐标
					_moveRange, // 可移动缩放的区域范围
					_coordNew = {
						x: 0,
						y: 0
					}, // 新坐标
					_coordFinal = {
						x: 0,
						y: 0
					}, // 最终坐标
					moveFn,
					zoomFn,
					isOne = false; // 是否为只有一个点
				if (e.touches.length == 1) {
					isOne = true;
				}
				var _positonP = window.getComputedStyle(_this.parentDom, null).position;
				if (_positonP == 'static') { // 父元素的postion不可为static
					_this.parentDom.style.position = 'relative';
				}
				var touch1 = e.touches[0], // 记录第一根手指的初始位置
					touch2 = e.touches[1]; // 第二根手指
				_coordOld = {
					x: _this.dom.offsetLeft - touch1.pageX, // 开始时的坐标差
					y: _this.dom.offsetTop - touch1.pageY
				};
				_moveRange = { // 划定该块可移动的范围
					x: _this.parentDom.offsetWidth - _this.dom.offsetWidth,
					y: _this.parentDom.offsetHeight - _this.dom.offsetHeight
				}
				// 添加屏幕移动事件
				if (_this.def.isMove) {
					document.addEventListener('touchmove', moveFn = function(e) {
						var t = e.touches[0];
						_coordNew.x = _coordOld.x + t.pageX; // 新的x方向位置
						_coordNew.y = _coordOld.y + t.pageY; // 新的y方向位置
						if (_moveRange.x <= 0) {
							_coordFinal.x = calculateVal(_moveRange.x, 0, _coordNew.x);
						} else {
							_coordFinal.x = calculateVal(0, _moveRange.x, _coordNew.x);
						}
						_this.dom.style.left = _coordFinal.x + "px";

						if (_moveRange.y < 0) {
							_coordFinal.y = calculateVal(_moveRange.y, 0, _coordNew.y);
						} else {
							_coordFinal.y = calculateVal(0, _moveRange.y, _coordNew.y);
						}
						_this.dom.style.top = _coordFinal.y + "px";

					}, false);
				}
				// 添加屏幕缩放事件
				if (_this.def.isZoom) {
					document.addEventListener('touchmove', zoomFn = function(e) {
						if (e.touches.length == 2 && !isOne) { // 两根手指为放大缩小效果

						}
					}, false);
				}
				document.addEventListener('touchend', f1 = function(e) {
					//移除在document上添加的事件
					document.removeEventListener("touchend", f1);
					document.removeEventListener("touchmove", moveFn);
					// document.removeEventListener("touchmove", _this.zoom(e));
				}, false);
			}, false)
		}

	}


	return MyTouch;
})));