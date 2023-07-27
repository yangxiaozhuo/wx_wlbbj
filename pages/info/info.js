const utils = require('../../utils/util')
const config = getApp().globalData.config
const globalData = getApp().globalData
Page({
  data: {
    userInfo: {},
    userNotificationNum: 0,
    token: "",
  },
  onShow () {
    let that = this
    wx.getStorage({
      key: 'auth',
      success (res) {
        that.setData({
          userInfo: res.data
        })
      },
      fail() {
        that.setData({
          userInfo: {},
          userNotificationNum: 0,
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token: res.data
        })
      },
      fail() {
        that.setData({
          userInfo: {},
          userNotificationNum: 0,
        })
      }
    })
    console.log("load")
    console.log(this.data)
    utils.ifLogined(function(flag){
      console.log("Page:info onShow() callback: flag  " + flag)
      if (flag) {
        that.userNotificationNum()
      } else {
        that.setData({
          userInfo: {},
          userNotificationNum: 0,
        })
      }
    });
  },
  
  navigatItem (e) {
    return utils.navigatItem(e)
  },
  // 消息中心消息条数
  userNotificationNum() {
    console.log("Page:info userNotificationNum() start")
    let token = this.data.token
    wx.request({
      url: config.getAllUnreadMessage,
      method: 'GET',
      header: {"authorization" : token},
      success: (res) => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          this.setData({
            userNotificationNum: data.data,
          })
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      },
    })
  },
})