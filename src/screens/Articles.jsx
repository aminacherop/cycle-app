import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Articles.css'

const articles = [
  {
    id: 1,
    category: 'Cycle Health',
    categoryColor: '#C2527A',
    emoji: '🩸',
    title: 'Understanding Your Menstrual Cycle',
    subtitle: 'A complete guide to the 4 phases of your cycle',
    readTime: '5 min read',
    featured: true,
    tags: ['Beginner', 'Cycle basics'],
    content: `
Your menstrual cycle is a monthly process your body goes through to prepare for a possible pregnancy. Understanding it helps you know what to expect physically and emotionally throughout the month.

## The 4 Phases

### 1. Menstrual Phase (Days 1–5)
This is when your period happens. The uterine lining sheds because no pregnancy occurred. You may feel cramps, fatigue, and lower back pain. This is completely normal.

**What helps:**
- Rest and light movement like walking or yoga
- Iron-rich foods like spinach, lentils, and red meat
- A hot water bottle for cramps
- Staying hydrated

### 2. Follicular Phase (Days 1–13)
This phase overlaps with menstruation and continues after. Your body produces estrogen which causes the uterine lining to thicken. You begin to feel more energetic and positive.

**What helps:**
- Start new projects — your brain is sharp
- Try new workouts — strength training works well
- Eat fresh vegetables and lean proteins

### 3. Ovulation Phase (Day 14)
Your body releases an egg. This is your most fertile day. You may notice clear, stretchy discharge (like egg whites), a slight temperature rise, and feel very social and confident.

**Signs of ovulation:**
- Egg-white cervical mucus
- Slight pelvic pain on one side
- Higher sex drive
- Increased energy

### 4. Luteal Phase (Days 15–28)
After ovulation, progesterone rises then falls if no pregnancy occurs. This is when PMS symptoms appear — bloating, mood changes, cravings, and breast tenderness.

**What helps:**
- Reduce caffeine and salt to decrease bloating
- Eat magnesium-rich foods like dark chocolate and nuts
- Prioritise sleep
- Journal your feelings

## When to See a Doctor

See a gynaecologist if you experience:
- Periods lasting longer than 7 days
- Very heavy bleeding (soaking a pad every hour)
- Severe cramps that disrupt daily life
- Irregular cycles (less than 21 or more than 35 days)
- No period for 3+ months (if not pregnant)
    `,
  },
  {
    id: 2,
    category: 'PCOS',
    categoryColor: '#7C3AED',
    emoji: '🔵',
    title: 'PCOS — What Every Woman Should Know',
    subtitle: 'Symptoms, diagnosis, and managing PCOS in Kenya',
    readTime: '7 min read',
    featured: true,
    tags: ['PCOS', 'Hormones'],
    content: `
Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders affecting women of reproductive age. In Kenya, it is estimated to affect 1 in 10 women, yet many go undiagnosed for years.

## What is PCOS?

PCOS is a condition where the ovaries produce excess male hormones (androgens), leading to irregular periods, cysts on the ovaries, and other symptoms.

## Common Symptoms

- **Irregular periods** — cycles longer than 35 days or fewer than 8 per year
- **Excess hair growth** — on face, chest, or back (hirsutism)
- **Acne** — particularly on the jawline and chin
- **Weight gain** — especially around the abdomen
- **Thinning hair** — on the scalp
- **Darkening of skin** — in neck creases or armpits
- **Difficulty getting pregnant** — due to irregular ovulation

## Diagnosis

There is no single test for PCOS. Your doctor will typically:
1. Review your symptoms and medical history
2. Do a blood test for hormone levels
3. Order an ultrasound to check your ovaries
4. Test blood sugar and insulin levels

## Managing PCOS Naturally

### Diet
- Reduce refined carbohydrates (white bread, sugar, sodas)
- Eat more fibre — vegetables, legumes, whole grains
- Eat protein at every meal
- Avoid processed foods

### Exercise
- Aim for 30 minutes of moderate exercise 5 days a week
- Strength training helps improve insulin sensitivity
- Walking is highly effective and accessible

### Stress Management
High cortisol worsens PCOS. Try:
- Daily walks in nature
- Deep breathing exercises
- Adequate sleep (7–9 hours)

## Medical Treatments

- **Hormonal birth control** — regulates periods and reduces androgens
- **Metformin** — improves insulin sensitivity
- **Clomiphene** — stimulates ovulation for those trying to conceive
- **Spironolactone** — reduces excess hair and acne

## Getting Help in Kenya

You can seek PCOS diagnosis and treatment at:
- Kenyatta National Hospital (Nairobi)
- Aga Khan University Hospital
- MP Shah Hospital
- Most county referral hospitals

Always consult a gynaecologist for proper diagnosis.
    `,
  },
  {
    id: 3,
    category: 'Fertility',
    categoryColor: '#10B981',
    emoji: '🌱',
    title: 'How to Track Your Fertile Window',
    subtitle: 'Natural methods to identify your most fertile days',
    readTime: '4 min read',
    featured: false,
    tags: ['Fertility', 'Ovulation'],
    content: `
Whether you are trying to get pregnant or trying to avoid pregnancy naturally, understanding your fertile window is essential.

## What is the Fertile Window?

The fertile window is the period during your cycle when pregnancy is possible. It typically spans 6 days — the 5 days before ovulation and the day of ovulation itself.

Sperm can survive inside the body for up to 5 days, which is why the days before ovulation matter.

## Method 1 — Calendar Tracking

Count the days of your cycle. If your cycle is 28 days:
- Ovulation typically occurs on day 14
- Fertile window: days 9–15

For a 26-day cycle:
- Ovulation: day 12
- Fertile window: days 7–13

**Limitation:** This method is less reliable for irregular cycles.

## Method 2 — Cervical Mucus Tracking

Watch for changes in your vaginal discharge:

| Phase | Mucus appearance |
|-------|-----------------|
| After period | Dry, little discharge |
| Approaching fertile window | White, sticky, cloudy |
| Fertile window | Clear, stretchy, like egg whites |
| After ovulation | Thick, creamy or dry |

Peak fertility is when mucus is clear and stretchy like egg whites.

## Method 3 — Basal Body Temperature (BBT)

Take your temperature every morning before getting out of bed. After ovulation, your temperature rises by 0.2–0.5°C and stays elevated.

**You will need:** A basal thermometer (available at Nairobi pharmacies for KSh 500–800)

## Method 4 — Ovulation Test Strips

These test kits detect the LH hormone surge that happens 24–36 hours before ovulation.

Available at Nairobi pharmacies for KSh 200–500 per kit.

**How to use:**
1. Test from day 10 of your cycle
2. Test at the same time daily (afternoon is best)
3. A positive result means ovulation within 24–36 hours

## Using CycleApp for Fertility Tracking

Log your cervical mucus, ovulation test results, and BBT in the Log Today screen. CycleApp will calculate your fertile window based on your personal cycle data.
    `,
  },
  {
    id: 4,
    category: 'Nutrition',
    categoryColor: '#F59E0B',
    emoji: '🥗',
    title: 'Eating for Your Cycle — A Kenyan Food Guide',
    subtitle: 'Local foods that support each phase of your cycle',
    readTime: '6 min read',
    featured: false,
    tags: ['Nutrition', 'Kenyan foods'],
    content: `
Your nutritional needs change throughout your menstrual cycle. Here is how to eat well using affordable, locally available Kenyan foods.

## Menstrual Phase — Replenish Iron

During your period, you lose blood and iron. Focus on replenishing:

**Best Kenyan foods:**
- **Terere (amaranth leaves)** — rich in iron and folate
- **Kunde (cowpeas)** — excellent plant-based iron
- **Nyama choma (grilled meat)** — good source of haem iron
- **Liver** — one of the richest sources of iron
- **Mukimo** — potatoes and greens combined
- **Black tea** — avoid during meals as it blocks iron absorption

**Tip:** Eat vitamin C foods alongside iron sources to improve absorption. Try squeezing lemon juice on your sukuma wiki.

## Follicular Phase — Support Rising Estrogen

Your body needs nutrients to support the growing follicle:

**Best Kenyan foods:**
- **Eggs** — complete protein for follicle development
- **Fish** — tilapia, omena — omega-3 rich
- **Avocado** — healthy fats support hormone production
- **Githeri** — maize and beans combination provides complete protein
- **Fresh fruits** — mangoes, pawpaw, passion fruit for antioxidants

## Ovulation Phase — Anti-inflammatory Foods

Keep inflammation low during peak fertility:

**Best Kenyan foods:**
- **Omena (dagaa)** — high in omega-3s, anti-inflammatory
- **Turmeric** — add to tea or food, powerful anti-inflammatory
- **Ginger** — great in tea, reduces inflammation
- **Fresh vegetables** — kachumbari (raw tomatoes and onions)
- **Watermelon** — hydrating and antioxidant-rich

## Luteal Phase — Reduce PMS

Support progesterone and reduce bloating and mood swings:

**Best Kenyan foods:**
- **Sweet potatoes** — complex carbs reduce cravings
- **Bananas** — magnesium and potassium reduce bloating
- **Groundnuts (peanuts)** — magnesium-rich, reduces PMS
- **Dark chocolate** — in moderation, magnesium and mood booster
- **Herbal teas** — chamomile, ginger, peppermint ease cramps

## Foods to Limit Throughout Your Cycle

- **Excess salt** — worsens bloating
- **Caffeine** — disrupts sleep and worsens PMS
- **Alcohol** — disrupts hormone balance
- **Processed foods** — high in sugar, worsens inflammation
- **Soda** — depletes magnesium

## Simple Kenyan Meal Plan for Your Cycle

**Period week:** Liver and ugali, terere stew, kunde soup
**Follicular week:** Eggs and avocado, githeri, fish
**Ovulation week:** Omena, fresh salads, fruits
**Luteal week:** Sweet potatoes, groundnuts, herbal tea
    `,
  },
  {
    id: 5,
    category: 'Mental Health',
    categoryColor: '#EC4899',
    emoji: '🧠',
    title: 'PMS vs PMDD — Know the Difference',
    subtitle: 'When period mood changes become more serious',
    readTime: '5 min read',
    featured: false,
    tags: ['Mental health', 'PMS', 'PMDD'],
    content: `
Most women experience some emotional changes before their period. But for some, these changes are severe enough to disrupt daily life — a condition called PMDD.

## What is PMS?

Premenstrual Syndrome (PMS) affects up to 75% of women. Symptoms appear in the week before your period and disappear when it starts.

**Common PMS symptoms:**
- Mood swings
- Irritability
- Bloating
- Breast tenderness
- Fatigue
- Food cravings
- Mild anxiety or sadness

These symptoms are uncomfortable but manageable.

## What is PMDD?

Premenstrual Dysphoric Disorder (PMDD) is a severe form of PMS that significantly interferes with daily life. It affects about 3–8% of women.

**PMDD symptoms are more severe:**
- Intense depression or hopelessness
- Severe anxiety or panic attacks
- Extreme mood swings that affect relationships
- Anger or irritability that feels uncontrollable
- Difficulty concentrating
- Withdrawal from social activities
- Physical symptoms like severe cramps and headaches

**The key difference:** PMS is uncomfortable. PMDD is disabling.

## Managing PMS Naturally

**Lifestyle changes:**
- Regular exercise — 30 minutes daily
- Reduce caffeine and alcohol
- Eat regular meals to stabilise blood sugar
- Sleep 7–9 hours nightly
- Practice stress management

**Supplements that may help:**
- Magnesium — reduces bloating and mood swings
- Vitamin B6 — supports serotonin production
- Calcium — reduces PMS symptoms
- Evening primrose oil — for breast tenderness

## When to Seek Help

See a doctor if:
- Symptoms severely affect your relationships or work
- You feel hopeless or have thoughts of self-harm
- Symptoms do not improve with lifestyle changes
- You think you may have PMDD

**Remember:** PMDD is a recognised medical condition, not a character flaw. It is treatable with therapy, medication, and lifestyle changes.

If you are struggling emotionally, please reach out to a trusted person or healthcare provider.
    `,
  },
  {
    id: 6,
    category: 'Endometriosis',
    categoryColor: '#F97316',
    emoji: '🟠',
    title: 'Endometriosis — The Silent Condition',
    subtitle: 'Understanding a condition that affects 1 in 10 women',
    readTime: '6 min read',
    featured: false,
    tags: ['Endometriosis', 'Pain'],
    content: `
Endometriosis is a condition where tissue similar to the uterine lining grows outside the uterus — on the ovaries, fallopian tubes, or other organs. It affects roughly 10% of women worldwide.

## Why it Often Goes Undiagnosed

The average time to diagnosis is 7–10 years. Many women are told their pain is normal or "in their head." It is not.

In Kenya, awareness of endometriosis is still very low, and access to specialist care can be limited. However, diagnosis and treatment are available.

## Common Symptoms

- **Painful periods** — pain that is worse than typical cramps and may not respond to painkillers
- **Pelvic pain** — throughout the month, not just during periods
- **Painful intercourse**
- **Painful bowel movements or urination** during periods
- **Heavy bleeding** or spotting between periods
- **Infertility** — endometriosis is found in 20–50% of women with fertility problems
- **Fatigue** — especially during periods

## What Endometriosis is NOT

- It is not caused by anything you did
- It is not an infection
- It is not always visible on an ultrasound
- It cannot be confirmed by symptoms alone — laparoscopy is needed

## Diagnosis

The only definitive diagnosis is through laparoscopy — a minor surgical procedure where a camera is inserted to view the pelvic organs.

## Treatment Options

### Pain Management
- NSAIDs like ibuprofen (take before pain starts)
- Heat therapy
- Physiotherapy

### Hormonal Treatments
- Combined oral contraceptive pill
- Progesterone-only pill
- GnRH analogues (prescribed by specialist)

### Surgery
- Laparoscopic excision — removes endometriosis tissue
- Most effective treatment for severe cases

## Getting Help in Kenya

- **Kenyatta National Hospital** — gynaecology department
- **Aga Khan University Hospital**
- **Nairobi Hospital**
- **MP Shah Hospital**

Ask specifically for a gynaecologist who has experience with endometriosis.

## Living With Endometriosis

- Track your symptoms in CycleApp to identify patterns
- Bring your symptom history to doctor appointments
- Connect with others through online support groups
- Be your own advocate — do not accept dismissal of your pain
    `,
  },
]

