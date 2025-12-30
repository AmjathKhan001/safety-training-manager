// ============================================
// Certificate Templates System
// Version: 1.0
// ============================================

class CertificateTemplates {
    constructor() {
        this.templates = {};
        this.currentTemplate = null;
        this.defaultData = {
            recipientName: 'John Doe',
            trainingTitle: 'Safety Training Program',
            organization: 'Safety First Inc.',
            certificateText: 'has successfully completed the training program and demonstrated proficiency in all required competencies.',
            completionDate: new Date().toLocaleDateString(),
            certificateId: 'CERT-' + Date.now().toString().substr(-6),
            trainerName: 'Sarah Johnson',
            validityPeriod: '2 Years',
            issueDate: new Date().toLocaleDateString(),
            certificateType: 'Completion',
            grade: 'Excellent',
            hours: '8',
            location: 'Online',
            referenceNumber: 'REF-' + Date.now().toString().substr(-8)
        };
        
        this.loadTemplates();
        this.init();
    }
    
    init() {
        console.log('Certificate Templates initialized');
        this.setupTemplateEvents();
    }
    
    loadTemplates() {
        // Professional Template
        this.templates.professional = {
            id: 'professional',
            name: 'Professional Certificate',
            description: 'Modern gradient design with clean layout',
            category: 'modern',
            colors: ['#667eea', '#764ba2', '#3498db', '#2ecc71'],
            preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            html: (data) => this.generateProfessionalHTML(data),
            css: () => this.getProfessionalCSS()
        };
        
        // Corporate Template
        this.templates.corporate = {
            id: 'corporate',
            name: 'Corporate Certificate',
            description: 'Formal design for corporate training programs',
            category: 'corporate',
            colors: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'],
            preview: 'linear-gradient(135deg, #2c3e50, #34495e)',
            html: (data) => this.generateCorporateHTML(data),
            css: () => this.getCorporateCSS()
        };
        
        // Elegant Template
        this.templates.elegant = {
            id: 'elegant',
            name: 'Elegant Certificate',
            description: 'Classic design with decorative elements',
            category: 'classic',
            colors: ['#8e44ad', '#9b59b6', '#e74c3c', '#f39c12'],
            preview: 'linear-gradient(135deg, #8e44ad, #9b59b6)',
            html: (data) => this.generateElegantHTML(data),
            css: () => this.getElegantCSS()
        };
        
        // Minimal Template
        this.templates.minimal = {
            id: 'minimal',
            name: 'Minimal Certificate',
            description: 'Simple and clean design',
            category: 'minimal',
            colors: ['#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'],
            preview: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)',
            html: (data) => this.generateMinimalHTML(data),
            css: () => this.getMinimalCSS()
        };
        
        // Safety Template
        this.templates.safety = {
            id: 'safety',
            name: 'Safety Training Certificate',
            description: 'Designed specifically for safety training',
            category: 'safety',
            colors: ['#e74c3c', '#c0392b', '#3498db', '#2ecc71'],
            preview: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            html: (data) => this.generateSafetyHTML(data),
            css: () => this.getSafetyCSS()
        };
        
