export interface ImageProps {
  _id?: string,
  url?: string,
  createdAt?: string
  fitUrl?: string
}
export interface ResponseType<p = Record<string, null>> {//不同用到的数据里，data是不同格式的对象，因此这里用个泛型，每次都把p换掉就行
  //Record<string, never>` 是没有传p时的默认值
  code: number,
  msg: string,
  data: p
}
export interface ListDictType<P> {
  [id: string]: P;
}
export interface ListResponse<p> {
  count: number,
  pageSize: number,
  currentPage: number,
  list: p[]
}
export type ListResType<p = any> = ResponseType<ListResponse<p>>
export interface ColumnsRequset {
  pageSize?: number,
  currentPage?: number,
}