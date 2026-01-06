# Website Security Features

This document outlines all the security measures implemented to protect the US Mechanical website from common threats and attacks.

## 🛡️ Security Headers

All security headers are configured in `/react-site/vercel.json` and are automatically applied by Vercel on deployment.

### Implemented Headers:

1. **X-Content-Type-Options: nosniff**
   - Prevents MIME type sniffing
   - Protects against MIME confusion attacks

2. **X-Frame-Options: SAMEORIGIN**
   - Prevents clickjacking attacks
   - Only allows framing from the same origin

3. **X-XSS-Protection: 1; mode=block**
   - Enables browser's XSS filter
   - Blocks page if XSS attack detected

4. **Referrer-Policy: strict-origin-when-cross-origin**
   - Controls referrer information sent with requests
   - Protects user privacy

5. **Permissions-Policy**
   - Disables camera, microphone, and geolocation
   - Reduces attack surface

6. **Strict-Transport-Security (HSTS)**
   - Forces HTTPS connections
   - Prevents SSL stripping attacks
   - Valid for 1 year including subdomains

7. **Content-Security-Policy (CSP)**
   - Comprehensive policy to prevent XSS attacks
   - Restricts resource loading to trusted sources
   - Allows: Self, Sanity CDN, Formspree, Google Fonts

## 🚫 Rate Limiting

Client-side rate limiting protects the contact form from spam and abuse.

**Location:** `/react-site/src/utils/rateLimit.js`

### Features:
- **Maximum 3 submissions per hour** per user
- **5-minute cooldown** between submissions
- Uses browser localStorage for tracking
- User-friendly error messages with countdown timers
- Visual feedback showing remaining submissions

### How it Works:
1. Tracks submission timestamps in localStorage
2. Validates before allowing form submission
3. Provides clear error messages if limit exceeded
4. Automatically resets after time window expires

## ✅ Input Validation & Sanitization

Comprehensive input validation prevents malicious data from being processed.

**Location:** `/react-site/src/utils/validation.js`

### Features:

#### 1. **String Sanitization**
- Removes HTML tags and scripts
- Strips dangerous characters (`<`, `>`, `'`, `"`)
- Limits input length to prevent abuse
- Trims whitespace

#### 2. **Email Validation**
- RFC 5322 compliant regex
- Maximum 254 characters
- Prevents malformed emails

#### 3. **Phone Validation**
- Supports US and international formats
- Validates 10-15 digit numbers
- Removes common formatting characters

#### 4. **Name Validation**
- Allows letters, spaces, hyphens, apostrophes
- Supports international characters and accents
- 2-100 character length requirement

#### 5. **Message Validation**
- 10-5000 character requirement
- Prevents empty or overly long messages

#### 6. **Spam Detection**
- Keyword filtering (viagra, casino, cryptocurrency, etc.)
- Link counting (max 2 links allowed)
- Suspicious email domain detection
- Repetition analysis (detects copy-paste spam)

### Protected Fields:
- ✅ Name (required, sanitized, validated)
- ✅ Email (required, validated)
- ✅ Phone (optional, validated if provided)
- ✅ Message (required, sanitized, validated, spam-checked)

## 🔒 Form Security Features

### Real-time Validation
- Validates as user types
- Shows field-specific error messages
- Clears errors when user corrects input

### Error Handling
- User-friendly error messages
- Clear visual feedback (red borders)
- Character count display
- Success/failure notifications

### Submission Protection
- Disabled submit button during processing
- Prevents double submissions
- Rate limit enforcement
- Spam detection before sending

## 📊 Security Best Practices

### What's Already Protected:
✅ XSS (Cross-Site Scripting) attacks  
✅ Clickjacking attacks  
✅ MIME type confusion  
✅ SQL Injection (Sanity CMS handles this)  
✅ CSRF (Cross-Site Request Forgery) - Formspree handles this  
✅ Form spam and abuse  
✅ Rate limiting  
✅ Input validation  

### Additional Security Measures:
- **HTTPS Enforced:** Vercel provides automatic SSL/TLS
- **DDoS Protection:** Included with Vercel hosting
- **CDN:** Global content delivery with Vercel Edge Network
- **Environment Variables:** API keys stored securely in Vercel

## 🚀 Deployment Considerations

### Before Deploying:
1. ✅ All security headers configured
2. ✅ Input validation implemented
3. ✅ Rate limiting active
4. ✅ Spam detection enabled
5. ✅ HTTPS enforced

### Testing Security:
1. Test form with malicious input (HTML, scripts)
2. Verify rate limiting works (submit 4 times quickly)
3. Check that spam keywords are blocked
4. Verify headers are present (use browser dev tools)
5. Test CSP by checking console for violations

## 🔧 Maintenance

### Regular Updates:
- Keep dependencies updated (`npm update`)
- Monitor Sanity CMS for security updates
- Review spam detection patterns periodically
- Check Vercel security advisories

### Monitoring:
- Review form submission patterns
- Check for unusual traffic spikes
- Monitor for repeated failed submissions
- Review Vercel analytics for anomalies

## 📝 Notes

### Limitations:
- **Client-side rate limiting** can be bypassed by clearing localStorage, but Formspree also has server-side rate limiting
- **Spam detection** uses pattern matching and isn't perfect - some spam may get through
- **No CAPTCHA** - Consider adding Google reCAPTCHA if spam becomes an issue

### Future Enhancements:
- Add Google reCAPTCHA v3 (invisible CAPTCHA)
- Implement server-side validation (if you add a backend)
- Add honeypot fields for additional spam protection
- Consider adding IP-based rate limiting (requires backend)

## 🆘 Troubleshooting

### Form Submissions Blocked?
- Check rate limit (wait 5 minutes between submissions)
- Clear localStorage if testing: `localStorage.removeItem('formSubmissions')`
- Verify message doesn't contain spam keywords
- Check browser console for errors

### Security Headers Not Working?
- Deploy to Vercel (headers only work in production)
- Check `vercel.json` configuration
- Use browser dev tools → Network → Response Headers
- May need to clear cache

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security](https://vercel.com/docs/security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Security Basics](https://developers.google.com/web/fundamentals/security)

---

**Last Updated:** January 6, 2026  
**Security Review:** All critical security measures implemented ✅