        // Set default template
        this.currentTemplate = this.templates.professional;
    }
    
    setupTemplateEvents() {
        // Template selection
        document.addEventListener('click', (e) => {
            const templateBtn = e.target.closest('[data-template]');
            if (templateBtn) {
                const templateId = templateBtn.getAttribute('data-template');
                this.selectTemplate(templateId);
            }
        });
        
        // Color selection
        document.addEventListener('click', (e) => {
            const colorBtn = e.target.closest('[data-color]');
            if (colorBtn) {
                const color = colorBtn.getAttribute('data-color');
                this.changeColor(color);
            }
        });
    }
    
    selectTemplate(templateId) {
        if (this.templates[templateId]) {
            this.currentTemplate = this.templates[templateId];
            
            // Update UI
            document.querySelectorAll('[data-template]').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-template="${templateId}"]`)?.classList.add('active');
            
            // Update preview
            this.updatePreview();
            
            // Track event
            this.trackEvent('template_selected', templateId);
            
            return true;
        }
        return false;
    }
    
    changeColor(color) {
        if (this.currentTemplate) {
            // Update color in current template
            this.currentTemplate.currentColor = color;
            
            // Update UI
            document.querySelectorAll('[data-color]').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-color="${color}"]`)?.classList.add('active');
            
            // Update preview
            this.updatePreview();
            
            // Track event
            this.trackEvent('color_changed', color);
        }
    }
    
    updatePreview(data = null) {
        const previewContainer = document.getElementById('certificatePreview');
        if (!previewContainer || !this.currentTemplate) return;
        
        const templateData = data || this.getFormData();
        const html = this.currentTemplate.html(templateData);
        
        previewContainer.innerHTML = html;
        
        // Apply CSS
        const style = document.createElement('style');
        style.textContent = this.currentTemplate.css();
        previewContainer.appendChild(style);
        
        // Apply color if set
        if (this.currentTemplate.currentColor) {
            this.applyColor(this.currentTemplate.currentColor);
        }
    }
    
    getFormData() {
        // Get data from form fields
        const data = { ...this.defaultData };
        
        // Map form fields to data properties
        const fieldMap = {
            recipientName: 'recipientName',
            trainingTitle: 'trainingTitle',
            organization: 'organization',
            certificateText: 'certificateText',
            completionDate: 'completionDate',
            certificateId: 'certificateId',
            trainerName: 'trainerName',
            validityPeriod: 'validityPeriod',
            issueDate: 'issueDate',
            certificateType: 'certificateType',
            grade: 'grade',
            hours: 'hours',
            location: 'location',
            referenceNumber: 'referenceNumber'
        };
        
        Object.keys(fieldMap).forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element && element.value) {
                data[fieldMap[fieldId]] = element.value;
            }
        });
        
        return data;
    }
    
    applyColor(color) {
        const preview = document.getElementById('certificatePreview');
        if (!preview) return;
        
        // Apply color to various elements based on template
        switch (this.currentTemplate.id) {
            case 'professional':
                preview.style.background = `linear-gradient(135deg, ${color}, ${this.adjustColor(color, -30)})`;
                preview.style.borderColor = this.adjustColor(color, -50);
                break;
                
            case 'corporate':
                preview.style.borderLeftColor = color;
                preview.querySelectorAll('.accent').forEach(el => {
                    el.style.color = color;
                });
                break;
                
            case 'elegant':
                preview.querySelectorAll('.decorative-border').forEach(el => {
                    el.style.borderColor = color;
                });
                break;
                
            case 'minimal':
                preview.style.borderColor = color;
                break;
                
            case 'safety':
                preview.querySelectorAll('.safety-icon').forEach(el => {
                    el.style.color = color;
                });
                break;
        }
    }
    
    adjustColor(color, amount) {
        // Simple color adjustment
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = (num >> 16) + amount;
        const g = ((num >> 8) & 0x00FF) + amount;
        const b = (num & 0x0000FF) + amount;
        
        return `#${(
            0x1000000 +
            (r < 255 ? r < 1 ? 0 : r : 255) * 0x10000 +
            (g < 255 ? g < 1 ? 0 : g : 255) * 0x100 +
            (b < 255 ? b < 1 ? 0 : b : 255)
        ).toString(16).slice(1)}`;
    }
    
    // Template HTML Generators
    generateProfessionalHTML(data) {
        return `
            <div class="certificate professional-certificate">
                <div class="certificate-header">
                    <div class="header-decoration">
                        <div class="decoration-left"></div>
                        <div class="decoration-center">
                            <i class="fas fa-award"></i>
                        </div>
                        <div class="decoration-right"></div>
                    </div>
                    <h1 class="certificate-title">CERTIFICATE</h1>
                    <p class="certificate-subtitle">OF ACHIEVEMENT</p>
                </div>
                
                <div class="certificate-body">
                    <div class="presented-to">
                        <p>This is to certify that</p>
                        <h2 class="recipient-name">${data.recipientName}</h2>
                        <p>has successfully completed</p>
                    </div>
                    
                    <div class="training-details">
                        <h3 class="training-title">${data.trainingTitle}</h3>
                        <p class="training-description">${data.certificateText}</p>
                    </div>
                    
                    <div class="certificate-info">
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Date of Completion</span>
                                <span class="info-value">${data.completionDate}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Certificate ID</span>
                                <span class="info-value">${data.certificateId}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Valid Until</span>
                                <span class="info-value">${data.validityPeriod}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Training Hours</span>
                                <span class="info-value">${data.hours} hours</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="certificate-footer">
                    <div class="signatures">
                        <div class="signature signature-trainer">
                            <div class="signature-line"></div>
                            <p class="signature-name">${data.trainerName}</p>
                            <p class="signature-title">Certified Trainer</p>
                        </div>
                        
                        <div class="signature signature-organization">
                            <div class="organization-logo">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <p class="organization-name">${data.organization}</p>
                            <p class="organization-title">Training Organization</p>
                        </div>
                    </div>
                    
                    <div class="certificate-seal">
                        <div class="seal-content">
                            <span>SEAL</span>
                        </div>
                    </div>
                </div>
                
                <div class="certificate-verification">
                    <p>Verify this certificate at: <strong>verify.safetytraining.com/${data.certificateId}</strong></p>
                </div>
            </div>
        `;
    }
    
    generateCorporateHTML(data) {
        return `
            <div class="certificate corporate-certificate">
                <div class="corporate-header">
                    <div class="company-info">
                        <div class="company-logo">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="company-details">
                            <h2>${data.organization}</h2>
                            <p>Professional Training & Development</p>
                        </div>
                    </div>
                    
                    <div class="certificate-title-section">
                        <h1>CERTIFICATE OF COMPLETION</h1>
                        <div class="title-decoration"></div>
                    </div>
                </div>
                
                <div class="corporate-body">
                    <div class="presentation-statement">
                        <p>Be it known that</p>
                        <h2 class="recipient-name">${data.recipientName}</h2>
                        <p>has satisfactorily completed the requirements for</p>
                    </div>
                    
                    <div class="program-details">
                        <h3 class="program-title">${data.trainingTitle}</h3>
                        <div class="program-info">
                            <p><strong>Program Code:</strong> ${data.referenceNumber}</p>
                            <p><strong>Completion Date:</strong> ${data.completionDate}</p>
                            <p><strong>Certificate Number:</strong> ${data.certificateId}</p>
                        </div>
                    </div>
                    
                    <div class="performance-assessment">
                        <h4>Performance Assessment</h4>
                        <div class="assessment-grid">
                            <div class="assessment-item">
                                <span class="assessment-label">Final Grade</span>
                                <span class="assessment-value">${data.grade}</span>
                            </div>
                            <div class="assessment-item">
                                <span class="assessment-label">Training Hours</span>
                                <span class="assessment-value">${data.hours}</span>
                            </div>
                            <div class="assessment-item">
                                <span class="assessment-label">Location</span>
                                <span class="assessment-value">${data.location}</span>
                            </div>
                            <div class="assessment-item">
                                <span class="assessment-label">Validity</span>
                                <span class="assessment-value">${data.validityPeriod}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="certificate-statement">
                        <p>${data.certificateText}</p>
                        <p>This certificate is issued under the authority of ${data.organization}.</p>
                    </div>
                </div>
                
                <div class="corporate-footer">
                    <div class="authorization-signatures">
                        <div class="authorization-item">
                            <div class="signature-box">
                                <div class="signature-line-long"></div>
                                <p class="authorized-by">${data.trainerName}</p>
                                <p class="authorization-title">Authorized Trainer</p>
                            </div>
                        </div>
                        
                        <div class="authorization-item">
                            <div class="stamp-area">
                                <div class="official-stamp">
                                    <div class="stamp-inner">
                                        <span>OFFICIAL</span>
                                        <span>STAMP</span>
                                    </div>
                                </div>
                                <p class="stamp-date">Date: ${data.issueDate}</p>
                            </div>
                        </div>
                        
                        <div class="authorization-item">
                            <div class="director-signature">
                                <div class="signature-line-long"></div>
                                <p class="director-title">Training Director</p>
                                <p class="organization-name">${data.organization}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="corporate-verification">
                    <div class="verification-info">
                        <p><i class="fas fa-qrcode"></i> Scan to verify authenticity</p>
                        <p><strong>Verification Code:</strong> ${data.certificateId}</p>
                        <p><strong>Issued:</strong> ${data.issueDate}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateElegantHTML(data) {
        return `
            <div class="certificate elegant-certificate">
                <div class="elegant-border decorative-border">
                    <div class="border-corner top-left"></div>
                    <div class="border-corner top-right"></div>
                    <div class="border-corner bottom-left"></div>
                    <div class="border-corner bottom-right"></div>
                </div>
                
                <div class="elegant-header">
                    <div class="header-ornament">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h1 class="elegant-title">Certificate of Excellence</h1>
                    <div class="header-ornament">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
                
                <div class="elegant-body">
                    <div class="presentation">
                        <p class="presentation-text">This is to certify that</p>
                        <h2 class="recipient-name elegant">${data.recipientName}</h2>
                        <p class="presentation-text">has demonstrated exceptional achievement in</p>
                    </div>
                    
                    <div class="accomplishment">
                        <h3 class="accomplishment-title">${data.trainingTitle}</h3>
                        <div class="accomplishment-details">
                            <p>${data.certificateText}</p>
                        </div>
                    </div>
                    
                    <div class="elegant-details">
                        <div class="detail-columns">
                            <div class="detail-column">
                                <div class="detail-item">
                                    <span class="detail-icon"><i class="fas fa-calendar-alt"></i></span>
                                    <div class="detail-content">
                                        <span class="detail-label">Date Awarded</span>
                                        <span class="detail-value">${data.completionDate}</span>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon"><i class="fas fa-id-card"></i></span>
                                    <div class="detail-content">
                                        <span class="detail-label">Certificate ID</span>
                                        <span class="detail-value">${data.certificateId}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="detail-column">
                                <div class="detail-item">
                                    <span class="detail-icon"><i class="fas fa-user-tie"></i></span>
                                    <div class="detail-content">
                                        <span class="detail-label">Presented By</span>
                                        <span class="detail-value">${data.trainerName}</span>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon"><i class="fas fa-building"></i></span>
                                    <div class="detail-content">
                                        <span class="detail-label">Organization</span>
                                        <span class="detail-value">${data.organization}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elegant-footer">
                    <div class="signature-area">
                        <div class="signature-block">
                            <div class="signature-line decorative-border"></div>
                            <p class="signatory-name">${data.trainerName}</p>
                            <p class="signatory-title">Certifying Authority</p>
                        </div>
                        
                        <div class="seal-area">
                            <div class="elegant-seal">
                                <div class="seal-outer">
                                    <div class="seal-inner">
                                        <i class="fas fa-award"></i>
                                    </div>
                                </div>
                                <p class="seal-text">Official Seal</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elegant-verification">
                    <p><i class="fas fa-certificate"></i> This certificate is registered in the official records of ${data.organization}</p>
                </div>
            </div>
        `;
    }
    
    generateMinimalHTML(data) {
        return `
            <div class="certificate minimal-certificate">
                <div class="minimal-header">
                    <h1>Certificate</h1>
                    <div class="minimal-divider"></div>
                </div>
                
                <div class="minimal-body">
                    <div class="minimal-statement">
                        <p>This certifies that</p>
                        <h2>${data.recipientName}</h2>
                        <p>has completed</p>
                        <h3>${data.trainingTitle}</h3>
                        <p>on ${data.completionDate}</p>
                    </div>
                    
                    <div class="minimal-details">
                        <div class="minimal-grid">
                            <div class="minimal-item">
                                <span>ID:</span>
                                <strong>${data.certificateId}</strong>
                            </div>
                            <div class="minimal-item">
                                <span>Valid:</span>
                                <strong>${data.validityPeriod}</strong>
                            </div>
                            <div class="minimal-item">
                                <span>Hours:</span>
                                <strong>${data.hours}</strong>
                            </div>
                            <div class="minimal-item">
                                <span>Grade:</span>
                                <strong>${data.grade}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="minimal-footer">
                    <div class="minimal-signatures">
                        <div class="minimal-signature">
                            <div class="signature-line-minimal"></div>
                            <p>${data.trainerName}</p>
                            <p class="small">Trainer</p>
                        </div>
                        
                        <div class="minimal-signature">
                            <div class="minimal-logo">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <p>${data.organization}</p>
                            <p class="small">Issuing Authority</p>
                        </div>
                    </div>
                </div>
                
                <div class="minimal-verification">
                    <p class="small">${data.certificateId} • ${data.completionDate}</p>
                </div>
            </div>
        `;
    }
    
    generateSafetyHTML(data) {
        return `
            <div class="certificate safety-certificate">
                <div class="safety-header">
                    <div class="safety-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h1>SAFETY TRAINING CERTIFICATE</h1>
                    <p class="safety-subtitle">Workplace Safety & Compliance</p>
                </div>
                
                <div class="safety-body">
                    <div class="certification-statement">
                        <p>This is to certify that</p>
                        <h2 class="recipient-name safety">${data.recipientName}</h2>
                        <p>has successfully completed safety training in</p>
                        <h3 class="safety-training-title">${data.trainingTitle}</h3>
                    </div>
                    
                    <div class="safety-details">
                        <div class="safety-grid">
                            <div class="safety-item">
                                <i class="fas fa-calendar-check"></i>
                                <div class="safety-content">
                                    <span class="safety-label">Date of Training</span>
                                    <span class="safety-value">${data.completionDate}</span>
                                </div>
                            </div>
                            
                            <div class="safety-item">
                                <i class="fas fa-id-badge"></i>
                                <div class="safety-content">
                                    <span class="safety-label">Certificate Number</span>
                                    <span class="safety-value">${data.certificateId}</span>
                                </div>
                            </div>
                            
                            <div class="safety-item">
                                <i class="fas fa-clock"></i>
                                <div class="safety-content">
                                    <span class="safety-label">Training Duration</span>
                                    <span class="safety-value">${data.hours} hours</span>
                                </div>
                            </div>
                            
                            <div class="safety-item">
                                <i class="fas fa-calendar-alt"></i>
                                <div class="safety-content">
                                    <span class="safety-label">Valid Until</span>
                                    <span class="safety-value">${data.validityPeriod}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="safety-competencies">
                        <h4>Safety Competencies Demonstrated:</h4>
                        <ul class="safety-list">
                            <li><i class="fas fa-check-circle"></i> Hazard Identification & Risk Assessment</li>
                            <li><i class="fas fa-check-circle"></i> Proper Use of Personal Protective Equipment</li>
                            <li><i class="fas fa-check-circle"></i> Emergency Response Procedures</li>
                            <li><i class="fas fa-check-circle"></i> Compliance with Safety Regulations</li>
                        </ul>
                    </div>
                    
                    <div class="safety-verification">
                        <p><i class="fas fa-exclamation-triangle"></i> This certificate verifies completion of mandatory safety training required for workplace compliance.</p>
                    </div>
                </div>
                
                <div class="safety-footer">
                    <div class="safety-signatures">
                        <div class="safety-signature">
                            <div class="signature-line-safety"></div>
                            <p class="signature-name">${data.trainerName}</p>
                            <p class="signature-title">Certified Safety Trainer</p>
                            <p class="signature-credentials">OSHA Certified • First Aid Certified</p>
                        </div>
                        
                        <div class="safety-organization">
                            <div class="organization-seal">
                                <div class="seal-outer-circle">
                                    <div class="seal-inner-circle">
                                        <i class="fas fa-safety"></i>
                                    </div>
                                </div>
                            </div>
                            <p class="organization-name">${data.organization}</p>
                            <p class="organization-tagline">Commitment to Workplace Safety</p>
                        </div>
                        
                        <div class="safety-compliance">
                            <div class="compliance-stamp">
                                <span>COMPLIANCE</span>
                                <span>VERIFIED</span>
                            </div>
                            <p class="compliance-date">Date: ${data.issueDate}</p>
                        </div>
                    </div>
                </div>
                
                <div class="safety-disclaimer">
                    <p><small>This certificate does not guarantee workplace safety. All personnel must continue to follow established safety protocols and procedures.</small></p>
                </div>
            </div>
        `;
    }
    
    // Template CSS Styles
    getProfessionalCSS() {
        return `
            .professional-certificate {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px;
                border: 20px solid #2c3e50;
                position: relative;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .certificate-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .header-decoration {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .decoration-left, .decoration-right {
                width: 100px;
                height: 2px;
                background: rgba(255,255,255,0.5);
            }
            
            .decoration-center {
                margin: 0 20px;
                font-size: 2rem;
                color: #ffd700;
            }
            
            .certificate-title {
                font-size: 3rem;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 3px;
            }
            
            .certificate-subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
                margin-top: 10px;
            }
            
            .certificate-body {
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
                margin-bottom: 30px;
            }
            
            .presented-to {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .recipient-name {
                font-size: 2.5rem;
                margin: 20px 0;
                color: #fff;
                font-weight: bold;
            }
            
            .training-details {
                text-align: center;
                margin: 30px 0;
            }
            
            .training-title {
                font-size: 1.8rem;
                margin-bottom: 15px;
                color: #ffd700;
            }
            
            .training-description {
                font-size: 1.1rem;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .certificate-info {
                margin-top: 40px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-top: 20px;
            }
            
            .info-item {
                background: rgba(255,255,255,0.05);
                padding: 15px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
            }
            
            .info-label {
                font-size: 0.9rem;
                opacity: 0.8;
                margin-bottom: 5px;
            }
            
            .info-value {
                font-size: 1.1rem;
                font-weight: bold;
            }
            
            .certificate-footer {
                margin-top: 40px;
            }
            
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }
            
            .signature {
                text-align: center;
                flex: 1;
                padding: 0 20px;
            }
            
            .signature-line {
                width: 200px;
                height: 1px;
                background: white;
                margin: 20px auto;
            }
            
            .signature-name {
                font-weight: bold;
                margin-top: 10px;
            }
            
            .signature-title {
                font-size: 0.9rem;
                opacity: 0.8;
                margin-top: 5px;
            }
            
            .organization-logo {
                font-size: 2.5rem;
                color: #ffd700;
                margin-bottom: 10px;
            }
            
            .organization-name {
                font-weight: bold;
                margin: 5px 0;
            }
            
            .certificate-seal {
                position: absolute;
                bottom: 40px;
                right: 40px;
            }
            
            .seal-content {
                width: 100px;
                height: 100px;
                border: 2px solid #ffd700;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
                background: rgba(0,0,0,0.3);
            }
            
            .certificate-verification {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.2);
                font-size: 0.9rem;
                text-align: center;
                opacity: 0.9;
            }
        `;
    }
    
    getCorporateCSS() {
        return `
            .corporate-certificate {
                font-family: 'Georgia', 'Times New Roman', Times, serif;
                background: white;
                padding: 40px;
                border: 1px solid #ddd;
                max-width: 800px;
                margin: 0 auto;
                position: relative;
            }
            
            .corporate-header {
                margin-bottom: 40px;
            }
            
            .company-info {
                display: flex;
                align-items: center;
                margin-bottom: 30px;
            }
            
            .company-logo {
                width: 80px;
                height: 80px;
                background: #2c3e50;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                margin-right: 20px;
            }
            
            .company-details h2 {
                color: #2c3e50;
                margin: 0 0 5px 0;
                font-size: 1.8rem;
            }
            
            .certificate-title-section {
                text-align: center;
                position: relative;
            }
            
            .certificate-title-section h1 {
                color: #2c3e50;
                font-size: 2.2rem;
                margin: 0;
                position: relative;
                display: inline-block;
            }
            
            .title-decoration {
                width: 300px;
                height: 3px;
                background: #e74c3c;
                margin: 10px auto 0;
            }
            
            .corporate-body {
                margin: 40px 0;
            }
            
            .presentation-statement {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .presentation-statement h2 {
                color: #2c3e50;
                font-size: 2rem;
                margin: 15px 0;
                padding: 10px 0;
                border-top: 1px solid #eee;
                border-bottom: 1px solid #eee;
            }
            
            .program-details {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: #f8f9fa;
                border-left: 4px solid #3498db;
            }
            
            .program-title {
                color: #2c3e50;
                font-size: 1.8rem;
                margin-bottom: 15px;
            }
            
            .program-info {
                display: flex;
                justify-content: center;
                gap: 30px;
                flex-wrap: wrap;
                margin-top: 15px;
            }
            
            .performance-assessment {
                margin: 40px 0;
                padding: 20px;
                background: #f8f9fa;
            }
            
            .performance-assessment h4 {
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .assessment-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .assessment-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                background: white;
                border: 1px solid #eee;
            }
            
            .certificate-statement {
                margin: 30px 0;
                padding: 20px;
                font-style: italic;
                text-align: center;
                border-top: 1px solid #eee;
                border-bottom: 1px solid #eee;
            }
            
            .corporate-footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #2c3e50;
            }
            
            .authorization-signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
            }
            
            .authorization-item {
                flex: 1;
                text-align: center;
                padding: 0 15px;
            }
            
            .signature-line-long {
                width: 200px;
                height: 1px;
                background: #2c3e50;
                margin: 20px auto;
            }
            
            .authorized-by {
                font-weight: bold;
                margin-top: 10px;
                color: #2c3e50;
            }
            
            .official-stamp {
                width: 120px;
                height: 120px;
                border: 2px solid #e74c3c;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 10px;
            }
            
            .stamp-inner {
                text-align: center;
                font-weight: bold;
                color: #e74c3c;
                line-height: 1.2;
            }
            
            .corporate-verification {
                margin-top: 30px;
                padding: 15px;
                background: #f8f9fa;
                font-size: 0.9rem;
                text-align: center;
            }
        `;
    }
    
    getElegantCSS() {
        return `
            .elegant-certificate {
                font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
                background: #fefefe;
                padding: 50px;
                border: 2px solid #8e44ad;
                position: relative;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .decorative-border {
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                border: 1px solid #8e44ad;
                pointer-events: none;
            }
            
            .border-corner {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 2px solid #8e44ad;
            }
            
            .border-corner.top-left {
                top: -15px;
                left: -15px;
                border-right: none;
                border-bottom: none;
            }
            
            .border-corner.top-right {
                top: -15px;
                right: -15px;
                border-left: none;
                border-bottom: none;
            }
            
            .border-corner.bottom-left {
                bottom: -15px;
                left: -15px;
                border-right: none;
                border-top: none;
            }
            
            .border-corner.bottom-right {
                bottom: -15px;
                right: -15px;
                border-left: none;
                border-top: none;
            }
            
            .elegant-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .header-ornament {
                display: flex;
                justify-content: center;
                gap: 20px;
                color: #8e44ad;
                margin: 10px 0;
            }
            
            .elegant-title {
                color: #2c3e50;
                font-size: 2.5rem;
                margin: 20px 0;
                font-weight: normal;
                letter-spacing: 2px;
            }
            
            .elegant-body {
                margin: 40px 0;
            }
            
            .presentation {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .presentation-text {
                font-size: 1.1rem;
                color: #7f8c8d;
                margin: 10px 0;
            }
            
            .recipient-name.elegant {
                font-size: 2.2rem;
                color: #8e44ad;
                margin: 20px 0;
                font-weight: normal;
                font-style: italic;
                padding: 10px 0;
                border-top: 1px solid #eee;
                border-bottom: 1px solid #eee;
            }
            
            .accomplishment {
                text-align: center;
                margin: 40px 0;
            }
            
            .accomplishment-title {
                color: #2c3e50;
                font-size: 1.8rem;
                margin-bottom: 15px;
            }
            
            .elegant-details {
                margin: 40px 0;
            }
            
            .detail-columns {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-top: 30px;
            }
            
            .detail-item {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .detail-icon {
                color: #8e44ad;
                font-size: 1.2rem;
                width: 30px;
                text-align: center;
            }
            
            .detail-content {
                display: flex;
                flex-direction: column;
            }
            
            .detail-label {
                font-size: 0.9rem;
                color: #7f8c8d;
            }
            
            .detail-value {
                font-weight: bold;
                color: #2c3e50;
            }
            
            .elegant-footer {
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #eee;
            }
            
            .signature-area {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
            
            .signature-block {
                text-align: center;
            }
            
            .signatory-name {
                font-weight: bold;
                margin-top: 10px;
                color: #2c3e50;
            }
            
            .seal-area {
                text-align: center;
            }
            
            .elegant-seal {
                display: inline-block;
            }
            
            .seal-outer {
                width: 100px;
                height: 100px;
                border: 2px solid #8e44ad;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .seal-inner {
                width: 80px;
                height: 80px;
                background: #8e44ad;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }
            
            .elegant-verification {
                margin-top: 30px;
                padding: 15px;
                background: #f8f9fa;
                text-align: center;
                font-size: 0.9rem;
                color: #7f8c8d;
            }
        `;
    }
    
    getMinimalCSS() {
        return `
            .minimal-certificate {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                background: white;
                padding: 40px;
                max-width: 600px;
                margin: 0 auto;
                border: 2px solid #ecf0f1;
            }
            
            .minimal-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .minimal-header h1 {
                color: #2c3e50;
                font-size: 2.5rem;
                margin: 0;
                font-weight: 300;
                letter-spacing: 5px;
            }
            
            .minimal-divider {
                width: 100px;
                height: 1px;
                background: #bdc3c7;
                margin: 20px auto;
            }
            
            .minimal-body {
                margin: 40px 0;
            }
            
            .minimal-statement {
                text-align: center;
                line-height: 1.8;
            }
            
            .minimal-statement h2 {
                color: #2c3e50;
                font-size: 1.8rem;
                margin: 15px 0;
                font-weight: normal;
            }
            
            .minimal-statement h3 {
                color: #7f8c8d;
                font-size: 1.2rem;
                margin: 15px 0;
                font-weight: normal;
            }
            
            .minimal-details {
                margin: 30px 0;
            }
            
            .minimal-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                max-width: 300px;
                margin: 0 auto;
            }
            
            .minimal-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #ecf0f1;
            }
            
            .minimal-footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ecf0f1;
            }
            
            .minimal-signatures {
                display: flex;
                justify-content: space-around;
            }
            
            .minimal-signature {
                text-align: center;
            }
            
            .signature-line-minimal {
                width: 150px;
                height: 1px;
                background: #2c3e50;
                margin: 15px auto;
            }
            
            .minimal-logo {
                width: 60px;
                height: 60px;
                background: #3498db;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 10px;
                font-size: 1.5rem;
            }
            
            .small {
                font-size: 0.8rem;
                color: #7f8c8d;
                margin-top: 5px;
            }
            
            .minimal-verification {
                margin-top: 20px;
                text-align: center;
                font-size: 0.8rem;
                color: #bdc3c7;
            }
        `;
    }
    
    getSafetyCSS() {
        return `
            .safety-certificate {
                font-family: 'Arial', sans-serif;
                background: white;
                padding: 40px;
                border: 5px solid #e74c3c;
                max-width: 800px;
                margin: 0 auto;
                position: relative;
            }
            
            .safety-header {
                text-align: center;
                margin-bottom: 40px;
                position: relative;
            }
            
            .safety-icon {
                font-size: 3rem;
                color: #e74c3c;
                margin-bottom: 20px;
            }
            
            .safety-header h1 {
                color: #2c3e50;
                font-size: 2.2rem;
                margin: 10px 0;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .safety-subtitle {
                color: #7f8c8d;
                font-size: 1.1rem;
                margin-top: 10px;
            }
            
            .safety-body {
                margin: 40px 0;
            }
            
            .certification-statement {
                text-align: center;
                margin-bottom: 40px;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 8px;
            }
            
            .recipient-name.safety {
                color: #e74c3c;
                font-size: 2rem;
                margin: 15px 0;
                font-weight: bold;
            }
            
            .safety-training-title {
                color: #2c3e50;
                font-size: 1.5rem;
                margin: 15px 0;
                padding: 10px;
                background: #fff8e1;
                border-left: 4px solid #f39c12;
            }
            
            .safety-details {
                margin: 40px 0;
            }
            
            .safety-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-top: 20px;
            }
            
            .safety-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #3498db;
            }
            
            .safety-item i {
                color: #3498db;
                font-size: 1.5rem;
            }
            
            .safety-content {
                display: flex;
                flex-direction: column;
            }
            
            .safety-label {
                font-size: 0.9rem;
                color: #7f8c8d;
            }
            
            .safety-value {
                font-weight: bold;
                color: #2c3e50;
                margin-top: 5px;
            }
            
            .safety-competencies {
                margin: 40px 0;
                padding: 20px;
                background: #e8f4fc;
                border-radius: 8px;
            }
            
            .safety-competencies h4 {
                color: #2c3e50;
                margin-bottom: 15px;
            }
            
            .safety-list {
                list-style: none;
                padding-left: 0;
            }
            
            .safety-list li {
                margin-bottom: 10px;
                display: flex;
                align-items: flex-start;
                gap: 10px;
            }
            
            .safety-list i {
                color: #2ecc71;
                margin-top: 3px;
            }
            
            .safety-verification {
                margin: 30px 0;
                padding: 15px;
                background: #fff8e1;
                border-radius: 8px;
                font-size: 0.9rem;
                color: #7d6608;
                border-left: 4px solid #f39c12;
            }
            
            .safety-footer {
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #eee;
            }
            
            .safety-signatures {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            
            .safety-signature {
                flex: 1;
                text-align: center;
                padding: 0 15px;
            }
            
            .signature-line-safety {
                width: 180px;
                height: 2px;
                background: #2c3e50;
                margin: 20px auto;
            }
            
            .signature-name {
                font-weight: bold;
                color: #2c3e50;
                margin-top: 10px;
            }
            
            .signature-credentials {
                font-size: 0.8rem;
                color: #7f8c8d;
                margin-top: 5px;
            }
            
            .safety-organization {
                flex: 1;
                text-align: center;
            }
            
            .organization-seal {
                margin-bottom: 15px;
            }
            
            .seal-outer-circle {
                width: 100px;
                height: 100px;
                border: 3px solid #e74c3c;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
            }
            
            .seal-inner-circle {
                width: 80px;
                height: 80px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }
            
            .organization-tagline {
                font-size: 0.9rem;
                color: #7f8c8d;
                margin-top: 5px;
            }
            
            .safety-compliance {
                flex: 1;
                text-align: center;
            }
            
            .compliance-stamp {
                width: 120px;
                height: 120px;
                border: 2px solid #27ae60;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0 auto 10px;
                font-weight: bold;
                color: #27ae60;
                line-height: 1.2;
            }
            
            .safety-disclaimer {
                margin-top: 30px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                text-align: center;
                color: #7f8c8d;
            }
        `;
    }
    
    trackEvent(action, data) {
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'certificate',
                event_label: data
            });
        }
        
        // Send to visitor counter
        if (window.visitorCounter) {
            window.visitorCounter.trackEvent('certificate_' + action, { data: data });
        }
    }
    
    // Public API
    getTemplate(templateId) {
        return this.templates[templateId];
    }
    
    getAllTemplates() {
        return this.templates;
    }
    
    getTemplateCategories() {
        const categories = {};
        Object.values(this.templates).forEach(template => {
            if (!categories[template.category]) {
                categories[template.category] = [];
            }
            categories[template.category].push(template);
        });
        return categories;
    }
    
    renderTemplateSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const categories = this.getTemplateCategories();
        
        let html = '<div class="template-selector">';
        
        Object.keys(categories).forEach(category => {
            html += `<h3>${category.charAt(0).toUpperCase() + category.slice(1)} Templates</h3>`;
            html += '<div class="template-category">';
            
            categories[category].forEach(template => {
                html += `
                    <div class="template-card" data-template="${template.id}">
                        <div class="template-preview" style="background: ${template.preview}">
                            <i class="fas fa-award"></i>
                        </div>
                        <div class="template-info">
                            <h4>${template.name}</h4>
                            <p>${template.description}</p>
                            <div class="template-colors">
                                ${template.colors.map(color => `
                                    <span class="color-dot" style="background: ${color}" data-color="${color}"></span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Add event listeners
        container.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const templateId = card.getAttribute('data-template');
                this.selectTemplate(templateId);
            });
        });
        
        container.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const color = dot.getAttribute('data-color');
                this.changeColor(color);
            });
        });
    }
    
    generateCertificate(data, templateId = null) {
        const template = templateId ? this.templates[templateId] : this.currentTemplate;
        if (!template) {
            console.error('Template not found');
            return null;
        }
        
        const certificateData = { ...this.defaultData, ...data };
        const html = template.html(certificateData);
        const css = template.css();
        
        return { html, css, data: certificateData };
    }
    
    downloadCertificate(data, templateId = null, filename = 'certificate.pdf') {
        const certificate = this.generateCertificate(data, templateId);
        if (!certificate) return false;
        
        // Create a temporary element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = certificate.html;
        
        const style = document.createElement('style');
        style.textContent = certificate.css;
        tempDiv.appendChild(style);
        
        tempDiv.id = 'temp-certificate-' + Date.now();
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        // Generate PDF
        if (window.PDFGenerator) {
            window.PDFGenerator.generateFromElement(tempDiv.id, filename);
        } else {
            console.error('PDF Generator not available');
        }
        
        // Clean up
        setTimeout(() => {
            if (tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
            }
        }, 1000);
        
        return true;
    }
}

// Initialize Certificate Templates
let certificateTemplates;

document.addEventListener('DOMContentLoaded', function() {
    certificateTemplates = new CertificateTemplates();
    
    // Make available globally
    window.certificateTemplates = certificateTemplates;
    
    console.log('Certificate Templates initialized');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CertificateTemplates };
}
