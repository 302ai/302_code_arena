# <p align="center"> 🖥️ 代码竞技场 🚀✨</p>

<p align="center">代码竞技场可以随机或自选两个AI模型同时生成代码，投票选择效果更佳的模型，根据投票结果生成个人排行榜。</p>

<p align="center"><a href="https://302.ai/tools/codearena/" target="blank"><img src="https://file.302.ai/gpt/imgs/github/20250102/72a57c4263944b73bf521830878ae39a.png" /></a></p >

<p align="center"><a href="README_zh.md">中文</a> | <a href="README.md">English</a> | <a href="README_ja.md">日本語</a></p>

![](docs/302_Code_Arena.png)

来自[302.AI](https://302.ai)的[代码竞技场](https://302.ai/tools/codearena/)的开源版本。你可以直接登录302.AI，零代码零配置使用在线版本。或者对本项目根据自己的需求进行修改，传入302.AI的API KEY，自行部署。

## 界面预览
在模型PK中提供web、python等多种编程语言选择，根据输入的描述随机或自选两个模型进行实时代码大战，看看谁的代码能力更胜一筹。
![](docs/302_Code_Arena_screenshot_01.png)

可看到代码和对应的预览效果，投票选出效果更佳的模型。
![](docs/302_Code_Arena_screenshot_02.png)

生成的代码和投票结果都会保存到历史记录里。
![](docs/302_Code_Arena_screenshot_03.png)

根据用户的投票结果，系统会自动生成个人模型排行榜，帮助你找到最适合用于代码生成的AI模型。
![](docs/302_Code_Arena_screenshot_04.png)

## 项目特性
### 💻 多语言代码支持
支持多种编程语言的代码生成。
### 🤖 AI模型对战
支持两个AI模型同时生成代码并进行对比。
### 📊 排行榜系统
基于用户投票生成个人模型排行榜。
### 💾 历史记录
完整保存所有代码生成记录和投票结果。
### 🌍 多语言支持
  - 中文界面
  - English Interface
  - 日本語インターフェース

## 🚩 未来更新计划
- [ ] 支持更多编程语言
- [ ] 支持更多AI代码生成模型

## 🛠️ 技术栈
- React
- Tailwind CSS
- Shadcn UI

## 开发&部署
1. 克隆项目 `git clone https://github.com/302ai/302_code_arena`
2. 安装依赖 `npm`
3. 配置302的API KEY 参考.env.example
4. 运行项目 `npm run dev`
5. 打包部署 `docker build -t 302_code_arena . && docker run -p 3000:80 302_code_arena`
6. node版本为20及以上


## ✨ 302.AI介绍 ✨
[302.AI](https://302.ai)是一个按需付费的AI应用平台，为用户解决AI用于实践的最后一公里问题。
1. 🧠 集合了最新最全的AI能力和品牌，包括但不限于语言模型、图像模型、声音模型、视频模型。
2. 🚀 在基础模型上进行深度应用开发，我们开发真正的AI产品，而不是简单的对话机器人
3. 💰 零月费，所有功能按需付费，全面开放，做到真正的门槛低，上限高。
4. 🛠 功能强大的管理后台，面向团队和中小企业，一人管理，多人使用。
5. 🔗 所有AI能力均提供API接入，所有工具开源可自行定制（进行中）。
6. 💡 强大的开发团队，每周推出2-3个新应用，产品每日更新。有兴趣加入的开发者也欢迎联系我们