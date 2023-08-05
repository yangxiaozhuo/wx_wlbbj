const utils = require('../../utils/util')
const config = getApp().globalData.config
const globalData = getApp().globalData
// 简单版
Page({
  data: {
    isAtBottom: true, // 初始值为 true，假设页面刚进入时是在最下面的
    token :"",
    userInfo:{},
    content: '', // 输入框
    // 聊天信息
    chatList:  [],
    userId:"",  // 对方id
    otherUserInfo: {}, // 对方信息
    current : 1,
  },
  // 页面滚动事件，记录页面滚动位置
  onPageScroll: function (e) {
    const height = wx.getSystemInfoSync().windowHeight
    const query = wx.createSelectorQuery().in(this)
    query.select('.scroll-list').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      // 列表的bottom不会为0
      // 当列表触底时，有一个窗口的高度的内容处于页面内，所以当列表的bottom等于窗口高度时，列表到达底部
      let dis = res[0].bottom - height
      if (dis < 1 && dis > -1) {
        this.setData({
          isAtBottom: true,
        });
        // 页面到达底部，此时可以根据需要进行隐藏浮标
      } else {
        this.setData({
          isAtBottom: false,
        });
      }
    })
  },
  onLoad: function(query){
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
        })
      }
    })
    if(query && query.userId) {
      this.setData({userId : query.userId})
      this.getList();
      this.getOtherUser(query.userId);
    }
    console.log(this.data)
  },
  onShow() {
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
    this.timer = setInterval(() => {
      this.getDataWithInterval();
    }, 5000); // 每隔5秒获取最新数据
  },
  // 在页面的 onUnload 或 onHide 生命周期中清除定时器
  onUnload() {
    clearInterval(this.timer);
  },
  onHide() {
    clearInterval(this.timer);
  },
  getOtherUser(userId) {
    let that = this
    wx.request({
      url: config.user.getInfo  + userId,
      success: (res) => {
        console.log(res)
        let data = res.data
        if(data.code == 200) {
          that.setData({"otherUserInfo": data.data})
          wx.setNavigationBarTitle({
            title: (data.data.nickName) || '私信'
          })
        }
      }
    })
  },
  // 定时请求服务器接口，获取最新数据
  getDataWithInterval: function () {
    // 发送请求到服务器的接口，获取最新数据
    let token = wx.getStorageSync('token') 
    let that = this
    wx.request({
      url: config.message.MessageList,
      method: 'GET',
      header: {"authorization" : token},
      data: {"userId":that.data.userId},
      success: (res) => {
        let data = res.data
        console.log("getDataWithInterval() true")
        console.log(data)
        if (data.code === 200) {
          let oldList = that.data.chatList
          let maxId = -1
          if (oldList.length > 0) {
            maxId = that.data.chatList[that.data.chatList.length - 1].id
          } 
          let newList = data.data.records
          let tempList = []
          for (let index = 0; index < newList.length; index++) {
            if(newList[index].id != maxId) {
              tempList = tempList.concat(newList[index])
            } else {break;}
          }
          tempList = tempList.reverse()
          console.log(tempList);
          if(tempList.length > 0) {
            this.setData({
              chatList: that.data.chatList.concat(tempList),
            });
          } else {
            return;
          }
          if(that.data.isAtBottom) {
            wx.pageScrollTo({
                scrollTop: 200000,
                duration: 3
            });
          }
        }
      },
      fail: (err) => {
        console.error('Failed to get latest data:', err);
      }
    });
  },
  getList() {
    let token = wx.getStorageSync('token') 
    let that = this
    wx.request({
      url: config.message.MessageList,
      method: 'GET',
      header: {"authorization" : token},
      data: {"userId":that.data.userId},
      success: (res) => {
        let data = res.data
        console.log("getList() true")
        console.log(data)
        if (data.code === 200) {
          let newList = data.data.records
          newList = newList.reverse()
          this.setData({
            chatList: that.data.chatList.concat(newList),
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
  // 输入监听
  inputClick(e) {
      this.setData({
          content: e.detail.value
      })
  },
  // 发送监听
  sendClick() {
    // 获取当前时间
    var date = new Date();
    // 组装数据
    var msg = {
      content:this.data.content,
      createdTime: date,
      fromAvatar: this.data.userInfo.avatar,
      fromId: this.data.userInfo.email,
      fromNickname: this.data.userInfo.nickname,
      status: 0,
      toAvatar: this.data.otherUserInfo.avatar,
      toId: this.data.otherUserInfo.email,
      toNickname: this.data.otherUserInfo.nickname,
    }
    this.setData({
      content: ''
    })
    this.send(msg)
  },
  send(msg){
    let that = this
    console.log(msg);
    wx.request({
      url: config.message.SendMessage,
      method: 'POST',
      header: {"authorization" : that.data.token},
      data: {"toId":msg.toId, "content":msg.content},
      dataType:"json",
      success: (res) => {
        let data = res.data
        if (data.code === 200) {
          this.setData({
            content: ''
          })
          this.getDataWithInterval();
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
  onReachBottom: function() {
    utils.delay(2000);
    this.setData({
      isAtBottom: false,
    });
    console.log(this.data);
    // this.loadPosts();
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    this.setData({
      currentPage: (this.data.chatList.length / 5) + 1,
    });
    let current = (this.data.chatList.length / 5) + 1
    let token = wx.getStorageSync('token') 
    let that = this
    wx.request({
      url: config.message.MessageList,
      method: 'GET',
      header: {"authorization" : token},
      data: {"userId":that.data.userId, "current":current},
      success: (res) => {
        let data = res.data
        console.log("onPullDownRefresh() true")
        console.log(data)
        if (data.code === 200) {
          let oldList = that.data.chatList
          let minId = -1
          if (oldList.length > 0) {
            minId = that.data.chatList[0].id
          } 
          let newList = data.data.records.reverse()
          let tempList = []
          for (let index = 0; index < newList.length; index++) {
            if(newList[index].id != minId) {
              tempList = tempList.concat(newList[index])
            } else {break;}
          }
          console.log(tempList);
          if(tempList.length > 0) {
            this.setData({
              chatList: tempList.concat(that.data.chatList),
            });
          } else {
            return;
          }
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
      complete: function (res) {
          wx.hideNavigationBarLoading(); //完成停止加载图标
          wx.stopPullDownRefresh();
      }
    })
  },
})
