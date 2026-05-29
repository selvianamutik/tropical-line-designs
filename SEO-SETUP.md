# SEO Setup Guide - Tropical Line Designs

## ✅ Files Created

### 1. **robots.txt** (`/public/robots.txt`)
- Controls search engine crawler access
- Blocks admin/auth pages from indexing
- Allows AI crawlers (ChatGPT, Claude, Perplexity)
- Points to sitemap.xml

### 2. **sitemap.ts** (`/src/app/sitemap.ts`)
- Dynamic sitemap generation
- Automatically includes all project pages
- Updates based on database content
- Accessible at: `https://yourdomain.com/sitemap.xml`

### 3. **manifest.ts** (`/src/app/manifest.ts`)
- PWA manifest for mobile SEO
- Defines app name, colors, icons
- Improves mobile search rankings

### 4. **llms.txt** (`/public/llms.txt`)
- AI crawler instructions
- Helps ChatGPT, Claude, Perplexity understand your business
- Improves AI-generated answers about your company
- Accessible at: `https://yourdomain.com/llms.txt`

### 5. **StructuredData.tsx** (`/src/components/seo/StructuredData.tsx`)
- JSON-LD structured data component
- Schema.org markup for rich results
- Supports: Organization, Website, Breadcrumb, Project schemas

### 6. **Updated layout.tsx**
- Enhanced meta tags (title, description, keywords)
- Open Graph tags for social media
- Twitter Card tags
- Google Search Console verification support
- Structured data integration

### 7. **.env.example**
- Environment variable template
- Includes Google Search Console verification placeholder

---

## 🚀 Next Steps

### 1. Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (website URL)
3. Choose verification method: **HTML tag**
4. Copy the verification code (looks like: `abc123xyz`)
5. Add to your `.env` file:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz
   ```
6. Deploy and verify

### 2. Submit Sitemap to GSC

After verification:
1. Go to GSC > Sitemaps
2. Submit: `https://yourdomain.com/sitemap.xml`
3. Wait for Google to crawl (can take 1-7 days)

### 3. Update Environment Variables

Copy `.env.example` to `.env` and fill in:
```bash
NEXT_PUBLIC_SITE_URL=https://tropicallinedesigns.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code-here
```

### 4. Test SEO Implementation

**Before deploying, test locally:**
```bash
npm run build
npm run start
```

**Check these URLs:**
- `http://localhost:3000/sitemap.xml` - Should show all pages
- `http://localhost:3000/robots.txt` - Should show crawler rules
- `http://localhost:3000/llms.txt` - Should show AI instructions
- `http://localhost:3000/manifest.webmanifest` - Should show PWA config

### 5. Verify Structured Data

Use [Google Rich Results Test](https://search.google.com/test/rich-results):
1. Enter your homepage URL
2. Check for Organization schema
3. Check for Website schema
4. Fix any errors

---

## 🎯 SEO Keywords Strategy

### Primary Keywords (High Priority)
- `landscape design bali`
- `tropical landscape architecture`
- `resort landscape design`
- `hotel landscape architect bali`
- `villa landscape design`

### Secondary Keywords
- `landscape construction bali`
- `tropical garden design`
- `balinese landscape architecture`
- `luxury resort landscape`

### Long-tail Keywords (High Conversion)
- `best landscape architect for resort in bali`
- `tropical landscape design and build`
- `luxury villa landscape design bali`

---

## 📊 Monitoring & Analytics

### Google Search Console Metrics to Track
1. **Impressions** - How often you appear in search
2. **Clicks** - How many people visit from search
3. **CTR** - Click-through rate (aim for >3%)
4. **Average Position** - Where you rank (aim for top 10)

### Key Pages to Monitor
- Homepage (`/`)
- Projects page (`/projects`)
- Individual project pages (`/projects/[slug]`)
- About page (`/about`)
- Contact page (`/contact`)

---

## 🔧 Maintenance

### Monthly Tasks
- [ ] Check GSC for crawl errors
- [ ] Review top performing keywords
- [ ] Check sitemap submission status
- [ ] Monitor page indexing status

### Quarterly Tasks
- [ ] Update llms.txt with new projects
- [ ] Review and update meta descriptions
- [ ] Check structured data validity
- [ ] Analyze competitor rankings

---

## 📝 Notes

- **No content or design was changed** - Only technical SEO files added
- All changes are "invisible" to users - only search engines see them
- Structured data appears in `<head>` but doesn't affect layout
- Meta tags don't change any visible text on pages

---

## 🆘 Troubleshooting

### Sitemap not showing?
- Check build logs for errors
- Verify `listPublicProjects()` function works
- Check database connection

### Google not indexing?
- Wait 1-7 days after submission
- Check robots.txt isn't blocking
- Verify sitemap has no errors in GSC

### Structured data errors?
- Use Google Rich Results Test
- Check JSON-LD syntax
- Verify all required fields present

---

## 📚 Resources

- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [llms.txt Standard](https://llmstxt.org/)

---

**Created:** May 29, 2026
**Last Updated:** May 29, 2026
