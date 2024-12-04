# git生成密钥
## 一、信息配置
git config --global user.name "姓名"
git config --global user.email "x邮箱"
## 二、生成ssh密钥
1. rsa加密（旧版本git使用）
ssh-keygen -t rsa -C "邮箱"
2. ed25519加密（新版本git用，我目前的版本为2.39.2，至于从哪个版本开始使用的这个方式就不清楚了）
ssh-keygen -t ed25519 -C "邮箱"
3. 生成的密钥位置
C:\Users\用户名\.ssh