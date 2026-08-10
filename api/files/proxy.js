import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, BUCKET_NAME } from '../_lib/r2'
import { apiHandler, error } from '../_lib/response'

export const config = {
  api: {
    responseLimit: false,
  },
}

function parseRange(rangeHeader, size) {
  if (!rangeHeader || !rangeHeader.startsWith('bytes=')) return null
  const [startStr, endStr] = rangeHeader.replace(/bytes=/, '').split('-')
  let start = parseInt(startStr, 10)
  let end = endStr ? parseInt(endStr, 10) : size - 1
  if (Number.isNaN(start)) start = 0
  if (Number.isNaN(end) || end >= size) end = size - 1
  if (start < 0 || start > end || start >= size) return null
  return { start, end }
}

export default apiHandler(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return error(res, '方法不允许', 405)
  }

  const fileParam = req.query.file
  const key = Array.isArray(fileParam) ? fileParam.join('/') : fileParam

  if (!key) {
    return error(res, '文件路径不能为空', 400)
  }

  try {
    // 先取元数据，支持 Range（音频播放器依赖）
    const head = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Range: 'bytes=0-0',
      })
    )

    // Content-Range: bytes 0-0/12345
    const totalMatch = String(head.ContentRange || '').match(/\/(\d+)$/)
    const totalSize = totalMatch
      ? parseInt(totalMatch[1], 10)
      : Number(head.ContentLength || 0)

    const contentType = head.ContentType || 'application/octet-stream'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length')

    if (req.method === 'HEAD') {
      if (totalSize) res.setHeader('Content-Length', String(totalSize))
      return res.status(200).end()
    }

    const range = parseRange(req.headers.range, totalSize)

    if (range && totalSize > 0) {
      const { start, end } = range
      const chunkSize = end - start + 1
      const obj = await r2Client.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Range: `bytes=${start}-${end}`,
        })
      )

      res.statusCode = 206
      res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`)
      res.setHeader('Content-Length', String(chunkSize))

      const chunks = []
      for await (const chunk of obj.Body) {
        chunks.push(chunk)
      }
      return res.end(Buffer.concat(chunks))
    }

    // 完整文件
    const obj = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    )

    if (totalSize) {
      res.setHeader('Content-Length', String(totalSize))
    }

    const chunks = []
    for await (const chunk of obj.Body) {
      chunks.push(chunk)
    }
    return res.status(200).end(Buffer.concat(chunks))
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return error(res, '文件不存在', 404)
    }
    console.error('File access error:', err)
    return error(res, '访问文件失败', 500)
  }
})
