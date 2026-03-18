# 功能规范：原生功能集成

## 概述
集成 Android 原生功能，包括相机访问、文件系统操作和数据备份恢复功能。

## ADDED Requirements

### Requirement: 相机功能集成
系统 SHALL 提供相机拍照和相册选择功能。

#### Scenario: 拍照添加菜品图片
**Given** 用户在添加或编辑菜品页面  
**When** 用户点击"拍照"按钮  
**Then** 请求相机权限（如未授权）  
**And** 打开系统相机应用  
**And** 用户拍照后返回应用  
**And** 图片自动压缩到 800x800 像素  
**And** 图片转换为 Base64 格式  
**And** 显示图片预览

#### Scenario: 从相册选择图片
**Given** 用户在添加或编辑菜品页面  
**When** 用户点击"从相册选择"按钮  
**Then** 打开系统相册选择器  
**And** 用户选择图片后返回应用  
**And** 图片自动压缩和转换  
**And** 显示图片预览

#### Scenario: 相机权限被拒绝
**Given** 用户点击"拍照"按钮  
**When** 系统请求相机权限  
**And** 用户拒绝授权  
**Then** 显示权限说明对话框  
**And** 提示用户需要相机权限才能拍照  
**And** 提供"去设置"按钮打开应用设置页面

#### Scenario: 图片质量优化
**Given** 用户选择或拍摄了图片  
**When** 图片大于 500KB  
**Then** 自动压缩图片质量  
**And** 调整图片尺寸到 800x800 像素  
**And** 保持宽高比  
**And** 最终图片大小 < 500KB

#### Scenario: Web 端降级方案
**Given** 用户在 Web 浏览器中使用应用  
**When** 用户点击"拍照"或"选择图片"  
**Then** 显示文件选择对话框  
**And** 限制只能选择图片文件  
**And** 图片处理逻辑与原生相同

### Requirement: 文件系统访问
系统 SHALL 提供文件系统读写功能用于数据备份。

#### Scenario: 备份数据到文件
**Given** 用户在设置页面  
**When** 用户点击"备份数据"按钮  
**Then** 收集所有 LocalStorage 数据  
**And** 序列化为 JSON 格式  
**And** 生成文件名：`eatday-backup-{timestamp}.json`  
**And** 保存到 Documents 目录  
**And** 显示成功提示："备份成功：{文件名}"

#### Scenario: 查看备份文件列表
**Given** 用户在设置页面  
**When** 用户点击"查看备份"按钮  
**Then** 读取 Documents 目录  
**And** 列出所有备份文件  
**And** 按时间倒序排列  
**And** 显示文件名和创建时间  
**And** 显示文件大小

#### Scenario: 恢复备份数据
**Given** 用户在备份列表页面  
**When** 用户选择一个备份文件  
**And** 点击"恢复"按钮  
**Then** 显示确认对话框："恢复备份将覆盖当前数据，确定继续吗？"  
**When** 用户点击"确定"  
**Then** 读取备份文件内容  
**And** 解析 JSON 数据  
**And** 验证数据格式  
**And** 恢复到 LocalStorage  
**And** 刷新应用  
**And** 显示成功提示："数据已恢复"

#### Scenario: 删除备份文件
**Given** 用户在备份列表页面  
**When** 用户长按某个备份文件  
**And** 选择"删除"  
**Then** 显示确认对话框  
**When** 用户确认删除  
**Then** 从文件系统删除该文件  
**And** 从列表中移除  
**And** 显示成功提示

#### Scenario: 存储权限被拒绝
**Given** 用户点击"备份数据"  
**When** 系统请求存储权限  
**And** 用户拒绝授权  
**Then** 显示权限说明对话框  
**And** 提示需要存储权限才能备份  
**And** 提供"去设置"按钮

#### Scenario: 备份文件损坏
**Given** 用户选择恢复某个备份  
**When** 读取文件内容  
**And** JSON 解析失败  
**Then** 显示错误提示："备份文件已损坏，无法恢复"  
**And** 不修改当前数据

### Requirement: 应用生命周期管理
系统 SHALL 正确处理应用的生命周期事件。

#### Scenario: 应用进入后台
**Given** 应用正在运行  
**When** 用户按 Home 键或切换到其他应用  
**Then** 触发 `appStateChange` 事件  
**And** 自动保存当前编辑的数据  
**And** 暂停非必要的后台任务

