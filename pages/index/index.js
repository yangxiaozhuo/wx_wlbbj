// pages/index/index.js
const utils = require('../../utils/util')
const config = getApp().globalData.config
const globalData = getApp().globalData
Page({
  data: {
    posts: [],
    currentPage: 1,
    pageSize: 10,
  },
  onShow: function() {
    this.loadPosts();
  },
  loadPosts: function() {
    var that = this;
    wx.request({
      url: 'https://wlbbj.yangxiaobai.top/article/new',
      data: {
        current: that.data.currentPage,
        // pageSize: that.data.pageSize,
      },
      success: function(res) {
        console.log(res)
        // var data = that.data.posts.concat(res.data)[0].data;
        var data = res.data.data
        console.log(data)
        var posts = data['records'];
        posts.forEach(element => {
          if (element.articleImg) {
            element.articleImg = element.articleImg.split(";");
          }
        });
        let newPost = that.data.posts
        let minId = newPost[newPost.length - 1] ?  newPost[newPost.length - 1].articleId : 1000000
        posts.forEach(element => {
          if (element.articleId < minId) {
            newPost = newPost.concat(element);
          }
        });
        console.log(newPost)
        that.setData({
          posts: newPost,
        });
      },
    });
  },
  onPostTap: function(event) {
    var post = event.currentTarget.dataset.post;
    utils.toPostDetail(post)
  },
  onReachBottom: function() {
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.loadPosts();
  },
  add() {
    wx.navigateTo({
      url: '../add/add',
    })
  },
  
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    
    var that = this;
    wx.request({
      url: 'https://wlbbj.yangxiaobai.top/article/new',
      data: {
        current: 1,
      },
      success: function(res) {
        var data = res.data.data
        var posts = data['records'];
        posts.forEach(element => {
          if (element.articleImg) {
            element.articleImg = element.articleImg.split(";");
          }
        });
        console.log(posts)
        that.setData({
          posts: posts,
          currentPage: 1,
        });
      },     
      fail: () => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      }, 
      complete: function (res) {
        wx.hideNavigationBarLoading(); //完成停止加载图标
        wx.stopPullDownRefresh();
      }
    });
  },
});
