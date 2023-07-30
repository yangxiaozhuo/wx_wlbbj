const config = getApp().globalData.config
const utils = require('../../utils/util')
Page({
  data: {
    userInfo: {},
    token: "",
    currentSwiper: '0',
    list: [],
    systemInfoList: [],
    UserNotification: 0,
    SystemNotification: 0,
    currentPage: 1,
  },
  onShow() {
    let that = this;
    wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token: res.data
        })
      },
      fail() {
        that.setData({
          list: [],
          systemInfoList: [],
          UserNotification: 0,
          SystemNotification: 0,
        })
      }
    })
    wx.getStorage({
      key: 'auth',
      success (res) {
        that.setData({
          userInfo: res.data
        })
      },
      fail() {
        that.setData({
          list: [],
          systemInfoList: [],
          UserNotification: 0,
          SystemNotification: 0,
        })
      }
    })
    console.log("load")
    console.log(this.data)
    utils.ifLogined(function(flag){
      console.log("Page:info onShow() callback: flag  " + flag)
      if (flag) {
        that.getUnreadUserNotification()
        that.getUnreadSystemNotification()
        that.getUserNotification()
        that.getSystemNotification()
      } else {
        that.setData({
          userInfo: {},
          userNotificationNum: 0,
        })
      }
    });
  },
  switchSwiper(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentSwiper: index,
    })
  },
  swiperChanged(e) {
    this.setData({
      currentSwiper: e.detail.currentItemId,
    })
  },
  toPostDetail(e) {
    wx.navigateTo({
      url: `/pages/post/post?id=${e.currentTarget.dataset.id}`,
    })
  },
  toConversion(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id);
    wx.navigateTo({
      url: `/pages/conversion/conversion?userId=${id}`,
    })
  },
  toPersonal(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: `/pages/personal/personal?email=${id}`,
    })
  },
  // 获取有多少条未读的用户消息
  getUnreadUserNotification(){
    let that = this
    wx.request({
      url: config.message.UserUnreadMessage,
      header: {"authorization" : that.data.token},
      success: (res) => {
        let result = res.data
        if (result.code == 200) {
          console.log("updata num")
          console.log(result.data);
          that.setData({UserNotification:result.data})
        }
      }
    })
  },
  // 获取有多少条未读的系统消息
  getUnreadSystemNotification(){
    let that = this
    wx.request({
      url: config.message.SystemUnreadMessage,
      header: {"authorization" : that.data.token},
      success: (res) => {
        let result = res.data
        if (result.code == 200) {
          console.log("getUnreadSystemNotification() true")
          console.log(result.data);
          that.setData({SystemNotification:result.data})
        }
      }
    })
  },
  // 获取用户消息
  getUserNotification() {
    console.log("tt");
    console.log(this.data.list.length)
    console.log(this.data.currentPage)
    if(this.data.list.length > (this.data.currentPage - 1) * 10) {
      return;
    }
    console.log("tt2");
    let that = this
    wx.request({
      url: config.message.UserFirstList + `?current=` + that.data.currentPage,
      header: {"authorization" : that.data.token},
      success: (res) => {
        let data = res.data
        if (data.code === 200) {
          let list = data.data
          this.setData({
            list: that.data.list.concat(list),
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
  // 获取系统消息
  getSystemNotification() {
    let that = this
    wx.request({
      url: config.message.SystemFirstList,
      header: {"authorization" : that.data.token},
      success: (res) => {
        let data = res.data
        console.log("SystemFirstList===============")
        console.log(data)
        if (data.code === 200) {
          let newsystemInfoList = data.data
          this.setData({
            systemInfoList: newsystemInfoList,
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
  getMoreUserNotification() {
    this.getUserNotification()
  },
})