# 功能规范：Capacitor 集成

## 概述
将 Capacitor 框架集成到现有 React 应用中，实现 Web 到 Android 的跨平台支持。

## ADDED Requirements

### Requirement: Capacitor 框架初始化
系统 SHALL 成功集成 Capacitor 框架并配置 Android 平台支持。

#### Scenario: 初始化 Capacitor 项目
**Given** 已有 React Web 应用  
**When** 执行 Capacitor 初始化命令  
**Then** 生成 `capacitor.config.ts` 配置文件  
**And** 创建 `android/` 目录  
**And** 包含完整的 Android 项目结构

#### Scenario: 配置应用信息
**Given** Capacitor 已初始化  
**When** 配置 `capacitor.config.ts`  
**Then** appId 设置为 `com.eatday.app`  
**And** appName 设置为 `eatDay`  
**And** webDir 指向 `dist`  
**And** 配置正确的插件选项

#### Scenario: 同步 Web 资源到 Android
**Given** Web 应用已构建  
**When** 执行 `npx cap sync android`  
**Then** Web 资源复制到 `android/app/src/main/assets/public/`  
**And** 更新 Android 项目配置  
**And** 安装必需的原生依赖

### Requirement: 插件安装和配置
系统 MUST 安装并正确配置所有必需的 Capacitor 插件。

#### Scenario: 安装相机插件
**Given** Capacitor 项目已初始化  
**When** 执行 `npm install @capacitor/camera`  
**Then** 插件成功安装  
**And** 在 `package.json` 中添加依赖  
**And** 插件在 Android 项目中可用

#### Scenario: 安装文件系统插件
**Given** Capacitor 项目已初始化  
**When** 执行 `npm install @capacitor/filesystem`  
**Then** 插件成功安装  
**And** 文件系统 API 可用

#### Scenario: 配置启动画面插件
**Given** 启动画面插件已安装  
**When** 在 `capacitor.config.ts` 中配置启动画面  
**Then** 设置显示时长为 2000ms  
**And** 设置背景色为 `#FF9966`  
**And** 禁用加载动画

#### Scenario: 配置状态栏插件
**Given** 状态栏插件已安装  
**When** 在 `capacitor.config.ts` 中配置状态栏  
**Then** 设置样式为 `light`（浅色文字）  
**And** 设置背景色为 `#FF9966`

### Requirement: Android 项目配置
系统 SHALL 正确配置 Android 原生项目的所有必需设置。

#### Scenario: 配置应用权限
**Given** Android 项目已创建  
**When** 编辑 `AndroidManifest.xml`  
**Then** 添加相机权限：`android.permission.CAMERA`  
**And** 添加存储读取权限：`android.permission.READ_EXTERNAL_STORAGE`  
**And** 添加存储写入权限：`android.permission.WRITE_EXTERNAL_STORAGE`

#### Scenario: 配置 SDK 版本
**Given** Android 项目已创建  
**When** 编辑 `build.gradle`  
**Then** minSdkVersion 设置为 24  
**And** targetSdkVersion 设置为 33  
**And** compileSdkVersion 设置为 33

#### Scenario: 配置应用主题
**Given** Android 项目已创建  
**When** 编辑 `res/values/styles.xml`  
**Then** 设置主题色为温馨橙色  
**And** 配置状态栏样式  
**And** 配置启动画面主题

### Requirement: 构建和运行
系统 SHALL 支持在 Android 设备上构建和运行应用。

#### Scenario: 开发模式运行
**Given** Android 项目配置完成  
**And** Android 设备已连接或模拟器已启动  
**When** 在 Android Studio 中点击 Run  
**Then** 应用成功安装到设备  
**And** 应用启动并显示 Web 内容  
**And** 所有功能正常工作

#### Scenario: 构建 Debug APK
**Given** Android 项目配置完成  
**When** 执行 `./gradlew assembleDebug`  
**Then** 生成 debug APK 文件  
**And** APK 位于 `android/app/build/outputs/apk/debug/`  
**And** APK 可以成功安装

#### Scenario: 构建 Release APK
**Given** 签名配置已完成  
**When** 执行 `./gradlew assembleRelease`  
**Then** 生成签名的 release APK  
**And** APK 位于 `android/app/build/outputs/apk/release/`  
**And** APK 可以成功安装和运行

### Requirement: 热更新支持
系统 SHALL 支持开发时的热更新功能。

#### Scenario: 开发时修改代码
**Given** 应用在开发模式运行  
**When** 修改 React 代码并保存  
**Then** Vite 自动重新构建  
**And** 执行 `npx cap sync` 同步资源  
**And** 在设备上刷新应用查看更改

## 数据模型

```typescript
// capacitor.config.ts
interface CapacitorConfig {
  appId: string;              // 应用包名
  appName: string;            // 应用名称
  webDir: string;             // Web 资源目录
  server?: {
    androidScheme?: string;   // Android URL scheme
  };
  android?: {
    buildOptions?: {
      keystorePath?: string;  // Keystore 路径
      keystoreAlias?: string; // Key 别名
    };
  };
  plugins?: {
    [key: string]: any;       // 插件配置
  };
}
```

## 配置文件

### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eatday.app',
  appName: 'eatDay',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF9966',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#FF9966'
    }
  }
};

export default config;
```

### package.json 脚本
```json
{
  "scripts": {
    "cap:sync": "npx cap sync",
    "cap:open:android": "npx cap open android",
    "cap:run:android": "npx cap run android",
    "android:build": "npm run build && npx cap sync android",
    "android:dev": "npm run build && npx cap sync android && npx cap open android"
  }
}
```

## 验证规则

1. **Capacitor 版本**：
   - 使用 Capacitor 5.x 最新稳定版
   - 所有插件版本与 Capacitor 核心版本兼容

2. **Android 配置**：
   - minSdkVersion >= 24
   - targetSdkVersion = 33
   - 所有必需权限已声明

3. **构建验证**：
   - Debug APK 可以成功构建
   - Release APK 可以成功构建并签名
   - APK 大小 < 20MB

## 性能要求

- Capacitor 初始化时间 < 10 秒
- Web 资源同步时间 < 5 秒
- APK 构建时间 < 2 分钟（首次构建除外）
- 应用启动时间 < 3 秒
