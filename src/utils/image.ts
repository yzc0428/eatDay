// 图片处理工具

// 压缩图片到指定尺寸
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 计算缩放比例
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法获取 canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // 转换为 Base64
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsDataURL(file)
  })
}

// 验证图片文件
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: '只支持 JPG、PNG、GIF、WebP 格式的图片' }
  }

  // 检查文件大小（最大 5MB）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: '图片大小不能超过 5MB' }
  }

  return { valid: true }
}
