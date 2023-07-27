// pages/login/login.js
const config = getApp().globalData.config
const globalData = getApp().globalData
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emailNumber: '',
    password: '',
  },
  
  commit() {
    let emailNumber = this.data.emailNumber
    let password = this.data.password
    if (!emailNumber.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
      })
      return
    }
    if (!password.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入登录密码',
        icon: 'none',
      })
      return
    }
    this.login(emailNumber, password)
  },
  login (email, password) {
    wx.showLoading({
      title: '加载中...',
    })
    let url = config.user.login
    wx.request({
      url,
      method: "POST",
      data: {email,password},
      success: function (res) {
        console.log('login success res: ' ,res)
        let resData = res.data
        if (resData.code === 500) {
          wx.showToast({
            title: resData.errorMsg,
            icon: 'none',
          })
        }  else if (resData.code !== 200) {
          wx.showToast({
            title: '未知错误',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '已登录',
            icon: 'none',
          })
          wx.setStorage({
            key: 'auth',
            data: resData.data
          })
          wx.setStorage({
            key: 'token',
            data: resData.data.token
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      },
    })
  },
})