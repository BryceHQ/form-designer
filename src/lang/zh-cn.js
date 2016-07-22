const lang = {
  name: '表单设计器',
  sidebar: '浏览',
  menu: {
    "new": '新建',
    open: '打开',
    saveAs: '另存为',
    history: '历史版本',
  },
  button: {
    save: '保存',
    release: '发布到当前版本',
    releaseNew: '发布到新版本',
    preview: '预览',
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
  kit: {
    textbox: '文本框',
    radio: '复选框',
    checkbox: '单选框',
    combobox: '复选框',
    datebox: '日期控件',
    dateRange: '日期范围控件',
    datagrid: '表格控件',
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

  property: {
    // common
    title: '标题',
    name: '名称',
    type: '类型',
    placeholder: '占位文字',
    defaultValue: '默认值',
    label: '显示文字',
    vertical: '垂直布局',
    optionsVertical: '选项垂直布局',
    on: '选中值',
    off: '未选中值',
    basis: '宽度百分比',
    text: '文字',
    readOnly: '只读',
    options: '全部选项',
    option: '选项',
    style: '样式',
    containerStyle: '容器样式',
    labelStyle: '显示文字样式',

    //data
    value: '值',
    expression: '表达式',
    hidden: '隐藏',
    onChange: '绑定值改变事件',
    dataInputs : '数据输入',

    //textbox
    required: '必填项',
    requiredMessage: '必填提示文字',
    rule: '验证规则',
    invalidMessage: '无效提示文字',
    multiline: '多行文本框',

    //Datebox
    dateFormat: '日期格式',
    todayButton: '是否显示今天按钮',
    showYearDropdown: '显示下拉年份选择框',
    startPlaceholder: '开始占位文字',
    endPlaceholder: '结束占位文字',
    startValue: '开始值',
    endValue: '结束值',
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
