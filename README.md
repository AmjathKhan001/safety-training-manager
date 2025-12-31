# Safety Training Manager

A free web-based tool for safety professionals to manage training attendance and create professional certificates.

## 🌟 Features

### Main Tools
- **Attendance Sheet Generator**: Create customizable training attendance sheets
- **Certificate Creator**: Design and generate professional training certificates
- **PDF Export**: Download generated documents as PDF files
- **Template System**: Multiple certificate templates to choose from

### Additional Features
- Visitor counter tracking
- Responsive design (mobile-friendly)
- No registration required
- Completely free to use

## 📁 Project Structure
safety-training-manager/
├── index.html # Homepage
├── attendance.html # Attendance sheet generator
├── certificate.html # Certificate generator
├── pages/ # Additional pages
│ ├── blog.html # Blog/articles
│ ├── privacy.html # Privacy policy
│ ├── terms.html # Terms of service
│ ├── affiliate-disclosure.html # Affiliate disclosure
│ ├── sitemap.html # HTML sitemap
│ └── tools.html # Additional tools page
├── css/ # Stylesheets
│ ├── style.css # Main styles
│ ├── utilities.css # Utility classes
│ └── responsive.css # Responsive styles
├── js/ # JavaScript files
│ ├── main.js # Main functionality
│ ├── pdf-generator.js # PDF generation
│ ├── visitor-counter.js # Visitor counter
│ └── certificate-templates.js # Certificate templates
├── assets/ # Static assets
│ ├── logo.png # Website logo
│ ├── og-image.jpg # Open Graph image
│ └── templates/ # Certificate templates
│ ├── certificate1.jpg # Template 1
│ └── certificate2.jpg # Template 2
├── sitemap.xml # XML sitemap
├── robots.txt # Robots configuration
└── README.md # This file

text

## 🚀 Quick Start

### Local Development
1. Clone or download the project
2. Open `index.html` in your browser
3. No server required - works entirely in browser

### Browser Requirements
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+)
- JavaScript enabled
- Local storage enabled (for saving preferences)

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox/Grid
- **JavaScript (ES6+)**: Client-side functionality
- **jsPDF**: PDF generation library
- **LocalStorage**: User preferences storage
- **GitHub Pages**: Deployment ready

## 🔧 Customization

### Changing Colors
Edit `css/style.css`:
```css
:root {
    --primary-color: #2563eb;     /* Main blue */
    --secondary-color: #64748b;   /* Gray */
    --accent-color: #10b981;      /* Green */
}
Adding Certificate Templates
Add template images to assets/templates/

Update js/certificate-templates.js:

javascript
const templates = [
    {
        id: 'template3',
        name: 'New Template',
        image: '../assets/templates/certificate3.jpg',
        preview: 'Preview URL'
    }
];
📱 Responsive Design
The website is fully responsive with breakpoints:

Desktop: 1024px+

Tablet: 768px - 1023px

Mobile: < 768px

📊 SEO Features
Semantic HTML structure

Meta descriptions and Open Graph tags

XML sitemap

Robots.txt configuration

Canonical URLs

Mobile-friendly design

🔒 Privacy & Compliance
No user data collection

All processing happens client-side

No cookies for tracking

GDPR compliant

No analytics tracking

📝 License
This project is released under the MIT License - see the LICENSE file for details.

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

🐛 Issues & Support
Report issues or request features via:

GitHub Issues

Email: support@safetytrainingmanager.com

📈 Deployment
GitHub Pages
Push to main branch

Enable GitHub Pages in repository settings

Set source to /root

Site will deploy to https://username.github.io/safety-training-manager/

Netlify/Vercel
Connect repository

Set build command: (none required)

Set publish directory: /

Deploy

🎯 Target Audience
Safety Managers

Training Coordinators

HR Professionals

Construction Safety Officers

Industrial Safety Personnel

Educational Institutions

💡 Future Enhancements
User accounts (optional)

Cloud storage integration

More certificate templates

Training calendar generator

Compliance tracking tools

Multi-language support

📞 Contact
Project Lead: Developer Team
Email: contact@safetytrainingmanager.com
Website: https://safetytrainingmanager.com
