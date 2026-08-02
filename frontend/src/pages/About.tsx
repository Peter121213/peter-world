import { motion } from 'framer-motion'
import { User, MapPin, Heart, Dumbbell, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSettings } from '@/contexts/SettingsContext'

const About = () => {
  const { settings } = useSettings()

  const fitnessTags = [
    settings?.fitnessTag1 || '健身 5 年+',
    settings?.fitnessTag2 || '瘦掉 25kg 肉',
    settings?.fitnessTag3 || '减肥一只在路上之人',
    settings?.fitnessTag4 || '永远练不起来之人',
    settings?.fitnessTag5 || '有氧爱好者',
  ]

  const hobbies = [
    settings?.hobby1 || '音乐',
    settings?.hobby2 || '电影',
    settings?.hobby3 || '游戏',
    settings?.hobby4 || '美食',
    settings?.hobby5 || '旅行',
    settings?.hobby6 || '健身',
  ]

  const aboutTitle = settings?.aboutTitle || '关于我'
  const aboutContent = (settings?.aboutContent || '你好，我是 Peter，一个普通人。').replace(/\\n/g, '\n')
  const aboutPageImage = settings?.aboutPageImage || ''

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
            <User className="w-5 h-5 text-accent mr-2" />
            <span className="text-accent text-sm font-medium tracking-wider uppercase">
              {settings?.aboutBadge || 'About Me'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{aboutTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto whitespace-pre-line">
            {settings?.aboutPageDesc || '一个普通的打工人，\n在这里记录我的生活和一些碎碎念'}
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
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-card/50">
              {aboutPageImage && (
                <motion.img
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  src={aboutPageImage}
                  alt="Peter"
                  className="w-full h-full object-cover"
                />
              )}
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
                <span>{settings?.aboutLocation || '中国 · 成都'}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Heart className="w-5 h-5 text-primary" />
                <span>{settings?.aboutLove || '热爱生活'}</span>
              </div>
            </div>

            <Link to="/contact" className="btn-primary inline-flex items-center space-x-2 mt-8">
              <span>{settings?.aboutButton || '联系我'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* 健身板块 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Dumbbell className="w-5 h-5 text-accent mr-2" />
                <span className="text-accent text-sm font-medium tracking-wider uppercase">
                  {settings?.fitnessBadge || 'Fitness'}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">{settings?.fitnessTitle || '关于健身'}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
                {settings?.fitnessDesc || '健身 5 年多了，从一个胖子慢慢瘦了下来。\n虽然现在练得还是不怎么样，但是一直在坚持的路上～'}
              </p>
            </div>

            {/* 健身标签 */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {fitnessTags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* 健身照片区域（预留位置） */}
            <div className="bg-card/30 rounded-2xl p-8 border border-white/10 border-dashed text-center">
              <Dumbbell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {settings?.fitnessPhotosPlaceholder || '健身照片区域（以后可以在这里放健身照片）'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 兴趣爱好 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-8">{settings?.hobbiesTitle || '兴趣爱好'}</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {hobbies.map((hobby, index) => (
              <motion.div
                key={hobby}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-6 py-3 bg-card/50 rounded-full border border-white/10 text-sm"
              >
                {hobby}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
