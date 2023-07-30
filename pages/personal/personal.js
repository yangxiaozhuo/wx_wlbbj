const utils = require('../../utils/util')
const config = getApp().globalData.config
Page({
  data: {
    userInfo: {},
    token: "",
    thirduid: '',
  },
  onLoad(query) {
    console.log(query)
    let that = this
    // wx.getStorage({
    //   key: 'auth',
    //   success (res) {
    //     that.setData({
    //       userInfo: res.data
    //     })
    //   } 
    // })
    wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token: res.data
        })
      } 
    })
    
    if (query && query.email) {
      let email = query.email
      this.setData({
        email,
      })
      this.getMultiUser(email)
    }
  },
  navigatItem(e) {
    return utils.navigatItem(e)
  },
  showDataTrend () {
    wx.navigateTo({
      url: '/pages/articleData/articleData',
    })
  },
  // 获取其他用户信息
  getMultiUser(email) {
    let that = this
    wx.request({
      url: config.user.getInfo + "/" + email,
      header: {"authorization" : that.data.token},
      success: (res) => {
        let data = res.data
        console.log(data);
        if (data.code == 200) {
          this.setData({
            userInfo: data.data
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