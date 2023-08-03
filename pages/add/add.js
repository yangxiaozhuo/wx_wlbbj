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
    title: '价格',
    content: '价格',
    categoryId: -1,
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
        urls : that.data.urls.concat(file[index].tempFilePath)
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
    wx.previewImage({
      urls,
      current: urls[index],
    })
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
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
    })
    return
    let that = this
    if(that.data.categoryId == -1) {
      wx.showToast({
        title: "请选择分类",
        icon: 'none',
      })
      return
    }
    if(that.data.title == "") {
      wx.showToast({
        title: "标题不能为空",
        icon: 'none',
      })
      return
    }
    if(that.data.content == "") {
      wx.showToast({
        title: "标题不能为空",
        icon: 'none',
      })
      return
    }
    console.log(this.data);
    let token = that.data.token
    // const formDate = new FormData()
    // formDate.append('articleCategoryId', articleCategoryId.toString())
    // formDate.append('articleContent', articleContent )
    // formDate.append('articleTitle', articleTitle)
    // list.forEach(file => {
    //   formDate.append('files', file)
    // })
    wx.uploadFile({
      url: config.article.CreatArticle,
      header: {
        "authorization" : token
      },
      filePath: that.data.urls,
      // filePath: "",
      name: 'files',
      method:"POST",
      formData: {
        "articleCategoryId": "1",
        "articleContent": that.data.content,
        "articleTitle": that.data.title,
        // "files" : that.data.urls[0],
        "files" : that.data.urls[1],
        "files" : that.data.urls[2],
      },
      success: (res) => {
        console.log(res)
        let data = res.data
        if (data.code === 200) {
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
    console.log(e);
    console.log(this.data);
  },
  onSwitchChange(e){
    let index = e.detail;
    // console.log(index);
    this.setData({
      categoryId: index
    })
    // console.log(e);
  }
});
