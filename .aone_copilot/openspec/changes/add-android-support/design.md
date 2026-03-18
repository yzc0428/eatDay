# 架构设计：安卓平台支持

## 系统架构

### 整体架构图
```
┌─────────────────────────────────────────────────────┐
│                  React Application                  │
│  (现有 Web 代码 - 无需大幅修改)                      │
├─────────────────────────────────────────────────────┤
│              Capacitor Bridge Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Camera     │  │  Filesystem  │  │   App    │ │
│  │   Plugin     │  │    Plugin    │  │  Plugin  │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
├─────────────────────────────────────────────────────┤
│              Android WebView (Chromium)             │
├─────────────────────────────────────────────────────┤
│              Android Native Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Camera     │  │  File System │  │  System  │ │
│  │     API      │  │     API      │  │   APIs   │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
```

## 技术选型

### Capacitor vs Cordova
选择 **Capacitor 5** 的原因：
- 现代化架构，更好的性能
- 更简单的插件系统
- 官方维护的高质量插件
- 更好的 TypeScript 支持
- 活跃的社区和文档

### 目标平台
- **目标 SDK**：API 33 (Android 13)
- **最低 SDK**：API 24 (Android 7.0)
- **覆盖率**：约 95% 的活跃 Android 设备

### 必需的 Capacitor 插件

```json
{
  "@capacitor/core": "^5.0.0",
  "@capacitor/cli": "^5.0.0",
  "@capacitor/android": "^5.0.0",
  "@capacitor/camera": "^5.0.0",
  "@capacitor/filesystem": "^5.0.0",
  "@capacitor/splash-screen": "^5.0.0",
  "@capacitor/status-bar": "^5.0.0",
  "@capacitor/app": "^5.0.0",
  "@capacitor/haptics": "^5.0.0"
}
```

## 核心模块设计

### 1. Capacitor 集成层

#### 配置文件结构
```
capacitor.config.ts      # Capacitor 主配置
android/                 # Android 原生项目
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── res/
│   │   │   ├── drawable/    # 应用图标
│   │   │   ├── mipmap/      # 启动图标
│   │   │   └── values/      # 主题配置
│   │   └── assets/
│   │       └── public/      # Web 资源
│   └── build.gradle
└── build.gradle
```

#### Capacitor 配置
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eatday.app',
  appName: 'eatDay',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'eatday',
    }
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

### 2. 平台检测和适配层

#### 平台检测工具
```typescript
// src/utils/platform.ts
import { Capacitor } from '@capacitor/core';

export const Platform = {
  isNative: () => Capacitor.isNativePlatform(),
  isAndroid: () => Capacitor.getPlatform() === 'android',
  isWeb: () => Capacitor.getPlatform() === 'web',
  
  // 功能检测
  hasCamera: () => Capacitor.isPluginAvailable('Camera'),
  hasFilesystem: () => Capacitor.isPluginAvailable('Filesystem'),
};
```

#### 条件渲染组件
```typescript
// src/components/PlatformSpecific.tsx
interface Props {
  web?: React.ReactNode;
  native?: React.ReactNode;
  android?: React.ReactNode;
}

export const PlatformSpecific: React.FC<Props> = ({ 
  web, 
  native, 
  android 
}) => {
  if (Platform.isAndroid() && android) return <>{android}</>;
  if (Platform.isNative() && native) return <>{native}</>;
  if (Platform.isWeb() && web) return <>{web}</>;
  return null;
};
```

### 3. 原生功能封装

#### 相机服务
```typescript
// src/services/camera.service.ts
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export class CameraService {
  static async takePicture(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      width: 800,
      height: 800,
      correctOrientation: true
    });
    
    return `data:image/jpeg;base64,${image.base64String}`;
  }
  
  static async pickFromGallery(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      width: 800,
      height: 800
    });
    
    return `data:image/jpeg;base64,${image.base64String}`;
  }
}
```

#### 文件系统服务
```typescript
// src/services/filesystem.service.ts
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export class FilesystemService {
  static async backupData(data: string): Promise<string> {
    const fileName = `eatday-backup-${Date.now()}.json`;
    
    await Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    
    return fileName;
  }
  
  static async restoreData(fileName: string): Promise<string> {
    const result = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    
    return result.data as string;
  }
  
  static async listBackups(): Promise<string[]> {
    const result = await Filesystem.readdir({
      path: '',
      directory: Directory.Documents
    });
    
    return result.files
      .filter(f => f.name.startsWith('eatday-backup-'))
      .map(f => f.name);
  }
}
```

### 4. 移动端优化

