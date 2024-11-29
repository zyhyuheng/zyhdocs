import { defineConfig } from 'vitepress';
import { docsAuto } from '@yicode/yidocs-auto';

const { sideBar, navBar } = docsAuto();

export default defineConfig({
    lang: 'zh-CN',
    base: '/zyhdocs/',
    title: '忄宇亘',
    description: '我的文档',
    lastUpdated: true,
    cleanUrls: true,
    markdown: {
        theme: 'one-dark-pro',
        lineNumbers: true
    },
    outDir: './dist',
    srcDir: './markdown',
    ignoreDeadLinks: true,
    titleTemplate: false,
    head: [
        //
        [
            'link',
            {
                rel: 'shortcut icon',
                href: '/zyhdocs/favicon.ico'
            }
        ]
    ],
    themeConfig: {
        logo: '/zyhLogo.jpg',
        lastUpdatedText: '更新时间',
        siteTitle: '忄宇亘',
        outline: {
            label: '目录',
            level: [1, 4]
        },
        socialLinks: [
            
            { icon: 'github', link: 'https://github.com/zyhyuheng' }
        ],
        footer: {
            message: '何以解忧，唯有代码。不忘初心，方得始终。',
            copyright: 'Copyright © 2019-present 忄宇亘'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                      buttonText: '搜索文档',
                      buttonAriaLabel: '搜索文档'
                    },
                    modal: {
                      noResultsText: '无法找到相关结果',
                      resetButtonTitle: '清除查询条件',
                      footer: {
                        selectText: '选择',
                        navigateText: '切换',
                        closeText: '关闭'
                      }
                    }
                  }

            }
        },
        nav: [...navBar],
        sidebar: sideBar
    },
    vite: {
        optimizeDeps: {},
        plugins: []
    }

});
