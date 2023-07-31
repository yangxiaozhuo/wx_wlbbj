Page({
  data: {
    github: 'https://github.com/yangxiaozhuo',
    email: '1160685390@qq.com',
    qq: '1160685390',
    group: '747371681',
  },
  copy(e) {
    let dataset = (e.currentTarget || {}).dataset || {}
    let title = dataset.title || ''
    let content = dataset.content || ''
    wx.setClipboardData({
      data: content,
      success() {
        wx.showToast({
          title: `已复制${title}`,
          duration: 2000,
        })
      },
    })
  },
})