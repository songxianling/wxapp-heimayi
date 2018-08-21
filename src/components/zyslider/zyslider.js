// component/zyslider/zyslider.js

var util = require('../util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    },
    minValue: {
      type: Number
    },
    maxValue: {
      type: Number
    },
    blockColor: {
      type: String
    },
    backgroundColor: {
      type: String
    },
    selectedColor: {
      type: String
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    min: 0,
    max: 10000,
    leftValue: 0,
    rightValue: '不限',
    totalLength: 0,
    bigLength: 0,
    ratio: 0.5,
    sliderLength: 40,
    containerLeft: 0, //标识整个组件，距离屏幕左边的距离
    hideOption: '', //初始状态为显示组件
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 设置左边滑块的值
     */
    _propertyLeftValueChange: function () {

      let minValue = this.data.minValue / this.data.max * this.data.bigLength
      let min = this.data.min / this.data.max * this.data.bigLength
      this.setData({
        leftValue: minValue - min
      })
    },

    /**
     * 设置右边滑块的值
     */
    _propertyRightValueChange: function () {
      let right = this.data.maxValue / this.data.max * this.data.bigLength + this.data.sliderLength
      console.log(right);

      this.setData({
        rightValue: right
      })
    },
    /**
     * 左边滑块滑动
     */
    _minMove: function (e) {

      let pagex = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderLength / 2

      if (pagex + this.data.sliderLength >= this.data.rightValue) {
        pagex = this.data.rightValue - this.data.sliderLength
      } else if (pagex <= 0) {
        pagex = 0
      }

      this.setData({
        leftValue: pagex
      })

      let lowValue = parseInt(pagex / this.data.bigLength * parseInt(this.data.max) + this.data.min)
      var myEventDetail = {
        lowValue: Math.floor(lowValue/10)*10
      }
      this.triggerEvent('lowValueChange', myEventDetail)
    },

    /**
     * 右边滑块滑动
     */
    _maxMove: function (e) {

      let pagex = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderLength / 2
      if (pagex <= this.data.leftValue + this.data.sliderLength) {
        pagex = this.data.leftValue + this.data.sliderLength
      } else if (pagex >= this.data.totalLength) {
        pagex = this.data.totalLength
      }

      this.setData({
        rightValue: pagex
      })

      pagex = pagex - this.data.sliderLength
      let heighValue = parseInt(pagex / this.data.bigLength * this.data.max)

      var myEventDetail = {
        heighValue:  Math.floor(heighValue/10)*10
      }
      this.triggerEvent('heighValueChange', myEventDetail)
    },
  },

  ready: function () {
    let that = this;
    const getSystemInfo = util.wxPromisify(wx.getSystemInfo)
    const queryContainer = util.wxPromisify(wx.createSelectorQuery().in(this).select(".container").boundingClientRect)
    util.wxPromisify(wx.getSystemInfo)()
      .then(res => {
        let ratio = res.windowWidth / 750
        that.setData({
          ratio: ratio,
        })
      })
      .then(() => {
        var query = wx.createSelectorQuery().in(this)
        query.select(".two-way-slider").boundingClientRect(function (res) {
          that.setData({
            totalLength: res.width / that.data.ratio - that.data.sliderLength,
            bigLength: res.width / that.data.ratio - that.data.sliderLength * 2,
            rightValue: res.width / that.data.ratio - that.data.sliderLength,
            containerLeft: res.left / that.data.ratio
          })

          /**
           * 设置初始滑块位置
           */
          that._propertyLeftValueChange()
          that._propertyRightValueChange()
        }).exec()
      })
  }
})
