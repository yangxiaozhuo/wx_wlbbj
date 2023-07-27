const utils = require('../../utils/util')
const config = getApp().globalData.config
Page({
  data: {
    userInfo: {
      nickName:""
    },
    token:"",
    fileList: [],
  },
  onShow() {
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
  },

  clearStorage () {
    wx.showModal({
      title: '提示',
      content: '确定清理所有缓存数据?',
      cancelColor: '#3281ff',
      confirmColor: '#3281ff',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success (res) {
              console.log(res)
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        }
      }
    })
  },
  signout () {
    wx.showModal({
      title: '提示',
      content: '确定退出?',
      cancelColor: '#3281ff',
      confirmColor: '#3281ff',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success (res) {
              console.log(res)
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        }
      }
    })
  },
  editName () {
    wx.showModal({
      title: '输入新的用户名',
      editable: true,
      placeholderText: this.data.userInfo.nickName,
      cancelColor: '#3281ff',
      confirmColor: '#3281ff',
      success: (res) => {
        if (res.confirm) {
          let newName = res.content
          wx.request({
            url: config.editUserInfo,
            method: 'POST',
            header: {"authorization" : this.data.token},
            data: {  "nickname": newName },
            success: (res) => {
              let data = res.data
              if (data.code === 200) {
                let that = this
                wx.request({
                  url: config.getUserInfo + this.data.userInfo.email,
                  success: (res) => {
                    let data = res.data
                    if(data.code == 200) {
                      wx.setStorage({
                          key: 'auth',
                          data: data.data
                      })
                      that.setData({
                        userInfo : data.data
                      })
                    }
                  }
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
      }
    })
  },
  
  editSex() {
    let that = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success (res) {
        if (res.tapIndex == 0 || res.tapIndex == 1) {
          let newSex = res.tapIndex
          console.log(newSex)
          wx.request({
            url: config.editUserInfo,
            method: 'POST',
            header: {"authorization" : that.data.token},
            data: { "nickname":that.data.userInfo.nickName, "sex": newSex},
            success: (res) => {
              console.log(res)
              let data = res.data
              if (data.code === 200) {
                wx.request({
                  url: config.getUserInfo + that.data.userInfo.email,
                  success: (res) => {
                    console.log(res)
                    let data = res.data
                    if(data.code == 200) {
                      wx.setStorage({
                          key: 'auth',
                          data: data.data
                      })
                      that.setData({
                        userInfo : data.data
                      })
                    }
                  }
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
      }
    })
  },
  navigatItem (e) {
    return utils.navigatItem(e)
  },
  previewImg(){
    var sources =[{
      url:this.data.userInfo.avatar
    }]
    wx.previewMedia({sources:sources})
  },
  afterRead(event) {
    const { file } = event.detail;
    let that = this
    console.log(file);
    wx.showToast({
      title: '上传中',
      icon: 'none',
    })
    wx.uploadFile({
      url: 'https://wlbbj.yangxiaobai.top/user/uploadAvatar', // 仅为示例，非真实的接口地址
      filePath: file.url,
      header: {"authorization" : that.data.token},
      name: 'file',
      method:"POST",
      data: {
        'file': file
      },
      success(res) {
        console.log(res)
        var result = JSON.parse(res.data);
        console.log(result)
        if(result.code == 200) {
          wx.request({
            url: config.getUserInfo + that.data.userInfo.email,
            success: (res) => {
              let data = res.data
              if(data.code == 200) {
                wx.setStorage({
                    key: 'auth',
                    data: data.data
                })
                wx.getStorage({
                  key: 'auth',
                  success (res) {
                    that.setData({
                      userInfo: res.data
                    })
                  }
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
          
        } else {
          wx.showToast({
            title: result.errorMsg,
            icon: 'none',
          })
        }
        // // 上传完成需要更新 fileList
        // const { fileList = [] } = this.data;
        // fileList.push({ ...file, url: res.data.data });
        // this.setData({ fileList });
      },fail(res) {
        console.log(res)
      }
    });
  },
})