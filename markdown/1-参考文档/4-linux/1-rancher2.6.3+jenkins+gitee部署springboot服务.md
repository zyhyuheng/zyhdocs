::: warning
注：环境为linux7.8，rancher2.6.3，jenkins2.368，docker20.10.18。安装过程这里就不说了。
本文记录的是简单的使用，其他情况没有试过
:::
# Jenkins配置
## 一、Jenkins全局配置
1.找到系统管理->全局工具配置
（1）配置jdk，linux中不需要配置环境变量，直接解压就行
![在这里插入图片描述](/images/jenkins-1.png)
（2）配置git，linux中需要进行配置
![在这里插入图片描述](/images/jenkins-2.png)
（3）配置maven，不需要配置环境变量，直接解压就行
![在这里插入图片描述](/images/jenkins-3.png)
## 二、Jenkins系统配置
（1）gitee配置，需要在Jenkins插件管理中安装gitee插件
插件名称见下图
![在这里插入图片描述](/images/jenkins-4.png)
链接名随便写，Gitee 域名 URL必须是如图所示，证书令牌点击添加在点Jenkins
![在这里插入图片描述](/images/jenkins-5.png)
添加gitee私人令牌，如下图，复制获取地址，点击新生令牌，提交之后复制令牌到输入框
![在这里插入图片描述](/images/jenkins-6.png)
（2）Publish over SSH配置，需安装Publish over SSH插件
插件名见下图
![在这里插入图片描述](/images/jenkins-7.png)
![在这里插入图片描述](/images/jenkins-8.png)
# Jenkins创建任务
创建自由风格任务
![在这里插入图片描述](/images/jenkins-9.png)
## 代码仓库配置
![在这里插入图片描述](/images/jenkins-10.png)
注：使用用户名密码，仓库URL需要https的
![在这里插入图片描述](/images/jenkins-11.png)
## 构建触发器配置
勾选Gitee webhook
![在这里插入图片描述](/images/jenkins-12.png)
![在这里插入图片描述](/images/jenkins-13.png)



将上两图中的URL复制和生成的密码复制到代码仓库中
![在这里插入图片描述](/images/jenkins-14.png)
## 构建环境
![在这里插入图片描述](/images/jenkins-15.png)
## Build Steps
1.添加maven，选择之前配置的maven，目标填写的是打包命令
![在这里插入图片描述](/images/jenkins-16.png)
2.执行 shell
![在这里插入图片描述](/images/jenkins-17.png)

```powershell
#!/bin/bash
# 上面这个东西不加，会报空间不足异常
# 注意：所有镜像，容器和应用的命名，最好不要有大写字母

# docker镜像/容器名字
SERVER_NAME=rancher-jenkins-test
# 操作/项目路径(Dockerfile和Jar存放的路径)
BASE_PATH=/home/jenkins_project/$SERVER_NAME
# 备份目录
BACKUP_PATH=/home/jenkins_project/backup


# jar名字
JAR_NAME=$SERVER_NAME-0.0.1-SNAPSHOT.jar
# 源jar路径（注：更新任务名需要同步更新这个路径，例：baiduapplet）
SOURCE_PATH=/var/lib/jenkins/workspace/$SERVER_NAME/target/$JAR_NAME

# 当前日期时间
DATE=`date +%Y%m%d-%H%M%S`

# 备份
function backup(){
	if [ ! -d $BACKUP_PATH  ]; then
  		mkdir $BACKUP_PATH
	else
  		echo "备份文件夹已存在"
	fi

	if [ -f "$BASE_PATH/$JAR_NAME" ]; then
    	echo "$JAR_NAME 备份..."
        	cp $BASE_PATH/$JAR_NAME $BACKUP_PATH/$SERVER_NAME-$DATE.jar
        echo "备份 $JAR_NAME 完成"
    else
    	echo "$BASE_PATH/$JAR_NAME不存在，跳过备份"
    fi
}

# 迁移，构建好的Jar包，复制到DockerFile一起
function transfer(){

    echo "迁移代码开始"
    
    rm -rf $BASE_PATH
    
    mkdir -p $BASE_PATH
    
    echo "最新构建代码 $SOURCE_PATH 迁移至 $BASE_PATH ...."
        cp $SOURCE_PATH $BASE_PATH 
        
    echo "迁移完成"
    
}

# 生成Dockerfile文件
function dockerfile(){
	echo "开始生成Dockerfile文件"
    
echo """

FROM java:8

ADD $JAR_NAME $JAR_NAME

#更改容器时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 容器启动后执行的操作
CMD java -jar $JAR_NAME

""" > $BASE_PATH/Dockerfile
	echo "生成Dockerfile文件成功"
}


#入口
backup		# 1：备份
transfer	# 2：迁移
dockerfile	# 3：生成dockerfile

```
3.Send files or execute commands over SSH
![在这里插入图片描述](/images/jenkins18.png)

