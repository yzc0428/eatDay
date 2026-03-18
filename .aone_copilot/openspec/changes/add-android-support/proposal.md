# 变更提案：添加安卓平台支持

## 概述
将现有的 React Web 应用通过 Capacitor 打包为安卓应用，实现跨平台支持，提供接近原生的用户体验。

## 目标
- 将 Web 应用打包为可独立安装的 APK
- 优化移动端用户体验
- 访问必要的原生功能（相机、文件系统）
- 保持与 Web 版本的代码共享（90%以上）

## 范围

### 包含的功能
1. **Capacitor 集成**：配置 Capacitor 框架，支持 Android 平台
2. **原生功能适配**：
   - 相机访问（用于菜品拍照）
   - 文件系统访问（数据备份恢复）
   - 应用图标和启动画面
   - 状态栏和导航栏样式
3. **移动端优化**：
   - 触摸交互优化
   - 手势支持
   - 键盘处理
   - 屏幕适配
4. **性能优化**：
   - 启动速度优化
   - 内存管理
   - 离线支持
5. **打包和分发**：
   - APK 构建配置
   - 签名配置
   - 版本管理

### 不包含的功能
- 云端同步（继续使用 LocalStorage）
- 应用商店发布
- 推送通知
- iOS 平台支持（本次变更仅针对 Android）
- 后端服务

## 技术方案

### 核心技术栈
- **Capacitor 5**：跨平台框架
- **Android SDK**：目标 API 33（Android 13）
- **最低支持**：API 24（Android 7.0）
- **Capacitor 插件**：
  - @capacitor/camera：相机功能
  - @capacitor/filesystem：文件系统
  - @capacitor/splash-screen：启动画面
  - @capacitor/status-bar：状态栏控制
  - @capacitor/app：应用生命周期

### 架构变更
```
现有架构：
Web App (React) → Browser

新架构：
Web App (React) → Capacitor → Android WebView
                            → Native APIs
```

### 数据存储
- 继续使用 LocalStorage（通过 WebView）
- 使用 Capacitor Filesystem 实现数据备份到设备存储
- 数据路径：`/Android/data/com.eatday.app/files/`

## 用户价值
- **便捷性**：无需浏览器，直接从桌面启动
- **原生体验**：更流畅的交互和动画
- **离线使用**：完全离线可用
- **相机集成**：直接拍照添加菜品图片
- **数据安全**：本地存储，数据可备份

## 风险与限制

### 技术风险
- WebView 性能可能略低于原生应用
- 部分 Web API 在 WebView 中可能有兼容性问题
- 首次打包和配置可能遇到环境问题

### 限制
- 需要 Android 开发环境（Android Studio）
- APK 体积约 10-15MB
- 仅支持 Android 7.0 及以上版本
- 需要手动安装 APK（未上架应用商店）

### 缓解措施
- 充分测试 WebView 兼容性
- 提供详细的环境配置文档
- 使用 ProGuard 压缩 APK 体积
- 提供安装指南和常见问题解答

## 成功标准
- APK 可以成功安装并运行在 Android 7.0+ 设备上
- 所有 Web 功能在 Android 应用中正常工作
- 相机功能可以正常拍照并保存图片
- 应用启动时间 < 3 秒
- 内存占用 < 150MB
- 数据可以正常备份和恢复
- 应用无崩溃和严重性能问题

## 开发周期
预计 1-2 周完成

## 后续扩展计划（可选）
- iOS 平台支持
- 应用商店发布
- 推送通知
- 云端同步
- 应用内更新
