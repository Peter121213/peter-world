import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Camera, Music, MapPin, Calendar, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { settingsApi } from '@/lib/api'
import type { SiteSettings } from '@/types'

const About = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await settingsApi.get()
      const s: any = res.settings
      setSettings({
        siteName: s.site_name || 'Peter 的小世界',
        siteDescription: s.site_description || '',
        heroTitle: s.hero_title || '',
        heroSubtitle: s.hero_subtitle || '',
        heroImage: s.hero_image || '',
        aboutTitle: s.about_title || '关于我',
        aboutContent: s.about_content || '',
        aboutImage: s.about_image || '',
        aboutPageImage: s.about_page_image || 'https://picsum.photos/seed/aboutme/600/750',
        musicSectionTitle: s.music_section_title || '',
        musicSectionDescription: s.music_section_description || '',
        socialLinks: {
          weibo: s.social_weibo || '',
          instagram: s.social_instagram || '',
          x: s.social_x || '',
          github: s.social_github || '',
          email: s.contact_email || '',
        },
      })
    } catch (error) {
      console.error('获取设置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const skills = [
    { name: '人像摄影', level: 90 },
    { name: '风景摄影', level: 85 },
    { name: '街头摄影', level: 80 },
    { name: '后期处理', level: 75 },
  ]

  const timeline = [
    {
      year: '2020',
      title: '开始摄影之旅',
      description: '拿起第一台相机，开始记录生活中的美好瞬间。',
    },
    {
      year: '2021',
      title: '第一次展览',
      description: '作品首次在本地摄影展中展出，获得了很多鼓励。',
    },
    {
      year: '2022',
      title: '专注人像摄影',
      description: '开始深入研究人像摄影，形成自己的风格。',
    },
    {
      year: '2023',
      title: '创建个人网站',
      description: '搭建了这个小世界，分享我的作品和心情。',
    },
    {
      year: '2024',
      title: '继续前行',
      description: '保持热爱，继续用镜头记录更多美好。',
    },
  ]

  const equipment = [
    'Sony A7M4',
    'Sony 35mm f/1.4 GM',
    'Sony 85mm f/1.4 GM',
    'Sony 16-35mm f/2.8 GM',
    'Lightroom Classic',
    'Photoshop',
  ]

  const aboutTitle = settings?.aboutTitle || '关于我'
  const aboutContent = (settings?.aboutContent || '你好，我是 Peter，一个热爱摄影和音乐的普通人。').replace(/\\n/g, '\n')
  const aboutPageImage = settings?.aboutPageImage || 'https://picsum.photos/seed/aboutme/600/750'

  if (loading) {
    return (
      <div className="pt-24 md:pt-28 pb-20 px-4">
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 md:pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <User className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              About Me
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{aboutTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            一个热爱摄影和音乐的普通人，
            <br />
            用镜头和旋律记录生活中的美好。
          </p>
        </motion.div>

        {/* 个人介绍 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={aboutPageImage}
                alt="Peter"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">你好，我是 Peter 👋</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {aboutContent.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>中国 · 成都</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span>摄影 4 年</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Heart className="w-5 h-5 text-primary" />
                <span>热爱生活</span>
              </div>
            </div>

            <Link to="/contact" className="btn-primary inline-flex items-center space-x-2 mt-8">
              <span>联系我</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* 技能水平 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">技能水平</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 时间线 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold mb-12 text-center">我的历程</h2>
          <div className="relative max-w-2xl mx-auto">
            {/* 时间线 */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 transform md:-translate-x-1/2" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* 圆点 */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 z-10 shadow-lg shadow-primary/50" />

                {/* 内容 */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  }`}
                >
                  <div className="bg-card/50 rounded-xl p-6 border border-white/10">
                    <div className="text-primary font-bold text-lg mb-2">{item.year}</div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 使用设备 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-8">我的装备</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {equipment.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-6 py-3 bg-card/50 rounded-full border border-white/10 text-sm"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