#### 触摸优化
```css
/* src/styles/mobile.css */
/* 移除点击高亮 */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 优化滚动 */
.scrollable {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* 触摸区域最小尺寸 */
button, .clickable {
  min-height: 44px;
  min-width: 44px;
}
```

#### 手势支持
```typescript
// src/hooks/useSwipe.ts
export const useSwipe = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
```

### 5. 数据存储策略

#### LocalStorage 继续使用
- WebView 中的 LocalStorage 与浏览器行为一致
- 数据持久化在应用私有目录
- 路径：`/data/data/com.eatday.app/app_webview/Local Storage/`

#### 备份策略
```typescript
// src/services/backup.service.ts
export class BackupService {
  static async createBackup(): Promise<void> {
    // 1. 收集所有 LocalStorage 数据
    const data = {
      dishes: localStorage.getItem('dishes'),
      orders: localStorage.getItem('orderHistory'),
      favorites: localStorage.getItem('favorites'),
      statistics: localStorage.getItem('statistics'),
      timestamp: Date.now(),
      version: '1.0.0'
    };
    
    // 2. 序列化
    const jsonData = JSON.stringify(data, null, 2);
    
    // 3. 保存到文件系统
    const fileName = await FilesystemService.backupData(jsonData);
    
    // 4. 提示用户
    Toast.show({ text: `备份成功：${fileName}` });
  }
  
  static async restoreBackup(fileName: string): Promise<void> {
    // 1. 读取文件
    const jsonData = await FilesystemService.restoreData(fileName);
    
    // 2. 解析数据
    const data = JSON.parse(jsonData);
    
    // 3. 恢复到 LocalStorage
    if (data.dishes) localStorage.setItem('dishes', data.dishes);
    if (data.orders) localStorage.setItem('orderHistory', data.orders);
    if (data.favorites) localStorage.setItem('favorites', data.favorites);
    if (data.statistics) localStorage.setItem('statistics', data.statistics);
    
    // 4. 刷新应用
    window.location.reload();
  }
}
```

## 构建和打包

### 开发流程
```bash
# 1. 开发 Web 应用
npm run dev

# 2. 构建 Web 资源
npm run build

# 3. 同步到 Android 项目
npx cap sync android

# 4. 在 Android Studio 中打开
npx cap open android

# 5. 运行和调试
# 在 Android Studio 中点击 Run
```

### 生产构建
```bash
# 1. 构建优化版本
npm run build

# 2. 同步到 Android
npx cap sync android

# 3. 生成签名 APK
cd android
./gradlew assembleRelease

# 4. APK 位置
# android/app/build/outputs/apk/release/app-release.apk
```

### APK 签名配置
```gradle
// android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('release-key.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias 'eatday'
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 性能优化

### 1. 启动优化
- 使用启动画面隐藏加载时间
- 预加载关键资源
- 延迟加载非关键功能

### 2. 内存优化
- 图片懒加载
- 虚拟滚动长列表
- 及时清理未使用的资源

### 3. WebView 优化
```xml
<!-- AndroidManifest.xml -->
<application
    android:hardwareAccelerated="true"
    android:largeHeap="true">
```

## 测试策略

### 单元测试
- 平台检测逻辑
- 原生功能封装层
- 数据备份恢复逻辑

### 集成测试
- Capacitor 插件调用
- 文件系统操作
- 相机功能

### 设备测试
- 不同 Android 版本（7.0 - 14）
- 不同屏幕尺寸
- 不同性能设备

## 安全考虑

### 1. 数据安全
- LocalStorage 数据加密（可选）
- 备份文件加密
- 防止数据泄露

### 2. 权限管理
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 3. 网络安全
```xml
<!-- network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>
```

## 版本管理

### 版本号规则
- **versionCode**：整数，每次发布递增
- **versionName**：语义化版本，如 1.0.0

```gradle
// android/app/build.gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

## 兼容性矩阵

| 功能 | Android 7.0 | Android 8.0+ | Android 10+ | Android 13+ |
|------|-------------|--------------|-------------|-------------|
| 基础功能 | ✅ | ✅ | ✅ | ✅ |
| 相机 | ✅ | ✅ | ✅ | ✅ |
| 文件系统 | ✅ | ✅ | ⚠️ 需权限 | ⚠️ 需权限 |
| 启动画面 | ✅ | ✅ | ✅ | ✅ |
| 状态栏 | ✅ | ✅ | ✅ | ✅ |

## 故障排查

### 常见问题
1. **WebView 白屏**：检查资源路径和 CORS 配置
2. **相机无法打开**：检查权限配置
3. **文件无法保存**：检查存储权限
4. **APK 安装失败**：检查签名配置

### 调试工具
- Chrome DevTools（chrome://inspect）
- Android Studio Logcat
- Capacitor CLI 调试命令
