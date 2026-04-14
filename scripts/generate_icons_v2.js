const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');

const colors = {
    '1': 'blue',
    '2': 'lightblue',
    '3': 'green',
    '4': 'orange',
    '5': 'red',
    '6': 'yellow',
    '7': 'purple',
};

const iconMappings = {
    'f1': 'fa-solid/chart-line',
    'f2': 'fa-solid/balance-scale',
    'f3': 'fa-solid/globe-americas',
    'f4': 'fa-solid/drafting-compass',
    'f5': 'fa-solid/prescription-bottle-alt',
    'c1': 'mdi/table-furniture',
    'c2': 'ion/fast-food-outline',
    'c3': 'ion/pizza-outline',
    'c4': 'ic/baseline-storefront',
    'c5': 'mdi/coffee-outline',
    'c6': 'mdi/ice-cream',
    'e1': 'ic/baseline-sports-soccer',
    'e2': 'mdi/tennis',
    'e3': 'mdi/table-tennis',
    
    // Fallbacks to categories if subItemId has no specific icon
    'cat1': 'fa-solid/graduation-cap',
    'cat2': 'fa-solid/university',
    'cat3': 'ic/baseline-local-cafe',
    'cat4': 'ion/dice',
    'cat5': 'fa-solid/plus-square',
    'cat6': 'ic/baseline-menu-book',
    'cat7': 'ic/baseline-stadium'
};

const markersToGenerate = [
    { id: 'f1', categoryId: '1' },
    { id: 'f2', categoryId: '1' },
    { id: 'f3', categoryId: '1' },
    { id: 'f4', categoryId: '1' },
    { id: 'f5', categoryId: '1' },
    { id: 'f19', categoryId: '1' }, // Default to cat1
    { id: 'a1', categoryId: '2' },   // Default to cat2
    { id: 'c1', categoryId: '3' },
    { id: 'c2', categoryId: '3' },
    { id: 'c3', categoryId: '3' },
    { id: 'c4', categoryId: '3' },
    { id: 'c5', categoryId: '3' },
    { id: 'c6', categoryId: '3' },
    { id: 'e1', categoryId: '4' },
    { id: 'e2', categoryId: '4' },
    { id: 'e3', categoryId: '4' },
    { id: 'm1', categoryId: '5' },   // Default to cat5
    { id: 'b1', categoryId: '6' },   // Default to cat6
    { id: 'ee1', categoryId: '7' },  // Default to cat7
];

const fetchSvgString = (iconRef) => {
    return new Promise((resolve, reject) => {
        const url = `https://api.iconify.design/${iconRef}.svg`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) reject(new Error(`Failed to fetch ${iconRef}`));
                resolve(data);
            });
        }).on('error', reject);
    });
};

const generateSvgBuffer = async (marker) => {
    const color = colors[marker.categoryId];
    const iconRef = iconMappings[marker.id] || iconMappings[`cat${marker.categoryId}`];
    
    // Fetch exact vector shape from API
    const rawSvg = await fetchSvgString(iconRef);
    
    // Extract viewBox and inner paths
    const viewBoxMatch = rawSvg.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
    
    // Replace fill="currentColor" with our specific color, or add it if missing
    let innerContent = rawSvg.replace(/<svg[^>]*>|<\/svg>/g, '');
    if (!innerContent.includes('fill=')) {
        innerContent = innerContent.replace(/<path /g, `<path fill="${color}" `);
    } else {
        innerContent = innerContent.replace(/fill="currentColor"/g, `fill="${color}"`);
    }

    const finalSvg = `
<svg width="150" height="150" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="80" height="80" rx="16" fill="${color}" stroke="rgba(255,255,255,0.8)" stroke-width="4" />
  <circle cx="45" cy="45" r="30" fill="white" />
  <svg x="25" y="25" width="40" height="40" viewBox="${viewBox}">
    ${innerContent}
  </svg>
</svg>
    `;

    return Buffer.from(finalSvg);
};

const dir = path.join(__dirname, '..', 'src', 'assets', 'markers');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function run() {
    console.log("Starting SVG to PNG extraction using Iconify...");
    for (const marker of markersToGenerate) {
        try {
            const buffer = await generateSvgBuffer(marker);
            await sharp(buffer)
                .png()
                .toFile(path.join(dir, `${marker.id}.png`));
            console.log(`Generated perfect PNG for ${marker.id}.png`);
        } catch (err) {
            console.error(`Error generating ${marker.id}:`, err.message);
        }
    }
    console.log('Mobile Marker generation completed successfully!');
}

run();
