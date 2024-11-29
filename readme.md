# zyhdocs

基础基于 `vitepress` 深度定制的文档项目模板。
本项目基于[yidocs](https://github.com/chenbimo/yicode/tree/master/packages/yidocs)修改而来。
本项目支持GitHub Pages部署。
## 为什么使用 `yidocs`？

`yidocs` 开箱即用，并且无需手动配置 `侧边栏` 和 `导航栏`。

如果我们使用 `vitepress`，需要的配置如下：

```javascript
export default {
    themeConfig: {
        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    items: [
                        { text: 'Index', link: '/guide/' },
                        { text: 'One', link: '/guide/one' },
                        { text: 'Two', link: '/guide/two' }
                    ]
                }
            ],

            '/config/': [
                {
                    text: 'Config',
                    items: [
                        { text: 'Index', link: '/config/' },
                        { text: 'Three', link: '/config/three' },
                        { text: 'Four', link: '/config/four' }
                    ]
                }
            ]
        }
    }
};
```

使用 `yidocs`，配置如下即可：

```javascript
import { docsAuto } from '@yicode/yidocs-auto';
let { sideBar, navBar } = docsAuto();
export default {
    themeConfig: {
        sidebar: sideBar,
        nav: navBar
    }
};
```

## 要求和理念

当然，要想如此方便地使用 `yidocs`，一些必要的约定还是要遵守的。

```bash
├───📁 markdown/
│   ├───📁 1-开源/
│   │   ├───📁 1-yite-cli/
│   │   │   ├───📁 1-基本简介/
│   │   │   │   ├───📄 1-基本介绍.md
│   │   │   │   ├───📄 2-快速体验.md
│   │   │   │   ├───📄 3-项目结构.md
│   │   │   │   └───📄 4-视频入门.md
```

1. 所有文件和目录，都要以 `数字-` 开头

如上所示，任何目录和文章，均以 `数字` + `短横线` 开头，作用就是用于 `文章` 和 `目录` 的排序。

如果没有人为的 `数字标识`，文档的目录和排序有可能是乱套的，所以此为 `yidocs` 的必要要求之一。

2. `markdown` 文件使用 `分类-[项目]-目录-文件` 的方式来进行组织。

什么意思呢？

继续看如上项目结构：

-   `分类` = `开源`
-   `项目` = `yite-cli`
-   `目录` = `基本简介`
-   `文章` = `基本介绍.md`

这样的结构是满足 `分类-项目-目录-文件` 要求的，是可以被正常展示的。

同时，可以看到，`[项目]` 以中括号包裹，表示 `项目` 这个 `概念结构` 不是必须的。

以下为没有 `项目` 的文件组织结构 `分类-目录-文件` 示例：

```bash
zyhdoc
├───📁 .github/
|   ├───📁 workflows/
|   │   └───📄 deploy.yml
├───📁 .vitepress/
├───📁 markdown/
│   ├───📁 1-关于/
│   │   ├───📁 1-站长信息/
│   │   │   └───📄 1-关于站长.md
│   │   └───📁 2-问题帮助/
│   │       └───📄 1-如何下载模板.md
```

-   `分类` = `关于`
-   `目录` = `站长信息`
-   `文章` = `关于站长.md`

这就是 `yidocs` 的文件组织结构。

不满足此规则的文件，在编译的控制台将会进行提示，且对应文件将不会在文档中显示。

## 部署到 GitHub Pages
如果要将文档部署到 GitHub Pages，可以参考以下步骤：
1.创建一个新的 GitHub 仓库。
2.在存储库设置中的“Pages”菜单项下，选择“Build and deployment > Source > GitHub Actions”
3.修改配置文件中base: '/仓库名/'
4.首次提交可能不会触发部署，可以在做一次提交