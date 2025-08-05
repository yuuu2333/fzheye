import type { ImageProps } from '@/store/utils'
import type { UserProps } from '@/store/user'
import type { ColumnProps } from '@/store/column'
import columnImg from '@/assets/column.jpg';
import avatarImg from '@/assets/avatar.jpg';

//验证图像是否符合要求
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'format' | 'size' | 'null'

export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = 'null'
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    error,
    passed: isValidFormat && isValidSize
  }
}
//生成适配尺寸的图片 URL
//设置的是 fitUrl 属性，而不是直接修改 url原始的 url 属性保持不变，避免了重复进入同一页面重复拼接的问题
export function generateFitUrl(data: ImageProps, width: number, height: number) {
  if (data && data.url) {
    data.fitUrl = data.url + `?x-oss-process=image/resize,m_pad,h_${height},w_${width}`
  }
}
//为专栏 / 用户数据添加头像（含默认兜底）
export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    //判断是用户数据还是专栏数据，只有专栏数据有title
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: parseCol.title ? columnImg : avatarImg
    }
  }
}
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T }
  )
}
export const objToArr = <T>(obj: { [key:string]:T}) => {
  return Object.keys(obj).map(key => obj[key])
}
