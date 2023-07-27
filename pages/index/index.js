// pages/index/index.js

Page({
  data: {
    posts: [],
    currentPage: 1,
    pageSize: 10,
  },
  onLoad: function() {
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
        posts = that.data.posts.concat(posts);
        console.log(posts)
        that.setData({
          posts: posts,
        });
      },
    });
  },
  onPostTap: function(event) {
    var post = event.currentTarget.dataset.post;
    wx.navigateTo({
      url: '/pages/post/post?postId=' + post.postId,
    });
  },
  onReachBottom: function() {
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.loadPosts();
  },
});