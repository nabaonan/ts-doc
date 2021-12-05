module.exports = {
  title: 'ts-doc',
  description: 'ts翻译',
  base: '/',
  head: [
    // 设置 描述 和 关键词
    [
      "meta",
      { name: "keywords", content: "ts官网文档" },
    ],
    [
      "meta",
      {
        name: "description",
        content:
          "ts翻译文档",
      },
    ],
  ],
  themeConfig: {
    sidebar: {
      // 侧边栏
      "/": [
        {
          text: "介绍",
          children: [
            { text: "什么是react-ant-admin？", link: "/" },
            { text: "开始使用", link: "/guide/start" },
            { text: "文件配置", link: "/guide/configuration" },
            { text: "路径配置", link: "/guide/path" },
          ],
        },
      ],
    },
    nav: [
      // 顶部右侧导航栏
      { text: "介绍", link: "/", activeMatch: "^/$|^/guide/" },
      {
        text: "预览地址",
        link: "https://azhengpersonalblog.top/react-ant-admin/",
      },
      {
        text: "更多地址",
        link: "/contact/",
      },
    ],
  },
}