const config = getApp().globalData.config
const utils = require('../../utils/util')
Page({
  data: {
    token:"",
    userInfo:{},
    searchKey:"",
    swiperHeight: 'auto',
    rankList: [],
    hotList: [],
  },
  onShow () {
    console.log(this.data);
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
    this.getHot()
  },
  onChange(e) {
    this.setData({
      searchKey: e.detail,
    });
  },
  onSearch() {
    let that = this
    let key = this.data.searchKey
    wx.request({
      url: config.article.SearchArticle,
      method: 'GET',
      header: {"authorization" : that.data.token},
      data:{"key":key},
      success: (res) => {
        let data = res.data
        console.log(data)
        if (data.code === 200) {
          this.setData({
            rankList: data.data,
          })
          console.log(this.data);
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
  getHot() {
    let token = wx.getStorageSync('token') || {}
    let that = this
    wx.request({
      url: config.article.HotArticle,
      header: {"authorization" : token},
      method: 'GET',
      success: (res) => {
        console.log(res);
        let data = res.data
        if (data.code == 200) {
          let records = data.data.records
          for (let index = 0; index < records.length; index++) {
            records[index].articleImg = records[index].articleImg.split(";");
          }
          that.setData({
            hotList: records
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
  }
})