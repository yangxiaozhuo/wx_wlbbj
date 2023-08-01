// 在 js 中处理逻辑
const utils = require('../../utils/util')
const config = getApp().globalData.config
const globalData = getApp().globalData
Page({
  data: {
    option: [],
    value: 0,
    fileList: [],
    urls: [],
    title: '',
    content: '',
  },
  afterRead(event) {
    const { file } = event.detail;
    let that = this
    console.log(file);
    for (let index = 0; index < file.length; index++) {
      let temp = {
        "url": file[index].tempFilePath
      }
      that.setData({
        fileList : that.data.fileList.concat(temp),
        urls : that.data.urls.concat(temp.url)
      })
    }
  },
  delete(e) {
    let index = e.detail.index
    const urls = this.data.urls;
    const fileList = this.data.fileList;
    if (index >= 0 && index < urls.length) {
      // 使用 splice() 方法删除指定索引的元素
      urls.splice(index, 1);
      fileList.splice(index, 1);
      // 更新页面的 urls 列表
      this.setData({
        urls: urls,
        fileList: fileList,
      });
    }
  },
  preview(e) {
    let index = e.detail.index;
    let urls = this.data.urls;
    var sources =[{
      urls,
      current: urls[index],
      // urls: this.data.fileList,
      // current:this.data.fileList[index].url
      // url:this.data.fileList[index].url
    }]
    wx.previewMedia({sources:sources})
  },
  oversize(e){
    wx.showToast({
      title: '仅运行上传1MB以内图片',
      icon: 'none',
    })
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
    this.getCategory()
  },
  getCategory() {
    let that = this
    wx.request({
      url: config.category.GetCategory,
      method: 'GET',
      success: (res) => {
        let data = res.data
        if (data.code === 200) {
          let resList = data.data
          let newoption = []
          for (let index = 0; index < resList.length; index++) {
            let temp = { 
              text: resList[index].categoryName, 
              value: resList[index].categoryId 
            };
            newoption = newoption.concat(temp)
          }
          that.setData({option:newoption})
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
  submit(e){
    console.log(e);
    console.log(this.data);
  },
  onSwitchChange(e){
    let index = e.detail;
    console.log(index);
    // console.log(e);
  }
});