const categories = ['All', 'Cycle Health', 'PCOS', 'Fertility', 'Nutrition', 'Mental Health', 'Endometriosis']

const Articles = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = articles.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featured = articles.filter(a => a.featured)

  return (
    <div className="articles-screen">

      {/* Header */}
      <div className="articles-header">
        <h2 className="articles-title">Health Articles</h2>
        <p className="articles-sub">
          Evidence-based health information for women
        </p>
      </div>

      {/* Search */}
      <div className="articles-search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="articles-search"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => setSearchQuery('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Featured articles */}
      {!searchQuery && selectedCategory === 'All' && (
        <div className="articles-section">
          <p className="articles-section-label">⭐ Featured</p>
          <div className="featured-list">
            {featured.map(article => (
              <div
                key={article.id}
                className="featured-card"
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                <div
                  className="featured-card-top"
                  style={{ background: article.categoryColor + '15' }}
                >
                  <span className="featured-emoji">{article.emoji}</span>
                  <span
                    className="featured-category"
                    style={{ color: article.categoryColor }}
                  >
                    {article.category}
                  </span>
                </div>
                <div className="featured-card-body">
                  <h3 className="featured-title">{article.title}</h3>
                  <p className="featured-subtitle">{article.subtitle}</p>
                  <div className="featured-meta">
                    <span className="article-read-time">⏱ {article.readTime}</span>
                    <div className="article-tags">
                      {article.tags.map(tag => (
                        <span key={tag} className="article-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="category-scroll">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* All articles */}
      <div className="articles-section">
        <p className="articles-section-label">
          {searchQuery
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`
            : selectedCategory === 'All'
            ? '📚 All articles'
            : `📚 ${selectedCategory}`}
        </p>

        {filtered.length === 0 ? (
          <div className="articles-empty">
            <span className="articles-empty-icon">🔍</span>
            <p>No articles found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="articles-list">
            {filtered.map(article => (
              <div
                key={article.id}
                className="article-card"
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                <div
                  className="article-card-icon"
                  style={{ background: article.categoryColor + '20' }}
                >
                  <span>{article.emoji}</span>
                </div>
                <div className="article-card-content">
                  <div className="article-card-top">
                    <span
                      className="article-category-label"
                      style={{ color: article.categoryColor }}
                    >
                      {article.category}
                    </span>
                    <span className="article-read-time">⏱ {article.readTime}</span>
                  </div>
                  <h3 className="article-card-title">{article.title}</h3>
                  <p className="article-card-subtitle">{article.subtitle}</p>
                </div>
                <span className="article-arrow">›</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="articles-disclaimer">
        <p>
          ⚕️ These articles are for educational purposes only and do not
          constitute medical advice. Always consult a qualified healthcare
          provider for diagnosis and treatment.
        </p>
      </div>

    </div>
  )
}

export default Articles