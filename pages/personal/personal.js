const utils = require('../../utils/util')
const config = getApp().globalData.config
Page({
  data: {
    userInfo: {},
    token: "",
    thirduid: '',
  },
  onShow(query) {
    let that = this
    wx.getStorage({
      key: 'auth',
      success (res) {
        that.setData({
          userInfo: res.data
        })
      } 
    })
    wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token: res.data
        })
      } 
    })
    
    // console.log(query)
    if (query && query.thirduid) {
      let thirduid = query.thirduid
      this.setData({
        thirduid,
      })
      this.getMultiUser(thirduid)
    } else {
      console.log(this.data.userInfo.sex)
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
  getMultiUser(ids) {
    const auth = this.data.auth
    wx.request({
      url: `${config.lccroApiMsRequestUrl}/get_multi_user`,
      data: {
        uid: auth.uid,
        src: 'web',
        device_id: auth.clientId,
        token: auth.token,
        ids,
        cols: 'objectId|username|avatar_large|avatarLarge|role|company|jobTitle|self_description|selfDescription|blogAddress|isUnitedAuthor|isAuthor|authData|totalHotIndex|postedEntriesCount|postedPostsCount|collectedEntriesCount|likedPinCount|collectionSetCount|subscribedTagsCount|followeesCount|followersCount|pinCount',
      },
      success: (res) => {
        let data = res.data
        if (data.s === 1) {
          this.setData({
            userInfo: data.d && data.d[ids],
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
})