import { useParams, useNavigate } from 'react-router-dom'
import './ArticleDetail.css'

const articles = [
  { id: 1, category: 'Cycle Health', categoryColor: '#C2527A', emoji: '🩸', title: 'Understanding Your Menstrual Cycle', subtitle: 'A complete guide to the 4 phases of your cycle', readTime: '5 min read', tags: ['Beginner', 'Cycle basics'], content: `Your menstrual cycle is a monthly process your body goes through to prepare for a possible pregnancy. Understanding it helps you know what to expect physically and emotionally throughout the month.\n\n## The 4 Phases\n\n### 1. Menstrual Phase (Days 1–5)\nThis is when your period happens. The uterine lining sheds because no pregnancy occurred. You may feel cramps, fatigue, and lower back pain. This is completely normal.\n\n**What helps:**\n- Rest and light movement like walking or yoga\n- Iron-rich foods like spinach, lentils, and red meat\n- A hot water bottle for cramps\n- Staying hydrated\n\n### 2. Follicular Phase (Days 1–13)\nThis phase overlaps with menstruation and continues after. Your body produces estrogen which causes the uterine lining to thicken. You begin to feel more energetic and positive.\n\n**What helps:**\n- Start new projects — your brain is sharp\n- Try new workouts — strength training works well\n- Eat fresh vegetables and lean proteins\n\n### 3. Ovulation Phase (Day 14)\nYour body releases an egg. This is your most fertile day. You may notice clear stretchy discharge, a slight temperature rise, and feel very social and confident.\n\n### 4. Luteal Phase (Days 15–28)\nAfter ovulation, progesterone rises then falls if no pregnancy occurs. This is when PMS symptoms appear.\n\n**What helps:**\n- Reduce caffeine and salt\n- Eat magnesium-rich foods like dark chocolate and nuts\n- Prioritise sleep\n- Journal your feelings\n\n## When to See a Doctor\nSee a gynaecologist if you experience periods lasting longer than 7 days, very heavy bleeding, severe cramps that disrupt daily life, or irregular cycles.` },
  { id: 2, category: 'PCOS', categoryColor: '#7C3AED', emoji: '🔵', title: 'PCOS — What Every Woman Should Know', subtitle: 'Symptoms, diagnosis, and managing PCOS in Kenya', readTime: '7 min read', tags: ['PCOS', 'Hormones'], content: `Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders affecting women of reproductive age. In Kenya, it is estimated to affect 1 in 10 women.\n\n## What is PCOS?\nPCOS is a condition where the ovaries produce excess male hormones (androgens), leading to irregular periods, cysts on the ovaries, and other symptoms.\n\n## Common Symptoms\n- Irregular periods — cycles longer than 35 days\n- Excess hair growth on face, chest, or back\n- Acne particularly on the jawline\n- Weight gain especially around the abdomen\n- Thinning hair on the scalp\n- Difficulty getting pregnant\n\n## Managing PCOS Naturally\n\n### Diet\n- Reduce refined carbohydrates\n- Eat more fibre — vegetables, legumes, whole grains\n- Eat protein at every meal\n\n### Exercise\n- Aim for 30 minutes of moderate exercise 5 days a week\n- Strength training helps improve insulin sensitivity\n\n## Getting Help in Kenya\nYou can seek PCOS diagnosis and treatment at Kenyatta National Hospital, Aga Khan University Hospital, MP Shah Hospital, or most county referral hospitals.` },
  { id: 3, category: 'Fertility', categoryColor: '#10B981', emoji: '🌱', title: 'How to Track Your Fertile Window', subtitle: 'Natural methods to identify your most fertile days', readTime: '4 min read', tags: ['Fertility', 'Ovulation'], content: `Whether you are trying to get pregnant or avoid pregnancy naturally, understanding your fertile window is essential.\n\n## What is the Fertile Window?\nThe fertile window spans 6 days — the 5 days before ovulation and the day of ovulation itself. Sperm can survive inside the body for up to 5 days.\n\n## Method 1 — Calendar Tracking\nCount the days of your cycle. If your cycle is 28 days, ovulation typically occurs on day 14 and your fertile window is days 9–15.\n\n## Method 2 — Cervical Mucus Tracking\nWatch for changes in your vaginal discharge. Peak fertility is when mucus is clear and stretchy like egg whites.\n\n## Method 3 — Basal Body Temperature (BBT)\nTake your temperature every morning before getting out of bed. After ovulation your temperature rises by 0.2–0.5°C.\n\n## Method 4 — Ovulation Test Strips\nThese test kits detect the LH hormone surge that happens 24–36 hours before ovulation. Available at Nairobi pharmacies for KSh 200–500.` },
  { id: 4, category: 'Nutrition', categoryColor: '#F59E0B', emoji: '🥗', title: 'Eating for Your Cycle — A Kenyan Food Guide', subtitle: 'Local foods that support each phase of your cycle', readTime: '6 min read', tags: ['Nutrition', 'Kenyan foods'], content: `Your nutritional needs change throughout your menstrual cycle.\n\n## Menstrual Phase — Replenish Iron\n- Terere (amaranth leaves) — rich in iron and folate\n- Kunde (cowpeas) — excellent plant-based iron\n- Nyama choma — good source of haem iron\n- Liver — one of the richest sources of iron\n\n## Follicular Phase — Support Rising Estrogen\n- Eggs — complete protein for follicle development\n- Fish — tilapia, omena — omega-3 rich\n- Avocado — healthy fats support hormone production\n- Githeri — maize and beans combination\n\n## Ovulation Phase — Anti-inflammatory Foods\n- Omena (dagaa) — high in omega-3s\n- Turmeric — powerful anti-inflammatory\n- Ginger — great in tea\n- Fresh kachumbari\n\n## Luteal Phase — Reduce PMS\n- Sweet potatoes — complex carbs reduce cravings\n- Bananas — magnesium and potassium\n- Groundnuts — magnesium-rich\n- Dark chocolate — in moderation\n- Herbal teas — chamomile, ginger, peppermint` },
  { id: 5, category: 'Mental Health', categoryColor: '#EC4899', emoji: '🧠', title: 'PMS vs PMDD — Know the Difference', subtitle: 'When period mood changes become more serious', readTime: '5 min read', tags: ['Mental health', 'PMS', 'PMDD'], content: `Most women experience some emotional changes before their period. But for some these changes are severe enough to disrupt daily life — a condition called PMDD.\n\n## What is PMS?\nPremenstrual Syndrome affects up to 75% of women. Symptoms appear in the week before your period and disappear when it starts.\n\n## What is PMDD?\nPremenstrual Dysphoric Disorder is a severe form of PMS that significantly interferes with daily life. It affects about 3–8% of women.\n\n**PMDD symptoms:**\n- Intense depression or hopelessness\n- Severe anxiety or panic attacks\n- Extreme mood swings\n- Anger or irritability that feels uncontrollable\n- Difficulty concentrating\n\n## When to Seek Help\nSee a doctor if symptoms severely affect your relationships or work, you feel hopeless, or symptoms do not improve with lifestyle changes.\n\nRemember: PMDD is a recognised medical condition, not a character flaw. It is treatable.` },
  { id: 6, category: 'Endometriosis', categoryColor: '#F97316', emoji: '🟠', title: 'Endometriosis — The Silent Condition', subtitle: 'Understanding a condition that affects 1 in 10 women', readTime: '6 min read', tags: ['Endometriosis', 'Pain'], content: `Endometriosis is a condition where tissue similar to the uterine lining grows outside the uterus. It affects roughly 10% of women worldwide.\n\n## Common Symptoms\n- Painful periods — worse than typical cramps\n- Pelvic pain throughout the month\n- Painful intercourse\n- Heavy bleeding\n- Fatigue\n- Infertility\n\n## Diagnosis\nThe only definitive diagnosis is through laparoscopy — a minor surgical procedure.\n\n## Treatment Options\n\n### Pain Management\n- NSAIDs like ibuprofen\n- Heat therapy\n- Physiotherapy\n\n### Hormonal Treatments\n- Combined oral contraceptive pill\n- Progesterone-only pill\n\n## Getting Help in Kenya\n- Kenyatta National Hospital\n- Aga Khan University Hospital\n- Nairobi Hospital\n- MP Shah Hospital\n\nAsk specifically for a gynaecologist with experience in endometriosis.` },
]

