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
    categoryId: -1,
    loading: false,
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
    console.log(this.data);
    this.setData({loading: true})
    let that = this
    if(that.data.categoryId == -1) {
      wx.showToast({
        title: "请选择分类",
        icon: 'none',
      })
      this.setData({loading: false})
      return
    }
    if(that.data.title == "") {
      wx.showToast({
        title: "标题不能为空",
        icon: 'none',
      })
      this.setData({loading: false})
      return
    }
    if(that.data.content == "") {
      wx.showToast({
        title: "标题不能为空",
        icon: 'none',
      })
      this.setData({loading: false})
      return
    }
    let token = that.data.token
    wx.request({
      url: config.article.UploadArticle,
      header: {
        "authorization" : token
      },
      method:"POST",
      data: {
        "articleCategoryId": "1",
        "articleContent": that.data.content,
        "articleTitle": that.data.title,
      },
      success: (res) => {
        console.log(res)
        let data = res.data
        if (data.code === 200) {
          let id = data.data;
          that.upload(id);
        } else {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
          })
          this.setData({loading: false})
        }
      },
      fail: () => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
        this.setData({loading: false})
      },
    })
  },
  upload(id) {
    wx.showToast({
      title: "发布中",
      icon: 'none',
    })
    if(this.data.urls.length != 0) {
      let res = []
      this.uploadImages(id, 0, res);
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
      this.setData({loading: false})
    }
  },
  update(urls, id) {
    let that = this
    wx.request({
      url: config.article.UpdateImg,
      header: {
        "authorization" : that.data.token
      },
      method:"POST",
      data: {
        "id": id,
        "urls":urls
      },
      success: (res) => {
        console.log(res)
        let data = res.data
        if (data.code === 200) {
          wx.showToast({
            title: "发布成功",
            icon: 'none',
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          wx.showToast({
            title: data.errorMsg || "系统异常",
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
    this.setData({loading: false})
  },
  uploadImages(id, index, reslist) {
    wx.showToast({
      title: "已上传" + index + "张图片",
      icon: 'none',
    })
    if(index == this.data.urls.length) {
      this.update(reslist.join(";"),id);
    } else {
      const element = this.data.urls[index];
      let that = this
      wx.uploadFile({
        url: config.article.UploadImage + '?id='+ id, 
        filePath: element,
        header: {"authorization" : that.data.token},
        name: 'file',
        method:"POST",
        success(res) {
          var result = JSON.parse(res.data);
          console.log(result)
          if(result.code == 200) {
            reslist = reslist.concat(result.data)
            that.uploadImages(id, index + 1, reslist)
          } else {
            wx.showToast({
              title: result.errorMsg,
              icon: 'none',
            })
            this.setData({loading: false})
          }
          return "";
        },
        fail() {
          wx.showToast({
            title: '图片上传失败',
            icon: 'none',
          })
          this.setData({loading: false})
        }
      });
    }
  },
  onSwitchChange(e){
    let index = e.detail;
    this.setData({
      categoryId: index
    })
  }
});
