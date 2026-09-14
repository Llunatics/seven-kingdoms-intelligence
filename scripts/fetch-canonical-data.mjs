import fs from 'fs';
import path from 'path';

const RAW_DIR = path.resolve('src/data/raw');
if (!fs.existsSync(RAW_DIR)) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

async function main() {
  console.log('Fetching CSV list from joakimskoog/AnApiOfIceAndFire...');
  const res = await fetch('https://api.github.com/repos/joakimskoog/AnApiOfIceAndFire/contents/src/AnApiOfIceAndFire.Setup/csv', {
    headers: { 'User-Agent': 'SevenKingdomsDataIngest/1.0' }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch file list: ${res.status} ${res.statusText}`);
  }

  const files = await res.json();
  for (const f of files) {
    if (f.name.endsWith('.csv')) {
      console.log(`Downloading ${f.name}...`);
      const fileRes = await fetch(f.url, {
        headers: { 'User-Agent': 'SevenKingdomsDataIngest/1.0' }
      });
      const fileData = await fileRes.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      fs.writeFileSync(path.join(RAW_DIR, f.name), content, 'utf-8');
      console.log(`Saved ${f.name} (${content.length} bytes)`);
    }
  }
  console.log('All canonical CSV files fetched successfully!');
}

main().catch(err => {
  console.error('Fetch error:', err);
  process.exit(1);
});
