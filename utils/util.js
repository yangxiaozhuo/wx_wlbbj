const config = getApp().globalData.config
const utils = require('./util')

let ifLogined = (callback) => {
  let token = wx.getStorageSync('token') || {}
  if (token == "") {
    return false;
  }
  let url = config.isLoginRequestUrl
  wx.request({
    url,
    method: "GET",
    header: {"authorization" : token},
    success: function (res) {
      console.log('islogin res: ' ,res)
      let resData = res.data
      if(!resData.data) {
        wx.clearStorage()
      }else {
        callback(resData.data)
      }
    },
    fail: function () {
      wx.showToast({
        title: '网路开小差，请稍后再试',
        icon: 'none',
      })
      callback(false)
    },
  })
}

let navigatItem = (e) => {
  const url = e.currentTarget.dataset.url || '/pages/index/index'
  const open = e.currentTarget.dataset.open
  const toUrl = () => {
    wx.navigateTo({
      url,
    })
  }
  if (open) {
    toUrl()
  } else {
    if ("" != wx.getStorageSync('token')) {
      toUrl()
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}

let delay = (milSec) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milSec)
  })
}

let toPostDetail = (e) => {
  let postId = e.articleId
  let url = ''
  url = `/pages/post/post?id=${postId}`
  wx.navigateTo({
    url,
  })
}

let refleshInfo = (email) => {
  
}

let formatDate = (nDate, date) => {
  if (isNaN(nDate.getTime())) {
    // 不是时间格式
    return '--'
  }
  let o = {
    'M+': nDate.getMonth() + 1,
    'd+': nDate.getDate(),
    'h+': nDate.getHours(),
    'm+': nDate.getMinutes(),
    's+': nDate.getSeconds(),
    // 季度
    'q+': Math.floor((nDate.getMonth() + 3) / 3),
    'S': nDate.getMilliseconds()
  }
  if (/(y+)/.test(date)) {
    date = date.replace(RegExp.$1, (nDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(date)) {
      date = date.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return date
}

let isValidMobile = (phone) => {
  let telReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[135678]|18[0-9]|14[579])[0-9]{8}$/
  if (telReg.test(phone.replace(/\s+/g, ''))) {
    return true
  }
  return false
}

let isEmptyObject = (obj) => {
  for (let i in obj) {
    return false
  }
  return true
}


// 页面重新加载情形：
// 1、切换账号（包括登录、退出登录）;
// 2、当前页面数据为空（可能是第一次进入该页面，或前 N 次进入该页面但是没有刷出来数据，这时候有必要重新加载）;
let pageReload = (scopeAuth, dataList) => {
  let auth = ifLogined()
  let dataEmpty = (list) => {
    let empty = false
    let item = null
    for (let i = 0, len = list.length; i < len; i++) {
      item = list[i]
      if (isEmptyObject(item)) {
        empty = true
        break
      }
    }
    return empty
  }
  if ((auth.token !== scopeAuth.token || auth.uid !== scopeAuth.uid) || dataEmpty(dataList)) {
    return true
  }
}

// 比较版本号：left > right 1, left < right -1, left == right 0
// 用途：旧版本不执行写入、删除 日历操作
let cmpVersion = (left, right) => {
  if (typeof left + typeof right !== 'stringstring') {
    return false
  }
  let a = left.split('.')
  let b = right.split('.')
  let i = 0
  let len = Math.max(a.length, b.length)
  for (; i < len; i++) {
    if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
      return 1
    } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
      return -1
    }
  }
  return 0
}

var GetUrlRelativePath = function (url) {
  var arrUrl = url.split('//');
  var start = arrUrl[1].indexOf('/') + 1;
  var relUrl = arrUrl[1].substring(start);
  if (relUrl.indexOf('?') != -1) {
    relUrl = relUrl.split('?')[0];
  }
  return relUrl;
}

// 获取 post id
// https://juejin.im/post/5b39bbcc5188252ce018c745
// 5b39bbcc5188252ce018c745 为 post id
var getPostIdByOriginalUrl = function (url) {
  return GetUrlRelativePath(url).split('/').slice(-1)[0]
};


module.exports = {
  ifLogined,
  navigatItem,
  refleshInfo,
  delay,

  formatDate,
  isValidMobile,
  isEmptyObject,
  pageReload,
  cmpVersion,
  getPostIdByOriginalUrl,
  toPostDetail,
}