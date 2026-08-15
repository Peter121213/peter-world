import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
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

/** 根据文件扩展名返回正确的 Content-Type */
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
    // 第一步：用 HeadObject 获取文件大小和元数据（比 Range: bytes=0-0 更可靠）
    let totalSize = 0
    let contentTypeFromR2 = ''
    try {
      const head = await r2Client.send(
        new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        })
      )
      totalSize = Number(head.ContentLength) || 0
      contentTypeFromR2 = head.ContentType || ''
    } catch (headErr) {
      // HeadObject 失败（比如 R2 权限问题），降级用 GetObject + Range 获取大小
      console.warn('HeadObject failed, fallback to GetObject:', headErr.message)
      try {
        const probe = await r2Client.send(
          new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Range: 'bytes=0-0',
          })
        )
        const contentRange = String(probe.ContentRange || '')
        const match = contentRange.match(/\/(\d+)$/)
        totalSize = match ? parseInt(match[1], 10) : Number(probe.ContentLength) || 0
        contentTypeFromR2 = probe.ContentType || ''
      } catch (probeErr) {
        console.error('Failed to get file size:', probeErr)
        return error(res, '获取文件信息失败', 500)
      }
    }

    // 根据扩展名强制设置 Content-Type（优先用扩展名，避免上传时 mimetype 错误）
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

    // 第二步：处理 Range 请求（音频/视频播放器依赖这个）
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

      // 流式输出，避免大文件占用过多内存
      const body = obj.Body
      if (body && typeof body.pipe === 'function') {
        await new Promise((resolve, reject) => {
          body.on('error', reject)
          body.on('end', resolve)
          body.pipe(res)
        })
      } else {
        const chunks = []
        for await (const chunk of body) {
          chunks.push(chunk)
        }
        res.end(Buffer.concat(chunks))
      }
      return
    }

    // 第三步：完整文件（无 Range 请求）
    const obj = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    )

    if (totalSize) {
      res.setHeader('Content-Length', String(totalSize))
    }

    // 流式输出
    const body = obj.Body
    if (body && typeof body.pipe === 'function') {
      await new Promise((resolve, reject) => {
        body.on('error', reject)
        body.on('end', resolve)
        body.pipe(res)
      })
    } else {
      const chunks = []
      for await (const chunk of body) {
        chunks.push(chunk)
      }
      res.end(Buffer.concat(chunks))
    }
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return error(res, '文件不存在', 404)
    }
    console.error('File access error:', err)
    return error(res, '访问文件失败', 500)
  }
})
