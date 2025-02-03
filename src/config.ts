import type {
  LicenseConfig,   // 许可证配置
  NavBarConfig,    // 导航栏配置
  ProfileConfig,   // 个人资料配置
  SiteConfig,      // 网站配置
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'P0w3r',          // 网站标题
  subtitle: 'blog',         // 网站副标题
  lang: 'zh_CN',           // 语言设置，'en'（英语）, 'zh_CN'（简体中文）, 'zh_TW'（繁体中文）, 'ja'（日语）, 'ko'（韩语）, 'es'（西班牙语）, 'th'（泰语）
  themeColor: {
    hue: 250,              // 主题颜色的默认色调（0到360之间），例如：红色是0，青色是200，品红是345
    fixed: false,          // 是否隐藏主题颜色选择器
  },
  banner: {
    enable: false,         // 是否启用横幅
    src: 'assets/images/bg.jpg',   // 横幅图片路径，相对于 /src 目录。如果路径以 '/' 开头，则是相对于 /public 目录
    position: 'center',    // 横幅的位置，可选值：'top'（顶部）、'center'（居中）、'bottom'（底部），默认值是 'center'
    credit: {
      enable: true,       // 是否显示横幅图片的版权文本
      text: '',            // 版权文本
      url: ''              // 版权链接，指向原作者页面的链接（可选）
    }
  },
  toc: {
    enable: true,          // 是否显示文章右侧的目录（目录结构）
    depth: 3               // 显示目录的最大层级，1表示只显示主标题，2表示显示主标题和副标题，3表示显示更多层级的标题
  },
  favicon: [               // 留空数组将使用默认的favicon图标
    // {
    //   src: '/favicon/icon.png',    // favicon图标路径，相对于 /public 目录
    //   theme: 'light',              // (可选) 主题，可以是 'light'（浅色模式）或者 'dark'（深色模式），仅在不同的浅色和深色模式下使用不同图标时才设置
    //   sizes: '32x32',              // (可选) favicon图标的大小，设置不同大小的favicon图标时使用
    // }
  ]
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,      // 首页
    LinkPreset.Archive,   // 归档
    LinkPreset.About,     // 关于
    // {
    //   name: 'GitHub',            // GitHub链接
    //   url: 'https://github.com/P0w3rshe11',     // 内部链接不需要包括基础路径，因为它会自动添加
    //   external: true,           // 显示外部链接图标，并且会在新标签页中打开
    // },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/avatar.png',  // 头像路径，相对于 /src 目录。如果路径以 '/' 开头，则是相对于 /public 目录
  name: '又木',                              // 用户名
  bio: '学海无涯，勤奋向前',                   // 个人简介
  links: [
    // {
    //   name: 'Twitter',               // Twitter链接
    //   icon: 'fa6-brands:twitter',    // 图标，访问 https://icones.js.org/ 获取图标代码
    //   url: 'https://twitter.com',    // 网址
    // },
    // {
    //   name: 'Steam',                // Steam链接
    //   icon: 'fa6-brands:steam',     // 图标
    //   url: 'https://store.steampowered.com',   // 网址
    // },
    // {
    //   name: 'GitHub',               // GitHub链接
    //   icon: 'fa6-brands:github',    // 图标
    //   url: 'https://github.com/P0w3rshe11',    // 网址
    // },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,                        // 是否启用许可证
  name: 'CC BY-NC-SA 4.0',             // 许可证名称
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',  // 许可证链接
}
