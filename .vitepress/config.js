import { defineConfig } from 'vitepress';
import { docsAuto } from '@yicode/yidocs-auto';

const { sideBar, navBar } = docsAuto();

export default defineConfig({
    base: '/zyhdoc/',
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
                href: '/zyhLogo.ico'
            }
        ]
    ],
    themeConfig: {
        logo: '/zyhLogo.jpg',
        lastUpdatedText: '更新时间',
        siteTitle: '忄宇亘',
        outline: 'deep',
        outlineTitle: '大纲',
        socialLinks: [
            
            { icon: 'github', link: 'https://github.com/zyhyuheng' }
        ],
        footer: {
            message: '何以解忧，唯有代码。不忘初心，方得始终。',
            copyright: 'Copyright © 2019-present 陈随易'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        nav: [...navBar],
        sidebar: sideBar
    },
    vite: {
        optimizeDeps: {},
        plugins: []
    }
});
