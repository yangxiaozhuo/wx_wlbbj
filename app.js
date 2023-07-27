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
        login: 'https://wlbbj.yangxiaobai.top/user/loginPlus',
        isLogin: 'https://wlbbj.yangxiaobai.top/user/isLogin',
        getInfo: 'https://wlbbj.yangxiaobai.top/user/query/',
        editrInfo: 'https://wlbbj.yangxiaobai.top/user/edit',
        editPassword: 'https://wlbbj.yangxiaobai.top/user/editPassword',
      },
      message: {
        AllUnreadMessage:'https://wlbbj.yangxiaobai.top/message/unreadAll',
        UserUnreadMessage: 'https://wlbbj.yangxiaobai.top/message/unreadPrivateMessage', // 未读的用户消息
        SystemUnreadMessage: 'https://wlbbj.yangxiaobai.top/message/unreadSystemMessage', // 未读的系统消息
        UserFirstList: 'https://wlbbj.yangxiaobai.top/message/getFirstList', // 用户消息的列表
        
      }

      
    }
  },
})