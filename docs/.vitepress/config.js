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
          text: "手册",
        
          children: [
            { text: "基础", link: "/handbook/basics" },
            { text: "日常类型", link: "/handbook/everyday-types" },
            { text: "函数", link: "/handbook/more-on-functions" },
           
          ],
        },
        {
          text: '参考资料',
         
          children: [
            { text: "实用类型", link: "/reference/utility-types" }
          ]
        }
      ],
     
    },
    nav: [
      // // 顶部右侧导航栏
      // { text: "介绍", link: "/", activeMatch: "^/$|^/guide/" },
      // {
      //   text: "预览地址",
      //   link: "https://azhengpersonalblog.top/react-ant-admin/",
      // },
      // {
      //   text: "更多地址",
      //   link: "/contact/",
      // },
    ],
  },
}