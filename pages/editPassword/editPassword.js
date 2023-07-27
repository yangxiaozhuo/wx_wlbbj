// pages/editPassword/editPassword.js
// pages/login/login.js
const config = getApp().globalData.config
const globalData = getApp().globalData
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    hide1 : false,
    hide2 : false,
    hide3 : false,
    password1:"",
    password2:"",
    password3:"",
    errorinfo:"",
  },
  blur1() {
    this.setData({
      hide1: true
    })
  },
  focus1() {
    this.setData({
      hide1: false
    })
  },
  blur2() {
    this.setData({
      hide2: true
    })
  },
  focus2() {
    this.setData({
      hide2: false
    })
  },
  blur3() {
    this.setData({
      hide3: true
    })
  },
  focus3() {
    this.setData({
      hide3: false
    })
  },
  getErrorinfo() {
    if (this.data.password2 == this.data.password3) {
      this.setData({errorinfo:""})
    } else {
      this.setData({errorinfo:"两次密码输入不一致"})
    }
  },
  onShow () {
    let that = this
    wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token: res.data
        })
      }
    })
  },
  updataPassword() {
    wx.showModal({
      title: '提示',
      content: '确定修改密码？',
      cancelColor: '#3281ff',
      confirmColor: '#3281ff',
      success: (res) => {
        if (res.confirm) {
          let that = this
          wx.request({
            url: config.editUserPassword,
            method:"POST",
            header: {"authorization" : that.data.token},
            data: {
              "newPassword":that.data.password3,
              "oldPassword": that.data.password1,
            },
            success: (res) => {
              let data = res.data
              console.log(data)
              if(data.code == 200) {
                wx.showToast({
                  title: data.data,
                  icon: 'none',
                })
                wx.navigateBack({})
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
      }
    })
  }
})