#### Scenario: 应用返回前台
**Given** 应用在后台  
**When** 用户重新打开应用  
**Then** 触发 `appStateChange` 事件  
**And** 检查数据是否有变化  
**And** 刷新必要的数据  
**And** 恢复应用状态

#### Scenario: 应用被系统杀死
**Given** 应用在后台运行  
**When** 系统因内存不足杀死应用  
**Then** LocalStorage 数据保持不变  
**And** 下次启动时恢复到上次状态

### Requirement: 触觉反馈
系统 SHALL 在适当的交互中提供触觉反馈。

#### Scenario: 按钮点击反馈
**Given** 用户点击重要按钮（如提交订单）  
**When** 按钮被点击  
**Then** 触发轻微震动反馈  
**And** 震动时长约 10ms

#### Scenario: 操作成功反馈
**Given** 用户完成重要操作（如保存菜品）  
**When** 操作成功  
**Then** 触发成功震动模式  
**And** 配合成功提示显示

#### Scenario: 错误反馈
**Given** 用户操作失败（如表单验证失败）  
**When** 显示错误提示  
**Then** 触发错误震动模式  
**And** 震动模式与成功不同

### Requirement: 平台特性检测
系统 SHALL 提供平台特性检测功能。

#### Scenario: 检测是否为原生环境
**Given** 应用运行在任何环境  
**When** 调用 `Platform.isNative()`  
**Then** 在 Android 应用中返回 `true`  
**And** 在 Web 浏览器中返回 `false`

#### Scenario: 检测相机可用性
**Given** 应用需要使用相机  
**When** 调用 `Platform.hasCamera()`  
**Then** 在支持相机的设备上返回 `true`  
**And** 在不支持的设备上返回 `false`

#### Scenario: 条件渲染原生功能
**Given** 页面包含原生功能按钮  
**When** 在 Web 环境中渲染  
**Then** 显示 Web 版本的功能  
**And** 隐藏或禁用原生专属功能

**When** 在 Android 环境中渲染  
**Then** 显示原生版本的功能  
**And** 启用所有原生特性

## 数据模型

### 相机服务接口
```typescript
interface CameraService {
  takePicture(): Promise<string>;      // 返回 Base64 图片
  pickFromGallery(): Promise<string>;  // 返回 Base64 图片
}
```

### 文件系统服务接口
```typescript
interface FilesystemService {
  backupData(data: string): Promise<string>;        // 返回文件名
  restoreData(fileName: string): Promise<string>;   // 返回数据
  listBackups(): Promise<BackupFile[]>;             // 返回备份列表
  deleteBackup(fileName: string): Promise<void>;    // 删除备份
}

interface BackupFile {
  name: string;
  size: number;
  createdAt: number;
}
```

### 备份数据格式
```typescript
interface BackupData {
  version: string;           // 备份格式版本
  timestamp: number;         // 备份时间戳
  dishes: string;            // 菜品数据（JSON 字符串）
  orders: string;            // 订单数据
  favorites: string;         // 收藏数据
  statistics: string;        // 统计数据
}
```

## 权限配置

### AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                 android:maxSdkVersion="28" />
<uses-permission android:name="android.permission.VIBRATE" />
```

## 错误处理

### 相机错误
- **权限被拒绝**：提示用户并引导到设置
- **相机不可用**：显示友好错误信息
- **图片处理失败**：提示重试或选择其他图片

### 文件系统错误
- **权限被拒绝**：提示用户并引导到设置
- **存储空间不足**：提示清理空间
- **文件读写失败**：提示重试
- **备份文件损坏**：提示文件无效

## 验证规则

1. **图片大小**：压缩后 < 500KB
2. **图片尺寸**：800x800 像素（保持宽高比）
3. **备份文件大小**：< 10MB
4. **备份文件格式**：有效的 JSON
5. **权限请求**：必须在使用前请求

## 性能要求

- 相机启动时间：< 1 秒
- 图片压缩时间：< 2 秒
- 备份创建时间：< 3 秒
- 备份恢复时间：< 5 秒
- 文件列表加载：< 500ms
- 触觉反馈延迟：< 50ms
