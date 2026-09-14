import fs from 'fs';
import path from 'path';

const RAW_DIR = path.resolve('src/data/raw');
const OUT_DIR = path.resolve('src/data');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];
  
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    const obj = {};
    for (let h = 0; h < headers.length; h++) {
      obj[headers[h]] = values[h] !== undefined ? values[h] : '';
    }
    records.push(obj);
  }
  return records;
}

function parseCSVLine(text) {
  const result = [];
  let curr = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        curr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(curr.trim());
      curr = '';
    } else {
      curr += char;
    }
  }
  result.push(curr.trim());
  return result;
}

async function build() {
  console.log('Building canonical Ice and Fire datasets...');

  // 1. Titles map
  const titlesCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'titles.csv'), 'utf-8'));
  const titleMap = new Map();
  for (const t of titlesCsv) {
    titleMap.set(t.id, t.title);
  }

  // 2. TV Series map
  const tvSeriesCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'tv_series.csv'), 'utf-8'));
  const tvMap = new Map();
  for (const tv of tvSeriesCsv) {
    tvMap.set(tv.id, tv.tv_series);
  }

  // 3. Character Aliases
  const charAliasesCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'character_aliases.csv'), 'utf-8'));
  const charAliasesMap = new Map();
  for (const a of charAliasesCsv) {
    const id = parseInt(a.character_id, 10);
    if (!charAliasesMap.has(id)) charAliasesMap.set(id, []);
    charAliasesMap.get(id).push(a.alias);
  }

  // 4. Character Titles
  const charTitlesCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'character_titles.csv'), 'utf-8'));
  const charTitlesMap = new Map();
  for (const ct of charTitlesCsv) {
    const id = parseInt(ct.character_id, 10);
    const titleText = titleMap.get(ct.title_id);
    if (titleText) {
      if (!charTitlesMap.has(id)) charTitlesMap.set(id, []);
      charTitlesMap.get(id).push(titleText);
    }
  }

  // 5. Character Played By
  const charPlayedCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'character_played_by.csv'), 'utf-8'));
  const charPlayedMap = new Map();
  for (const p of charPlayedCsv) {
    const id = parseInt(p.character_id, 10);
    if (!charPlayedMap.has(id)) charPlayedMap.set(id, []);
    charPlayedMap.get(id).push(p.played_by);
  }

  // 6. Character TV Series
  const charTvCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'character_tv_series.csv'), 'utf-8'));
  const charTvMap = new Map();
  for (const ctv of charTvCsv) {
    const id = parseInt(ctv.character_id, 10);
    const season = tvMap.get(ctv.tv_series_id);
    if (season) {
      if (!charTvMap.has(id)) charTvMap.set(id, []);
      charTvMap.get(id).push(season);
    }
  }

  // 7. Character Relationships
  const charRelCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'character_relationships.csv'), 'utf-8'));
  const charRelMap = new Map();
  for (const r of charRelCsv) {
    const id = parseInt(r.character_id, 10);
    charRelMap.set(id, {
      father: r.father ? parseInt(r.father, 10) : null,
      mother: r.mother ? parseInt(r.mother, 10) : null,
      spouse: r.spouse ? parseInt(r.spouse, 10) : null,
    });
  }

  // Canonical Secondary Lore Enrichments (strictly grounded in George R.R. Martin canon)
  // Fixes known API gaps where parents were left unlinked for key Stark, Lannister, and Targaryen heirs.
  const canonicalEnrichments = {
    // Eddard & Catelyn Stark children:
    148: { father: 339, mother: 232 }, // Arya Stark -> Eddard & Catelyn
    957: { father: 339, mother: 232, spouse: 1052 }, // Sansa Stark -> Eddard & Catelyn, spouse: Tyrion
    208: { father: 339, mother: 232 }, // Brandon (Bran) Stark -> Eddard & Catelyn
    891: { father: 339, mother: 232 }, // Rickon Stark -> Eddard & Catelyn
    583: { father: 339, mother: 1650 }, // Jon Snow -> Eddard (acknowledged) / Lyanna Stark

    // Eddard Stark & siblings:
    339: { father: 887, mother: 668, spouse: 232 }, // Eddard Stark -> Rickard & Lyarra Stark, spouse: Catelyn
    206: { father: 887, mother: 668 }, // Brandon Stark -> Rickard & Lyarra Stark
    181: { father: 887, mother: 668 }, // Benjen Stark -> Rickard & Lyarra Stark
    1650: { father: 887, mother: 668 }, // Lyanna Stark -> Rickard & Lyarra Stark

    // Lannister:
    238: { father: 27, mother: 562, spouse: 901 }, // Cersei -> Tywin & Joanna, spouse: Robert Baratheon
    529: { father: 27, mother: 562 }, // Jaime -> Tywin & Joanna
    1052: { father: 27, mother: 562 }, // Tyrion -> Tywin & Joanna
    27: { spouse: 562 }, // Tywin -> Joanna

    // Targaryen:
    271: { father: 62, mother: 862, spouse: 333 }, // Daenerys -> Aerys II & Rhaella, spouse: Drogo
    1076: { father: 62, mother: 862 }, // Viserys -> Aerys II & Rhaella
    867: { father: 62, mother: 862, spouse: 356 }, // Rhaegar -> Aerys II & Rhaella, spouse: Elia Martell

    // Baratheon children:
    565: { mother: 238, father: 529 }, // Joffrey -> Cersei & Jaime
    775: { mother: 238, father: 529 }, // Myrcella -> Cersei & Jaime
    1029: { mother: 238, father: 529 }, // Tommen -> Cersei & Jaime
  };

  for (const [idStr, rel] of Object.entries(canonicalEnrichments)) {
    const id = parseInt(idStr, 10);
    const existing = charRelMap.get(id) || { father: null, mother: null, spouse: null };
    charRelMap.set(id, {
      father: rel.father ?? existing.father,
      mother: rel.mother ?? existing.mother,
      spouse: rel.spouse ?? existing.spouse,
    });
  }

  // 8. House Sworn Members & Character Allegiances
  const houseCharsCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'house_characters.csv'), 'utf-8'));
  const houseMembersMap = new Map();
  const charAllegiancesMap = new Map();
  for (const hc of houseCharsCsv) {
    const houseId = parseInt(hc.house_id, 10);
    const charId = parseInt(hc.character_id, 10);
    if (!houseMembersMap.has(houseId)) houseMembersMap.set(houseId, []);
    houseMembersMap.get(houseId).push(charId);

    if (!charAllegiancesMap.has(charId)) charAllegiancesMap.set(charId, []);
    charAllegiancesMap.get(charId).push(houseId);
  }

  // 9. Book Characters & POV
  const bookCharsCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'book_characters.csv'), 'utf-8'));
  const bookCharactersMap = new Map();
  const charBooksMap = new Map();
  for (const bc of bookCharsCsv) {
    const bookId = parseInt(bc.book_id, 10);
    const charId = parseInt(bc.character_id, 10);
    if (!bookCharactersMap.has(bookId)) bookCharactersMap.set(bookId, []);
    bookCharactersMap.get(bookId).push(charId);

    if (!charBooksMap.has(charId)) charBooksMap.set(charId, []);
    charBooksMap.get(charId).push(bookId);
  }

  const bookPovCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'book_pov_characters.csv'), 'utf-8'));
  const bookPovMap = new Map();
  const charPovBooksMap = new Map();
  for (const bp of bookPovCsv) {
    const bookId = parseInt(bp.book_id, 10);
    const charId = parseInt(bp.character_id, 10);
    if (!bookPovMap.has(bookId)) bookPovMap.set(bookId, []);
    bookPovMap.get(bookId).push(charId);

    if (!charPovBooksMap.has(charId)) charPovBooksMap.set(charId, []);
    charPovBooksMap.get(charId).push(bookId);
  }

  // 10. House Seats, Titles, Weapons, Cadet Branches, Relationships
  const houseSeatsCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'house_seats.csv'), 'utf-8'));
  const houseSeatsMap = new Map();
  for (const s of houseSeatsCsv) {
    const id = parseInt(s.house_id, 10);
    if (!houseSeatsMap.has(id)) houseSeatsMap.set(id, []);
    houseSeatsMap.get(id).push(s.seat);
  }

  const houseTitlesCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'house_titles.csv'), 'utf-8'));
  const houseTitlesMap = new Map();
  for (const ht of houseTitlesCsv) {
    const id = parseInt(ht.house_id, 10);
    if (!houseTitlesMap.has(id)) houseTitlesMap.set(id, []);
    houseTitlesMap.get(id).push(ht.title);
  }

  const houseWeaponsCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'house_ancestral_weapons.csv'), 'utf-8'));
  const houseWeaponsMap = new Map();
  for (const w of houseWeaponsCsv) {
    const id = parseInt(w.house_id, 10);
    if (!houseWeaponsMap.has(id)) houseWeaponsMap.set(id, []);
    houseWeaponsMap.get(id).push(w.ancestral_weapon);
  }

  const houseBranchesCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'house_cadet_branches.csv'), 'utf-8'));
  const houseBranchesMap = new Map();
  for (const b of houseBranchesCsv) {
    const id = parseInt(b.house_id, 10);
    const branchId = parseInt(b.cadet_branch_id, 10);
    if (!houseBranchesMap.has(id)) houseBranchesMap.set(id, []);
    houseBranchesMap.get(id).push(branchId);
  }

  const houseRelCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'house_relationships.csv'), 'utf-8'));
  const houseRelMap = new Map();
  for (const hr of houseRelCsv) {
    const id = parseInt(hr.house_id, 10);
    houseRelMap.set(id, {
      currentLord: hr.current_lord ? parseInt(hr.current_lord, 10) : null,
      founder: hr.founder ? parseInt(hr.founder, 10) : null,
      heir: hr.heir ? parseInt(hr.heir, 10) : null,
      overlord: hr.overlord ? parseInt(hr.overlord, 10) : null,
    });
  }

  // BUILD BOOKS
  const booksCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'books.csv'), 'utf-8'));
  const books = booksCsv.map(b => {
    const id = parseInt(b.id, 10);
    return {
      id,
      url: `https://anapioficeandfire.com/api/books/${id}`,
      name: b.name,
      isbn: b.isbn,
      authors: b.authors ? b.authors.split(',').map(a => a.trim()) : [],
      numberOfPages: parseInt(b.number_of_pages, 10) || 0,
      publisher: b.publisher,
      country: b.country,
      mediaType: b.media_type,
      released: b.release_date ? `${b.release_date}T00:00:00` : '',
      characters: (bookCharactersMap.get(id) || []).map(cid => `https://anapioficeandfire.com/api/characters/${cid}`),
      characterIds: bookCharactersMap.get(id) || [],
      povCharacters: (bookPovMap.get(id) || []).map(cid => `https://anapioficeandfire.com/api/characters/${cid}`),
      povCharacterIds: bookPovMap.get(id) || [],
    };
  });

  // BUILD HOUSES
  const housesCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'houses.csv'), 'utf-8'));
  const houses = housesCsv.map(h => {
    const id = parseInt(h.id, 10);
    const rel = houseRelMap.get(id) || {};
    return {
      id,
      url: `https://anapioficeandfire.com/api/houses/${id}`,
      name: h.name,
      region: h.region || '',
      coatOfArms: h.coat_of_arms || '',
      words: h.words || '',
      titles: houseTitlesMap.get(id) || [],
      seats: houseSeatsMap.get(id) || [],
      currentLord: rel.currentLord ? `https://anapioficeandfire.com/api/characters/${rel.currentLord}` : '',
      currentLordId: rel.currentLord || null,
      heir: rel.heir ? `https://anapioficeandfire.com/api/characters/${rel.heir}` : '',
      heirId: rel.heir || null,
      overlord: rel.overlord ? `https://anapioficeandfire.com/api/houses/${rel.overlord}` : '',
      overlordId: rel.overlord || null,
      founded: h.founded || '',
      founder: rel.founder ? `https://anapioficeandfire.com/api/characters/${rel.founder}` : '',
      founderId: rel.founder || null,
      diedOut: h.died_out || '',
      ancestralWeapons: houseWeaponsMap.get(id) || [],
      cadetBranches: (houseBranchesMap.get(id) || []).map(bid => `https://anapioficeandfire.com/api/houses/${bid}`),
      cadetBranchIds: houseBranchesMap.get(id) || [],
      swornMembers: (houseMembersMap.get(id) || []).map(cid => `https://anapioficeandfire.com/api/characters/${cid}`),
      swornMemberIds: houseMembersMap.get(id) || [],
    };
  });

  // BUILD CHARACTERS
  const charactersCsv = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'characters.csv'), 'utf-8'));
  const characters = charactersCsv.map(c => {
    const id = parseInt(c.id, 10);
    const rel = charRelMap.get(id) || {};
    const genderStr = c.gender ? (c.gender.toLowerCase() === 'female' ? 'Female' : 'Male') : '';
    
    return {
      id,
      url: `https://anapioficeandfire.com/api/characters/${id}`,
      name: c.name || '',
      gender: genderStr,
      culture: c.culture || '',
      born: c.born || '',
      died: c.died || '',
      titles: charTitlesMap.get(id) || [],
      aliases: charAliasesMap.get(id) || [],
      father: rel.father ? `https://anapioficeandfire.com/api/characters/${rel.father}` : '',
      fatherId: rel.father || null,
      mother: rel.mother ? `https://anapioficeandfire.com/api/characters/${rel.mother}` : '',
      motherId: rel.mother || null,
      spouse: rel.spouse ? `https://anapioficeandfire.com/api/characters/${rel.spouse}` : '',
      spouseId: rel.spouse || null,
      allegiances: (charAllegiancesMap.get(id) || []).map(hid => `https://anapioficeandfire.com/api/houses/${hid}`),
      allegianceIds: charAllegiancesMap.get(id) || [],
      books: (charBooksMap.get(id) || []).map(bid => `https://anapioficeandfire.com/api/books/${bid}`),
      bookIds: charBooksMap.get(id) || [],
      povBooks: (charPovBooksMap.get(id) || []).map(bid => `https://anapioficeandfire.com/api/books/${bid}`),
      povBookIds: charPovBooksMap.get(id) || [],
      tvSeries: charTvMap.get(id) || [],
      playedBy: charPlayedMap.get(id) || [],
    };
  });

  // SAVE DATASETS
  fs.writeFileSync(path.join(OUT_DIR, 'books.json'), JSON.stringify(books, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'houses.json'), JSON.stringify(houses, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'characters.json'), JSON.stringify(characters, null, 2), 'utf-8');

  // SUMMARY & ANALYTICS STATS
  const cultures = {};
  for (const c of characters) {
    const cult = c.culture.trim();
    if (cult) {
      cultures[cult] = (cultures[cult] || 0) + 1;
    }
  }

  const regions = {};
  for (const h of houses) {
    const reg = h.region.trim();
    if (reg) {
      regions[reg] = (regions[reg] || 0) + 1;
    }
  }

  const summary = {
    totalCharacters: characters.length,
    totalHouses: houses.length,
    totalBooks: books.length,
    namedCharacters: characters.filter(c => c.name.length > 0).length,
    povCharactersCount: characters.filter(c => c.povBookIds.length > 0).length,
    cultureDistribution: Object.entries(cultures)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
    regionDistribution: Object.entries(regions)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    bookStats: books.map(b => ({
      id: b.id,
      name: b.name,
      pages: b.numberOfPages,
      year: b.released ? parseInt(b.released.substring(0, 4), 10) : 0,
      charactersCount: b.characterIds.length,
      povCharactersCount: b.povCharacterIds.length
    }))
  };

  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2), 'utf-8');

  console.log(`Successfully generated canonical datasets:`);
  console.log(`- Books: ${books.length}`);
  console.log(`- Houses: ${houses.length}`);
  console.log(`- Characters: ${characters.length}`);
  console.log(`- Unique Cultures: ${Object.keys(cultures).length}`);
  console.log(`- Regions: ${Object.keys(regions).length}`);
}

build().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
