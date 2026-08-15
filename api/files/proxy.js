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

/** 根据文件扩展名返回正确的 Content-Type（不依赖 R2 里存的元数据） */
function getContentTypeByExtension(key) {
  const ext = key.split('.').pop()?.toLowerCase() || ''
  const map = {
    // 音频
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
    aac: 'audio/aac',
    webm: 'audio/webm',
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    // 视频
    mp4: 'video/mp4',
  }
  return map[ext] || 'application/octet-stream'
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

    // 根据文件扩展名强制设置正确的 Content-Type（修复某些文件上传时 mimetype 识别错误的问题）
    const contentType = getContentTypeByExtension(key)
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
