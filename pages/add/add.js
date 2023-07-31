// 在 js 中处理逻辑
Page({
  data: {
    fileList: [],
    title: '',
    content: '',
  },
  afterRead(event) {
    const { file } = event.detail;
    let that = this
    console.log(file);
    let temp = {
      "url": file.tempFilePath
    }
    that.setData({
      fileList : that.data.fileList.concat(temp)
    })
  },
  delete(e) {
    console.log(e.detail.index);
  },
  preview(e) {
    let index = e.detail.index
    var sources =[{
      url:this.data.fileList[index].url
    }]
    wx.previewMedia({sources:sources})
  }
});
