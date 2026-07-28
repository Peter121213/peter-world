import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MessageSquare,
  Send,
  Instagram,
  Twitter,
  Github,
  MessageCircle,
  CheckCircle,
} from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', message: '' })

    // 3秒后重置状态
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-blue-400' },
    { name: '微博', icon: MessageCircle, url: '#', color: 'hover:text-red-500' },
    { name: 'GitHub', icon: Github, url: '#', color: 'hover:text-gray-300' },
  ]

  return (
    <div className="pt-24 md:pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Contact
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">联系我</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            有任何问题、合作意向，或者只是想打个招呼？
            <br />
            欢迎随时联系我，我会尽快回复你。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-6">联系方式</h3>
              <div className="space-y-4">
                <a
                  href="mailto:hello@peter.world"
                  className="flex items-center space-x-4 p-4 bg-card/50 rounded-xl border border-white/10 hover:border-primary/50 transition-colors group"
                >
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">邮箱</div>
                    <div className="font-medium">hello@peter.world</div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">社交媒体</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`flex items-center justify-center space-x-2 p-4 bg-card/50 rounded-xl border border-white/10 hover:border-primary/50 transition-all ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="text-sm">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <h4 className="font-semibold mb-2">💡 小提示</h4>
              <p className="text-sm text-muted-foreground">
                如果你是通过作品找到我的，欢迎告诉我你最喜欢哪张照片，
                这会让我很开心的！
              </p>
            </div>
          </motion.div>

          {/* 联系表单 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-3"
          >
            <div className="bg-card/50 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">给我留言</h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">发送成功！</h4>
                  <p className="text-muted-foreground">
                    感谢你的留言，我会尽快回复你。
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        姓名
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="你的名字"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        邮箱
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      留言内容
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="想说点什么..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>发送中...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>发送留言</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
