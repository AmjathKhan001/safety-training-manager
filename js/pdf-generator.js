// ============================================
// PDF Generator Utility
// Version: 1.0
// ============================================

class PDFGenerator {
    constructor() {
        this.isGenerating = false;
        this.currentScale = 2;
        this.pdfQuality = 'high'; // 'low', 'medium', 'high'
        this.pageOrientation = 'portrait'; // 'portrait' or 'landscape'
        this.pageSize = 'a4'; // 'a4', 'letter', 'legal'
        
        this.qualitySettings = {
            low: { scale: 1, quality: 0.8 },
            medium: { scale: 1.5, quality: 0.9 },
            high: { scale: 2, quality: 1 }
        };
        
        this.pageSizes = {
            a4: { width: 210, height: 297, unit: 'mm' },
            letter: { width: 216, height: 279, unit: 'mm' },
            legal: { width: 216, height: 356, unit: 'mm' },
            a3: { width: 297, height: 420, unit: 'mm' }
        };
        
        this.init();
    }
    
    init() {
        this.checkDependencies();
        this.setupEventListeners();
        this.loadSettings();
    }
    
    checkDependencies() {
        if (typeof jsPDF === 'undefined') {
            console.error('jsPDF library is not loaded');
            return false;
        }
        
        if (typeof html2canvas === 'undefined') {
            console.error('html2canvas library is not loaded');
            return false;
        }
        
        return true;
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('stm_pdf_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.pdfQuality = settings.quality || this.pdfQuality;
                this.pageOrientation = settings.orientation || this.pageOrientation;
                this.pageSize = settings.pageSize || this.pageSize;
                
                // Update UI if elements exist
                this.updateSettingsUI();
            }
        } catch (error) {
            console.warn('Failed to load PDF settings:', error);
        }
    }
    
    saveSettings() {
        const settings = {
            quality: this.pdfQuality,
            orientation: this.pageOrientation,
            pageSize: this.pageSize,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('stm_pdf_settings', JSON.stringify(settings));
    }
    
    updateSettingsUI() {
        // Update quality selector
        const qualitySelect = document.getElementById('pdfQuality');
        if (qualitySelect) {
            qualitySelect.value = this.pdfQuality;
        }
        
        // Update orientation selector
        const orientationSelect = document.getElementById('pdfOrientation');
        if (orientationSelect) {
            orientationSelect.value = this.pageOrientation;
        }
        
        // Update page size selector
        const pageSizeSelect = document.getElementById('pdfPageSize');
        if (pageSizeSelect) {
            pageSizeSelect.value = this.pageSize;
        }
    }
    
    setupEventListeners() {
        // Listen for settings changes
        document.addEventListener('change', (e) => {
            if (e.target.id === 'pdfQuality') {
                this.setQuality(e.target.value);
            } else if (e.target.id === 'pdfOrientation') {
                this.setOrientation(e.target.value);
            } else if (e.target.id === 'pdfPageSize') {
                this.setPageSize(e.target.value);
            }
        });
        
        // Listen for PDF generation requests
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-generate-pdf]')) {
                e.preventDefault();
                const elementId = e.target.closest('[data-generate-pdf]').getAttribute('data-generate-pdf');
                const filename = e.target.closest('[data-generate-pdf]').getAttribute('data-filename') || 'document.pdf';
                this.generateFromElement(elementId, filename);
            }
        });
    }
    
    setQuality(quality) {
        if (this.qualitySettings[quality]) {
            this.pdfQuality = quality;
            this.currentScale = this.qualitySettings[quality].scale;
            this.saveSettings();
            
            // Show notification
            this.showMessage(`PDF quality set to ${quality}`, 'success');
        }
    }
    
    setOrientation(orientation) {
        if (['portrait', 'landscape'].includes(orientation)) {
            this.pageOrientation = orientation;
            this.saveSettings();
            
            // Show notification
            this.showMessage(`PDF orientation set to ${orientation}`, 'success');
        }
    }
    
    setPageSize(size) {
        if (this.pageSizes[size]) {
            this.pageSize = size;
            this.saveSettings();
            
            // Show notification
            this.showMessage(`PDF page size set to ${size.toUpperCase()}`, 'success');
        }
    }
    
    async generateFromElement(elementId, filename = 'document.pdf', options = {}) {
        if (this.isGenerating) {
            this.showMessage('Already generating a PDF. Please wait.', 'warning');
            return false;
        }
        
        const element = document.getElementById(elementId);
        if (!element) {
            this.showMessage(`Element with ID "${elementId}" not found.`, 'error');
            return false;
        }
        
        this.isGenerating = true;
        
        // Show loading indicator
        this.showLoading(true, 'Generating PDF...');
        
        try {
            // Merge options with defaults
            const settings = {
                quality: options.quality || this.pdfQuality,
                orientation: options.orientation || this.pageOrientation,
                pageSize: options.pageSize || this.pageSize,
                filename: filename,
                margin: options.margin || 20,
                ...options
            };
            
            // Generate PDF
            const result = await this.generatePDF(element, settings);
            
            if (result) {
                this.showMessage('PDF generated successfully!', 'success');
                
                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'pdf_generate', {
                        'event_category': 'document',
                        'event_label': filename,
                        'value': 1
                    });
                }
                
                return true;
            } else {
                this.showMessage('Failed to generate PDF.', 'error');
                return false;
            }
            
        } catch (error) {
            console.error('PDF Generation Error:', error);
            this.showMessage(`Error: ${error.message}`, 'error');
            return false;
            
        } finally {
            this.isGenerating = false;
            this.showLoading(false);
        }
    }
    
    async generatePDF(element, settings) {
        const { jsPDF } = window.jspdf;
        
        // Get page dimensions
        const pageSize = this.pageSizes[settings.pageSize];
        if (!pageSize) {
            throw new Error(`Invalid page size: ${settings.pageSize}`);
        }
        
        // Create PDF document
        const pdf = new jsPDF(
            settings.orientation === 'landscape' ? 'l' : 'p',
            pageSize.unit,
            settings.pageSize
        );
        
        // Get quality settings
        const quality = this.qualitySettings[settings.quality];
        
        // Clone element for better rendering
        const clone = this.prepareElementForPDF(element, settings);
        
        // Convert to canvas
        const canvas = await html2canvas(clone, {
            scale: quality.scale,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc, clonedElement) => {
                // Apply styles to cloned element
                this.applyPDFStyles(clonedElement, settings);
            }
        });
        
        // Calculate dimensions
        const imgWidth = pageSize.width - (settings.margin * 2);
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Check if content fits on one page
        const maxHeight = pageSize.height - (settings.margin * 2);
        
        if (imgHeight <= maxHeight) {
            // Single page PDF
            const imgData = canvas.toDataURL('image/png', quality.quality);
            pdf.addImage(imgData, 'PNG', settings.margin, settings.margin, imgWidth, imgHeight);
        } else {
            // Multi-page PDF
            await this.generateMultiPagePDF(pdf, canvas, imgWidth, imgHeight, maxHeight, settings, quality);
        }
        
        // Save PDF
        pdf.save(settings.filename);
        
        // Clean up
        if (clone.parentNode) {
            clone.parentNode.removeChild(clone);
        }
        
        return true;
    }
    
    prepareElementForPDF(element, settings) {
        const clone = element.cloneNode(true);
        
        // Set dimensions
        const pageSize = this.pageSizes[settings.pageSize];
        clone.style.width = `${pageSize.width - (settings.margin * 2)}${pageSize.unit}`;
        clone.style.maxWidth = `${pageSize.width - (settings.margin * 2)}${pageSize.unit}`;
        clone.style.margin = '0 auto';
        clone.style.boxSizing = 'border-box';
        
        // Add to document
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.id = `pdf-clone-${Date.now()}`;
        document.body.appendChild(clone);
        
        return clone;
    }
    
    applyPDFStyles(element, settings) {
        // Improve print styles
        const styles = `
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                ${element.tagName.toLowerCase()} {
                    width: ${settings.pageSize === 'a4' ? '210mm' : '216mm'} !important;
                    max-width: ${settings.pageSize === 'a4' ? '210mm' : '216mm'} !important;
                    margin: 0 auto !important;
                    padding: ${settings.margin}mm !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                
                a {
                    color: #000 !important;
                    text-decoration: underline !important;
                }
                
                .no-print {
                    display: none !important;
                }
                
                .page-break {
                    page-break-before: always;
                }
                
                .avoid-break {
                    page-break-inside: avoid;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        element.appendChild(styleSheet);
        
        // Add page break classes to large elements
        const largeElements = element.querySelectorAll('div, section, table');
        largeElements.forEach(el => {
            if (el.offsetHeight > 500) { // Adjust threshold as needed
                el.classList.add('avoid-break');
            }
        });
    }
    
    async generateMultiPagePDF(pdf, canvas, imgWidth, imgHeight, maxHeight, settings, quality) {
        let currentY = settings.margin;
        let pageNumber = 1;
        
        while (currentY < imgHeight) {
            // Calculate crop dimensions
            const cropHeight = Math.min(maxHeight, imgHeight - currentY);
            
            // Create temporary canvas for current page
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = (cropHeight * canvas.width) / imgWidth;
            
            const ctx = tempCanvas.getContext('2d');
            
            // Calculate source and destination coordinates
            const sourceY = (currentY - settings.margin) * canvas.width / imgWidth;
            const sourceHeight = (cropHeight * canvas.width) / imgWidth;
            
            // Draw portion of original canvas
            ctx.drawImage(
                canvas,
                0, sourceY, // Source coordinates
                canvas.width, sourceHeight, // Source dimensions
                0, 0, // Destination coordinates
                tempCanvas.width, tempCanvas.height // Destination dimensions
            );
            
            // Convert to image data
            const imgData = tempCanvas.toDataURL('image/png', quality.quality);
            
            // Add to PDF
            if (pageNumber > 1) {
                pdf.addPage();
            }
            
            pdf.addImage(
                imgData,
                'PNG',
                settings.margin,
                settings.margin,
                imgWidth,
                cropHeight
            );
            
            // Add page number if enabled
            if (settings.showPageNumbers !== false) {
                this.addPageNumber(pdf, pageNumber, settings);
            }
            
            // Update position
            currentY += cropHeight;
            pageNumber++;
        }
    }
    
    addPageNumber(pdf, pageNumber, settings) {
        const pageSize = this.pageSizes[settings.pageSize];
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
            `Page ${pageNumber}`,
            pageSize.width / 2,
            pageSize.height - 10,
            { align: 'center' }
        );
    }
    
    async generateFromHTML(htmlContent, filename = 'document.pdf', settings = {}) {
        // Create temporary element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        tempDiv.id = `temp-pdf-${Date.now()}`;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        document.body.appendChild(tempDiv);
        
        try {
            const result = await this.generateFromElement(tempDiv.id, filename, settings);
            return result;
        } finally {
            // Clean up
            if (tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
            }
        }
    }
    
    generateAttendanceSheet(data, filename = 'attendance_sheet.pdf') {
        // Generate HTML from attendance data
        const html = this.generateAttendanceSheetHTML(data);
        return this.generateFromHTML(html, filename);
    }
    
    generateCertificate(data, filename = 'certificate.pdf') {
        // Generate HTML from certificate data
        const html = this.generateCertificateHTML(data);
        return this.generateFromHTML(html, filename);
    }
    
    generateAttendanceSheetHTML(data) {
        // Default data structure
        const defaultData = {
            trainingTitle: 'Safety Training',
            trainingDate: new Date().toLocaleDateString(),
            trainerName: 'Trainer Name',
            location: 'Training Location',
            participants: [],
            ...data
        };
        
        return `
            <div class="attendance-sheet" style="font-family: Arial, sans-serif; padding: 20mm;">
                <h1 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">
                    ATTENDANCE SHEET
                </h1>
                
                <div style="margin-bottom: 30px;">
                    <p><strong>Training Title:</strong> ${defaultData.trainingTitle}</p>
                    <p><strong>Date:</strong> ${defaultData.trainingDate}</p>
                    <p><strong>Trainer:</strong> ${defaultData.trainerName}</p>
                    <p><strong>Location:</strong> ${defaultData.location}</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background: #3498db; color: white;">
                            <th style="border: 1px solid #ddd; padding: 10px;">Sr. No.</th>
                            <th style="border: 1px solid #ddd; padding: 10px;">Participant Name</th>
                            <th style="border: 1px solid #ddd; padding: 10px;">Employee ID</th>
                            <th style="border: 1px solid #ddd; padding: 10px;">Department</th>
                            <th style="border: 1px solid #ddd; padding: 10px;">Signature</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${defaultData.participants.map((participant, index) => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 10px;">${index + 1}</td>
                                <td style="border: 1px solid #ddd; padding: 10px;">${participant.name || ''}</td>
                                <td style="border: 1px solid #ddd; padding: 10px;">${participant.empId || ''}</td>
                                <td style="border: 1px solid #ddd; padding: 10px;">${participant.department || ''}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; height: 40px;">${participant.signature || '________________'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-top: 50px;">
                    <div style="float: left; width: 45%;">
                        <p>________________________</p>
                        <p><strong>Trainer's Signature</strong></p>
                    </div>
                    <div style="float: right; width: 45%; text-align: right;">
                        <p>________________________</p>
                        <p><strong>Date</strong></p>
                    </div>
                    <div style="clear: both;"></div>
                </div>
                
                <div style="margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center;">
                    <p>Generated by Safety Training Manager | www.hsecalculator.com</p>
                </div>
            </div>
        `;
    }
    
    generateCertificateHTML(data) {
        // Default data structure
        const defaultData = {
            recipientName: 'Recipient Name',
            trainingTitle: 'Safety Training',
            completionDate: new Date().toLocaleDateString(),
            certificateId: 'CERT-' + Date.now(),
            organization: 'Safety First Inc.',
            trainerName: 'Trainer Name',
            validity: '2 Years',
            ...data
        };
        
        return `
            <div class="certificate" style="font-family: 'Times New Roman', serif; padding: 30mm; text-align: center; border: 20px solid #2c3e50;">
                <div style="margin-bottom: 40px;">
                    <h1 style="font-size: 48px; color: #2c3e50; margin-bottom: 10px;">CERTIFICATE</h1>
                    <h2 style="font-size: 24px; color: #7f8c8d; font-weight: normal;">OF ACHIEVEMENT</h2>
                </div>
                
                <div style="margin: 50px 0; padding: 30px; background: rgba(52, 152, 219, 0.1); border-radius: 10px;">
                    <p style="font-size: 20px; margin-bottom: 20px;">This certifies that</p>
                    <h3 style="font-size: 36px; color: #2c3e50; margin-bottom: 30px;">${defaultData.recipientName}</h3>
                    <p style="font-size: 18px; line-height: 1.6;">
                        has successfully completed the <strong>${defaultData.trainingTitle}</strong><br>
                        training program on ${defaultData.completionDate}
                    </p>
                </div>
                
                <div style="display: flex; justify-content: space-around; margin-top: 60px;">
                    <div>
                        <p style="border-top: 1px solid #2c3e50; padding-top: 10px; width: 200px;">
                            <strong>${defaultData.trainerName}</strong><br>
                            Trainer
                        </p>
                    </div>
                    <div>
                        <div style="width: 100px; height: 100px; border: 2px solid #2c3e50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                            <span style="font-weight: bold;">SEAL</span>
                        </div>
                    </div>
                    <div>
                        <p style="border-top: 1px solid #2c3e50; padding-top: 10px; width: 200px;">
                            <strong>${defaultData.organization}</strong><br>
                            Organization
                        </p>
                    </div>
                </div>
                
                <div style="margin-top: 50px; font-size: 14px; color: #7f8c8d;">
                    <p>Certificate ID: <strong>${defaultData.certificateId}</strong></p>
                    <p>Valid for: <strong>${defaultData.validity}</strong></p>
                    <p style="margin-top: 20px;">Generated by Safety Training Manager</p>
                </div>
            </div>
        `;
    }
    
    showLoading(show, message = 'Generating PDF...') {
        let loader = document.getElementById('pdf-loader');
        
        if (show) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'pdf-loader';
                loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    color: white;
                    font-size: 18px;
                `;
                
                loader.innerHTML = `
                    <div class="spinner" style="
                        width: 50px;
                        height: 50px;
                        border: 5px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top-color: white;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    "></div>
                    <div class="message">${message}</div>
                `;
                
                // Add spinner animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `;
                loader.appendChild(style);
                
                document.body.appendChild(loader);
            }
        } else {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }
    }
    
    showMessage(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `pdf-notification pdf-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span style="margin-left: 10px;">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Utility methods
    async downloadPDF(pdf, filename) {
        pdf.save(filename);
        return true;
    }
    
    async openPDFInNewWindow(pdf, filename) {
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        
        // Clean up URL after some time
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    }
    
    async getPDFAsBlob(pdf) {
        return pdf.output('blob');
    }
    
    async getPDFAsDataURL(pdf) {
        return pdf.output('datauristring');
    }
    
    // Batch generation
    async generateBatch(elements, options = {}) {
        const results = [];
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const filename = options.filenames ? options.filenames[i] : `document_${i + 1}.pdf`;
            
            try {
                const result = await this.generateFromElement(element.id, filename, options);
                results.push({
                    element: element.id,
                    filename: filename,
                    success: result,
                    error: null
                });
            } catch (error) {
                results.push({
                    element: element.id,
                    filename: filename,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    // Generate settings UI
    generateSettingsUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="pdf-settings" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">PDF Settings</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Quality</label>
                        <select id="pdfQuality" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="low">Low (Faster)</option>
                            <option value="medium">Medium (Balanced)</option>
                            <option value="high">High (Best Quality)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Orientation</label>
                        <select id="pdfOrientation" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Page Size</label>
                        <select id="pdfPageSize" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="a4">A4 (210 × 297 mm)</option>
                            <option value="letter">Letter (8.5 × 11 in)</option>
                            <option value="legal">Legal (8.5 × 14 in)</option>
                            <option value="a3">A3 (297 × 420 mm)</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-top: 15px; font-size: 12px; color: #7f8c8d;">
                    <p>Settings are saved automatically and apply to all PDFs generated.</p>
                </div>
            </div>
        `;
        
        // Update UI with current settings
        this.updateSettingsUI();
    }
}

// Initialize PDF Generator
let pdfGenerator;

document.addEventListener('DOMContentLoaded', function() {
    pdfGenerator = new PDFGenerator();
    
    // Make available globally
    window.PDFGenerator = pdfGenerator;
    
    // Add global helper functions
    window.generatePDF = function(elementId, filename, options) {
        return pdfGenerator.generateFromElement(elementId, filename, options);
    };
    
    window.generateCertificatePDF = function(data, filename) {
        return pdfGenerator.generateCertificate(data, filename);
    };
    
    window.generateAttendancePDF = function(data, filename) {
        return pdfGenerator.generateAttendanceSheet(data, filename);
    };
    
    console.log('PDF Generator initialized');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PDFGenerator };
}
