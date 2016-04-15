const lang = {
  name: 'Web Presentation',
  sidebar: '浏览',
  menu: {
    "new": '新建',
    open: '打开',
    saveAs: '另存为',
    history: '历史版本',
  },
  button: {
    newOne: '新建',
    comfirm: '确认',
    cancel: '取消',
    close: '关闭',
    signin: '登录',
    signup: '注册',
    logout: '退出',
    personCenter: '个人中心',
    markdown: '使用markdown编辑',
    expand: '展开',
    collapse: '收起',
    add: '添加（在当前页之后）',
    remove: '删除（当前页）',
    fullscreen: '全屏',
    help: '查看帮助',
    menu: '菜单',
    background: '设置为默认背景',
    moreFiles: '到个人中心中查看更多...',
  },
  message: {
    successSave: '保存成功',
    successOperate: '操作成功',
    fullscreen: '按ESC退出全屏',
    loading: '加载中...',
    nothing: '这里什么也没有...',
    upload: '拖拽到这里上传...',
    uploadBG: '上传背景图片',

    history(time){
      return `创建于 ${time}`;
    },
    historyHint: '点击还原该历史记录',
  },
  error: {
    passwordUnmatch: '两次输入的密码不一致',
  },
  toolbar: {
    h1: '一级标题',
    h2: '二级标题',
    h3: '三级标题',
    bold: '加粗',
    italic: '斜体',
    quote: '引用',
    listNumbered: '数字列表',
    listBulleted: '列表',
    code: '代码',
    strikeThrough: '删除线',
    indent: '缩进',
    photo: '上传背景图片',
  },

  transition: {
    text: '切换效果',
    fade: '淡入',
    slideRight: '水平滑入',
    slideUp: '垂直滑入',
    flash: '闪烁',
    bounce: '跳跃',
    zoom: '放大',
    flip: '翻转',
    rotate: '旋转',
    roll: '滚动',
  },

  background: {
    text: '背景显示效果',
    right: '右侧突出',
    left: '左侧突出',
    vague: '模糊',
    clear: '清晰',
  },

  default: '# 请输入标题',

  columns: {
    name: '名称',
    lastUpdateTime: '上次更新时间',
    createTime: '创建时间',
  },

  time: {
    justnow: '刚刚',
    minutesago(m){
      return `${m} 分钟前`;
    },
    hoursago(h){
      return `${h} 小时前`;
    },
    yesterday: '昨天',
    daysago(d){
      return `${d} 天前`;
    },
    longago: '很久之前',
  },

  route: {
    signup:{
      userNameHint: '请输入账号',//please input your account.
      userNameLabel: '账号', //Your Account
      passwordHint: '请输入密码', //please input your password.
      passwordLabel: '密码', //Your Password
      comfirmHint: '请确认您的密码', //please confirm your password.
      comfirmLabel: '确认密码', //Confirm Your Password
      rememberMe: '记住我', //Remember me
    },
    home: {
      nicknameHint: '昵称',
      descriptionHint: '写点什么...',
      profile: '编辑个人介绍',
      allFiles: '全部的文件',
      recentFiles: '最近的文件',
    },
  }
};

export default lang;
