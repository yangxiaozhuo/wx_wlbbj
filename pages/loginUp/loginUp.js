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
    code: '',
    hide2 : false,
    hide3 : false,
    password2:"",
    password3:"",
    errorinfo:"",
    isButtonDisabled:false,
    countdown: 60, // 倒计时的时间（秒）
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
  sendCode() {
    // 如果按钮已经被禁止点击，则不做任何操作
    if (this.data.isButtonDisabled) {
      return;
    }

    let that= this
    let emailNumber = this.data.emailNumber
    if (!emailNumber.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
      })
      return
    }
    wx.request({
      url: config.user.SendCode + "?email="+emailNumber,
      method: "POST",
      success (res) {
        let data = res.data
        console.log(res);
        if(data.code == 200) {
          wx.showToast({
            title: "验证码发送成功",
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      }
    })// 设置倒计时，每隔一秒更新倒计时时间
    // 禁止按钮点击
    this.setData({
      isButtonDisabled: true,
    });
    let timer = setInterval(() => {
      let countdown = this.data.countdown;
      countdown--;

      if (countdown <= 0) {
        // 倒计时结束，恢复按钮点击
        this.setData({
          isButtonDisabled: false,
          countdown: 60,
        });
        clearInterval(timer); // 清除定时器
      } else {
        // 更新倒计时时间
        this.setData({
          countdown: countdown,
        });
      }
    }, 1000); // 1000毫秒即一秒
  },
  getErrorinfo() {
    if (this.data.password2 == this.data.password3) {
      this.setData({errorinfo:""})
    } else {
      this.setData({errorinfo:"两次密码输入不一致"})
    }
  },
  commit() {
    let that= this
    let email = this.data.emailNumber
    let password2 = this.data.password2
    let password3 = this.data.password3
    let code = this.data.code
    if (!email.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
      })
      return
    }
    if (!password2.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
      })
      return
    }
    if (!password3.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
      })
      return
    }
    if (!code.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
      })
      return
    }
    if(password2 != password3) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
      })
      return
    }
    wx.request({
      url: config.user.Create,
      method: "POST",
      data:{
        "code": code,
        "email": email,
        "password": password2
      },
      success (res) {
        let data = res.data
        console.log(res);
        if(data.code == 200) {
          wx.showToast({
            title: "注册成功",
            icon: 'none',
          })
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      }
    })
  }
})