```powershell
#!/bin/bash
# 上面这个东西不加，会报空间不足异常
# 注意：所有镜像，容器和应用的命名，最好不要有大写字母

# docker镜像/容器名字
SERVER_NAME=rancher-jenkins-test
# 操作/项目路径(Dockerfile和Jar存放的路径)
BASE_PATH=/home/jenkins_project/$SERVER_NAME

# 端口号
APP_PORT=5566 #应用的端口
E_PORT=5566 #服务暴露给外部调用的端口
# 容器id
CID=$(docker ps -a | grep "$SERVER_NAME" | awk '{print $1}')
# 镜像id
IID=$(docker images | grep "$SERVER_NAME" | awk '{print $3}')

function dockerBuild(){
	if [ -n "$CID" ]; then
		echo "存在$SERVER_NAME容器，CID=$CID,删除容器 ..."
			docker rm -f $CID 
		echo "$SERVER_NAME容器删除完成..."
	else
		echo "不存在$SERVER_NAME容器..."
	fi


	if [ -n "$IID" ]; then
		echo "存在$SERVER_NAME镜像，IID=$IID"
        docker rmi -f $IID
        echo "镜像删除完成"
		cd $BASE_PATH
		docker build -t $SERVER_NAME .
        echo "镜像构建完成"
	else
		echo "不存在$SERVER_NAME镜像，开始构建镜像"
		cd $BASE_PATH
        docker build -t $SERVER_NAME .
        echo "镜像构建完成"
	fi
    #以下执行的是在docker中运行服务，我这里不需要
    #echo "启动容器..."
    #docker run --name $SERVER_NAME -d -p $E_PORT:$APP_PORT $SERVER_NAME
    #echo "容器启动完成"
}

dockerBuild	# 4：停止->删除旧容器，删除旧镜像，重建镜像，run容器

#以下是将刚刚打的镜像推送到DockerHub
echo "开始登录docker"
docker login -u用户名 -p密码
echo "登录docker成功"
echo "开始打tag"
docker tag rancher-jenkins-test:latest 用户名/rancher-jenkins-test:latest
echo "打tag完成"
echo "开始推送镜像"
docker push 用户名/rancher-jenkins-test:latest
echo "推送镜像完成"

```
然后进行构建就可以了，如果出现超时，可以修改SSH Server的执行命令时间，点击高级就可以看见选项了
![在这里插入图片描述](/images/jenkins-18.png)
# Rancher集群创建
![在这里插入图片描述](/images/jenkins-19.png)
![在这里插入图片描述](/images/jenkins-20.png)
![在这里插入图片描述](/images/jenkins-21.png)
![在这里插入图片描述](/images/jenkins-22.png)

# Rancher配置
选择集群,这里得使用自己创建的集群，默认的local集群服务发现不好用，不知道为什么
![在这里插入图片描述](/images/jenkins-23.png)
## 在存储->Secrets中创建DockerHub的账号配置
![在这里插入图片描述](/images/jenkins-24.png)
![在这里插入图片描述](/images/jenkins-25.png)
1.输入DockerHub的账号密码，私有镜像库没试过
![在这里插入图片描述](/images/jenkins-26.png)
## 创建工作负载->Deployments
![在这里插入图片描述](/images/jenkins-27.png)
1.输入配置信息
![在这里插入图片描述](/images/jenkins-28.png)
2.等待状态为active之后，今日到这个创建的部署服务
![在这里插入图片描述](/images/jenkins-29.png)
3.点击YAML查看内容
![在这里插入图片描述](/images/jenkins-30.png)
4.记录下图中的键值
![在这里插入图片描述](/images/jenkins-31.png)
## 创建服务发现->services，用来配置外部可以访问
![在这里插入图片描述](/images/jenkins-32.png)
![在这里插入图片描述](/images/jenkins-33.png)
![在这里插入图片描述](/images/jenkins-34.png)
选择器中输入的就是之前记录的键值
![在这里插入图片描述](/images/jenkins-35.png)
配置完service之后，就可以在外部访问了
