import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Dish, DishCategory } from '@/types'
import { compressImage, validateImageFile } from '@/utils/image'

const { TextArea } = Input
const { Option } = Select

interface DishFormProps {
  open: boolean
  dish?: Dish | null
  onSubmit: (values: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const categoryOptions = [
  { value: DishCategory.STAPLE, label: '主食' },
  { value: DishCategory.DISH, label: '菜品' },
  { value: DishCategory.SOUP, label: '汤品' },
  { value: DishCategory.DRINK, label: '饮料' },
  { value: DishCategory.DESSERT, label: '甜点' },
]

const DishForm = ({ open, dish, onSubmit, onCancel }: DishFormProps) => {
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (dish) {
      form.setFieldsValue({
        name: dish.name,
        category: dish.category,
        price: dish.price,
        description: dish.description,
      })
      setImageUrl(dish.image || '')
    } else {
      form.resetFields()
      setImageUrl('')
    }
  }, [dish, form])

  const handleImageUpload = async (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      message.error(validation.error)
      return false
    }

    setUploading(true)
    try {
      const compressedImage = await compressImage(file)
      setImageUrl(compressedImage)
      message.success('图片上传成功')
    } catch {
      message.error('图片处理失败，请重试')
    } finally {
      setUploading(false)
    }

    return false // 阻止默认上传行为
  }

  const handleRemoveImage = () => {
    setImageUrl('')
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onSubmit({
        ...values,
        image: imageUrl,
      })
      form.resetFields()
      setImageUrl('')
    } catch {
      // 表单验证失败，不需要处理
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setImageUrl('')
    onCancel()
  }

  return (
    <Modal
      title={dish ? '编辑菜品' : '添加菜品'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="name"
          label="菜品名称"
          rules={[
            { required: true, message: '请输入菜品名称' },
            { max: 50, message: '菜品名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入菜品名称" />
        </Form.Item>

        <Form.Item
          name="category"
          label="菜品分类"
          rules={[{ required: true, message: '请选择菜品分类' }]}
        >
          <Select placeholder="请选择菜品分类">
            {categoryOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="价格（元）"
          rules={[
            { required: true, message: '请输入价格' },
            { type: 'number', min: 0, message: '价格不能为负数' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入价格"
            precision={2}
            min={0}
            step={0.1}
          />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea
            rows={3}
            placeholder="请输入菜品描述（可选）"
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item label="菜品图片">
          {imageUrl ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={imageUrl}
                alt="菜品"
                style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8 }}
              />
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                style={{ position: 'absolute', top: 8, right: 8 }}
                onClick={handleRemoveImage}
              >
                删除
              </Button>
            </div>
          ) : (
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{uploading ? '上传中...' : '上传图片'}</div>
              </div>
            </Upload>
          )}
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            支持 JPG、PNG、GIF、WebP 格式，大小不超过 5MB
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DishForm
