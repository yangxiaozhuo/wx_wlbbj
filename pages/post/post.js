const WxParse = require('../../wxParse/wxParse.js')
const config = getApp().globalData.config
const utils = require('../../utils/util')
Page({
  data: {
    postInfo: {},
    token: '',
    userInfo:{}
  },
  onLoad(query) {
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
    console.log("load")
    console.log(this.data)
    let id = query.id || 130
    this.getDetailData(id)
  },
  preview (e) {
    let dataset = e.currentTarget.dataset
    let urls = dataset.urls
    let index = dataset.index
    console.log(e);
    wx.previewImage({
      urls,
      current: urls[index],
    })
  },
  toPersonal () {
    console.log(this.data.postInfo);
    wx.navigateTo({
      url: `/pages/personal/personal?email=${this.data.postInfo.articleUserId}`,
    })
  },
  // 获取 post 概要、详情
  getDetailData(id) {
    let token = this.data.token
    wx.request({
      url: config.article.GetArticleInfo + id,
      method: 'GET',
      header: {"authorization" : token},
      success: (res) => {
        console.log(res);
        let data = res.data
        if (data.code == 200) {
          if(data.data.articleImg == "") {
            data.data.articleImg = null
          }
          if(data.data.articleImg != null) {
            data.data.articleImg = data.data.articleImg.split(";")
          }
          this.setData({
            postInfo: data.data,
          })
          wx.setNavigationBarTitle({
            title: (data.data.articleTitle) || 'wlbbj'
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
    console.log(this.data);
  },
  onShareAppMessage(res) {
    return {}
  },
  // 点赞
  likeIt() {
    let id = this.data.postInfo.articleId
    let token = this.data.token
    let that = this
    wx.showToast({
      title: "点赞中",
      icon: 'none',
    })
    wx.request({
      url: config.article.LikeArticle + id,
      method: 'PUT',
      header: {"authorization" : token},
      success: (res) => {
        console.log(res);
        let data = res.data
        if (data.code == 200) {
          wx.showToast({
            title: "点赞成功",
            icon: 'none',
          })
          that.getDetailData(id)
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
  comment() {
    wx.showToast({
      title: "评论功能尚未开启",
      icon: 'none',
    })
  }
})