const config = getApp().globalData.config
const utils = require('../../utils/util')
Page({
  data: {
    userInfo: {},
    token: "",
    currentSwiper: '0',
    list: [],
    // list: [{"content": "回答我啊等哈我回到武汉电脑玩电脑玩电脑哦i海盗湾活动i挖掘嗲我们见到啊我i多久哦挖掘到我的默哀你的哦i啊是大家哦啊我能见到五年电动i闹i偶就导电膜阿萨",
    // "conversionId": "123456@whut.edu.cn->290059@whut.edu.cn",
    // "createdTime": "2023-07-25T00:50:10.000+00:00",
    // "fromAvatar": "http://qiniu.yangxiaobai.top/avatar/2023/07/bffkjo52wn.jpg",
    // "fromId": "290059@whut.edu.cn",
    // "fromNickname": "杨小白2",
    // "id": 427,
    // "status": 0,
    // "toAvatar": "http://qiniu.yangxiaobai.top/avatar/2023/07/h4ea0p2em2.jpg",
    // "toId": "123456@whut.edu.cn",
    // "toNickname": "xiaobai",
    // "unread": 100
    // }],
    systemInfoList: [],
    UserNotification: 0,
    SystemNotification: 0,
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
  toPersonal(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/personal/personal?thirduid=${id}`,
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
          console.log("updata num")
          console.log(result.data);
          that.setData({SystemNotification:result.data})
        }
      }
    })
  },
  // 获取用户消息
  getUserNotification() {
    let that = this
    wx.request({
      url: config.message.UserFirstList,
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
            title: data.m.toString(),
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
          let systemInfoList = data.data
          this.setData({
            systemInfoList: that.data.systemInfoList.concat(systemInfoList),
          })
        } else {
          wx.showToast({
            title: data.m.toString(),
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