const renderContent = (content) => {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i} className="article-h2">{line.replace('## ', '')}</h2>
    }
    if (line.startsWith('### ')) {
      return <h3 key={i} className="article-h3">{line.replace('### ', '')}</h3>
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="article-li">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="article-bold">{line.replace(/\*\*/g, '')}</p>
    }
    if (line.trim() === '') {
      return <div key={i} className="article-spacer" />
    }
    return <p key={i} className="article-p">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
  })
}

const ArticleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const article = articles.find(a => a.id === parseInt(id))

  if (!article) {
    return (
      <div className="article-detail-screen">
        <button className="article-back" onClick={() => navigate('/articles')}>
          ← Back
        </button>
        <p>Article not found.</p>
      </div>
    )
  }

  return (
    <div className="article-detail-screen">

      {/* Back button */}
      <button className="article-back" onClick={() => navigate('/articles')}>
        ← Back to articles
      </button>

      {/* Hero */}
      <div
        className="article-hero"
        style={{ background: article.categoryColor + '15' }}
      >
        <span className="article-hero-emoji">{article.emoji}</span>
        <span
          className="article-hero-category"
          style={{ color: article.categoryColor }}
        >
          {article.category}
        </span>
        <h1 className="article-hero-title">{article.title}</h1>
        <p className="article-hero-subtitle">{article.subtitle}</p>
        <div className="article-hero-meta">
          <span className="article-read-time">⏱ {article.readTime}</span>
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="article-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="article-content">
        {renderContent(article.content)}
      </div>

      {/* Disclaimer */}
      <div className="article-disclaimer">
        ⚕️ This article is for educational purposes only. Please consult
        a qualified healthcare provider for medical advice.
      </div>

      {/* Related articles */}
      <div className="related-section">
        <p className="related-title">More articles</p>
        <div className="related-list">
          {articles
            .filter(a => a.id !== article.id)
            .slice(0, 3)
            .map(a => (
              <div
                key={a.id}
                className="related-card"
                onClick={() => navigate(`/articles/${a.id}`)}
              >
                <span className="related-emoji">{a.emoji}</span>
                <div className="related-info">
                  <p className="related-article-title">{a.title}</p>
                  <p className="related-read-time">⏱ {a.readTime}</p>
                </div>
                <span className="related-arrow">›</span>
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}

export default ArticleDetail