App({
  onLaunch () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systeminfo = res
      },
    })
  },
  globalData: {
    token:"",
    systeminfo: {},
    imageServer: 'https://images.weserv.nl/',
    config: {
      baseUrl: 'https://wlbbj.yangxiaobai.top/',
      loginRequestUrl: 'https://wlbbj.yangxiaobai.top/user/login',  //登录
      isLoginRequestUrl: 'https://wlbbj.yangxiaobai.top/user/isLogin', // 是否登录
      getUserInfo:'https://wlbbj.yangxiaobai.top/user/query/',   // 查询用户信息
      getAllUnreadMessage:'https://wlbbj.yangxiaobai.top/message/unreadAll',  // 查询所有未读消息
      editUserInfo:'https://wlbbj.yangxiaobai.top/user/edit',   // 编辑用户信息
      editUserPassword: 'https://wlbbj.yangxiaobai.top/user/editPassword', // 修改密码
      user: {
        SendCode:'https://wlbbj.yangxiaobai.top/user/sentCode',
        Create: 'https://wlbbj.yangxiaobai.top/user/create',
        login: 'https://wlbbj.yangxiaobai.top/user/loginPlus',
        isLogin: 'https://wlbbj.yangxiaobai.top/user/isLogin',
        getInfo: 'https://wlbbj.yangxiaobai.top/user/query/',
        editrInfo: 'https://wlbbj.yangxiaobai.top/user/edit',
        editPassword: 'https://wlbbj.yangxiaobai.top/user/editPassword',
        uploadAvatar: 'https://wlbbj.yangxiaobai.top/user/uploadAvatar',
      },
      message: {
        AllUnreadMessage:'https://wlbbj.yangxiaobai.top/message/unreadAll',
        UserUnreadMessage: 'https://wlbbj.yangxiaobai.top/message/unreadPrivateMessage', // 未读的用户消息
        SystemUnreadMessage: 'https://wlbbj.yangxiaobai.top/message/unreadSystemMessage', // 未读的系统消息
        UserFirstList: 'https://wlbbj.yangxiaobai.top/message/getFirstList', // 用户消息的列表
        SystemFirstList: 'https://wlbbj.yangxiaobai.top/message/getNoticeList', // 系统通知的列表
        MessageList: 'https://wlbbj.yangxiaobai.top/message/getMessage', // 获得和指定用户的消息
        SendMessage: 'https://wlbbj.yangxiaobai.top/message/send', // 发消息
      },
      article: {
        SearchArticle: "https://wlbbj.yangxiaobai.top/article/search", // 搜索文章
        GetArticleInfo:"https://wlbbj.yangxiaobai.top/article/detail/", // 获得某个文章详情
        LikeArticle: "https://wlbbj.yangxiaobai.top/article/like/", // 点赞
        HotArticle: "https://wlbbj.yangxiaobai.top/article/hot", // 热点
        CreatArticle: "https://wlbbj.yangxiaobai.top/article/create", // 发布
      },
      category: {
        GetCategory: "https://wlbbj.yangxiaobai.top/category", 
      }

      
    }
  },
})