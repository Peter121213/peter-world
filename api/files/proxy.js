import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, BUCKET_NAME } from '../_lib/r2'
import { apiHandler, error } from '../_lib/response'

export const config = {
  api: {
    responseLimit: false, // 不限制响应大小（用于大文件）
  },
}

export default apiHandler(async (req, res) => {
  if (req.method !== 'GET') {
    return error(res, '方法不允许', 405)
  }

  const fileParam = req.query.file
  const key = Array.isArray(fileParam) ? fileParam.join('/') : fileParam

  if (!key) {
    return error(res, '文件路径不能为空', 400)
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await r2Client.send(command)

    // 设置 Content-Type
    if (response.ContentType) {
      res.setHeader('Content-Type', response.ContentType)
    }

    // 设置缓存
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    // 把文件流传给客户端
    const chunks = []
    for await (const chunk of response.Body) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    res.status(200).send(buffer)
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return error(res, '文件不存在', 404)
    }
    console.error('File access error:', err)
    return error(res, '访问文件失败', 500)
  }
})
