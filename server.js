const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Support parsing of JSON bodies up to 10mb (since HTML strings can be large)
app.use(express.json({ limit: '10mb' }));

// Serve static assets
app.use(express.static(path.join(__dirname)));

// API endpoint to generate PDF
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const { htmlContent } = req.body;
        if (!htmlContent) {
            return res.status(400).send('HTML content is required');
        }

        // Lê a logo como base64 para incorporar inline (Puppeteer não resolve caminhos relativos)
        const logoPdfPath = path.join(__dirname, 'logopdf.png');
        let logoBase64 = '';
        if (fs.existsSync(logoPdfPath)) {
            const logoBuffer = fs.readFileSync(logoPdfPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        }

        // Substitui src relativo da logo pelo base64 no HTML recebido
        let processedHtml = htmlContent;
        if (logoBase64) {
            processedHtml = processedHtml.replace(/src="logopdf\.png"/g, `src="${logoBase64}"`);
            processedHtml = processedHtml.replace(/src='logopdf\.png'/g, `src="${logoBase64}"`);
        }

        // Converte marcadores visuais de quebra de página em quebras CSS reais para o Puppeteer
        processedHtml = processedHtml.replace(
            /<div[^>]*data-page-break="true"[^>]*>.*?<\/div>/gs,
            '<div style="page-break-before: always; break-before: page; height: 0; margin: 0; padding: 0;"></div>'
        );

        // Read the style.css file to inject it inline
        const stylePath = path.join(__dirname, 'style.css');
        let styleCss = '';
        if (fs.existsSync(stylePath)) {
            styleCss = fs.readFileSync(stylePath, 'utf8');
        }

        // Construct the full HTML document
        const fullHtml = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Testes</title>
            <!-- Google Fonts -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            <style>
                ${styleCss}
                body {
                    background: #ffffff !important;
                    color: #1f2937 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .a4-page-wrapper {
                    box-shadow: none !important;
                    margin: 0 !important;
                    width: 100% !important;
                    min-width: 100% !important;
                    min-height: unset !important;
                    padding: 0 !important; /* Margins are handled by Puppeteer print options */
                    background: #ffffff !important;
                    color: #1f2937 !important;
                }
                .document-content {
                    min-height: unset !important;
                }
                .doc-section-container {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
                .doc-breakdown-col {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }
                @media print {
                    body > * {
                        display: block !important;
                        visibility: visible !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="a4-page-wrapper">
                ${processedHtml}
            </div>
        </body>
        </html>
        `;

        console.log(`[Server] Recebeu solicitação para gerar PDF. Tamanho do HTML: ${htmlContent.length} caracteres`);

        // Launch Puppeteer headless browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security'
            ]
        });

        const page = await browser.newPage();

        // Captura logs e erros de dentro da página do Puppeteer
        page.on('console', msg => console.log('PUPPETEER PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.error('PUPPETEER PAGE ERROR:', err.message));

        // Força a emulação de mídia de tela (screen) para ignorar as regras de ocultação do `@media print`
        await page.emulateMediaType('screen');

        // Set viewport size
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

        // Load the HTML content, using our local server as the base URL to resolve images
        await page.setContent(fullHtml, {
            waitUntil: 'networkidle0',
        });

        // Salva screenshot para debug local do que o Puppeteer está realmente enxergando
        const debugScreenshotPath = path.join(__dirname, 'puppeteer-debug.png');
        await page.screenshot({ path: debugScreenshotPath, fullPage: true });
        console.log(`[Server] Screenshot de debug salvo em: ${debugScreenshotPath}`);

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });

        await browser.close();

        // Send PDF back
        res.contentType('application/pdf');
        res.send(pdfBuffer);

    } catch (err) {
        console.error('Puppeteer generation error:', err);
        res.status(500).send('Error generating PDF: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
