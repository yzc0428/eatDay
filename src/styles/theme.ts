import { ThemeConfig } from 'antd'

// 温馨家居风格主题配置
export const theme: ThemeConfig = {
  token: {
    // 主色调 - 温暖的橙色
    colorPrimary: '#FF9966',
    // 成功色 - 清新的绿色
    colorSuccess: '#52c41a',
    // 警告色 - 明亮的黄色
    colorWarning: '#faad14',
    // 错误色 - 柔和的红色
    colorError: '#ff4d4f',
    // 信息色 - 柔和的蓝色
    colorInfo: '#1890ff',

    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontSize: 14,

    // 圆角
    borderRadius: 8,

    // 背景色
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',

    // 边框颜色
    colorBorder: '#d9d9d9',
  },
  components: {
    Layout: {
      headerBg: '#FF9966',
      headerColor: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f5f5f5',
    },
    Menu: {
      itemBg: '#ffffff',
      itemSelectedBg: '#fff7f0',
      itemSelectedColor: '#FF9966',
      itemHoverBg: '#fff7f0',
      itemHoverColor: '#FF9966',
    },
    Button: {
      primaryColor: '#ffffff',
      defaultBorderColor: '#d9d9d9',
      defaultColor: '#000000',
    },
    Card: {
      headerBg: '#fafafa',
    },
  },
}
