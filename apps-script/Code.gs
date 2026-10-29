/**
 * ഉണർവ് (Unarv) – registration backend
 * Saves each website registration as a row in this Google Sheet
 * (Payment screenshots are sent on WhatsApp, not stored here.)
 *
 * Setup: open your Google Sheet → Extensions → Apps Script → paste this →
 * Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy.
 * Copy the Web app URL into CONFIG.SCRIPT_URL in index.html.
 */
const SHEET_NAME = 'Website Registrations';

const COLUMNS = [
  ['timestamp', 'സമയം'],
  ['name', 'പേര്'], ['age', 'പ്രായം'], ['phone', 'ഫോൺ (WhatsApp)'], ['email', 'ഇമെയിൽ'],
  ['place', 'സ്ഥലം'], ['occupation', 'തൊഴിൽ'],
  ['height', 'ഉയരം (cm)'], ['weight', 'ഭാരം (kg)'], ['bmi', 'BMI'], ['waist', 'അരവണ്ണം (cm)'],
  ['conditions', 'രോഗങ്ങൾ'], ['conditions_other', 'മറ്റ് രോഗങ്ങൾ'],
  ['on_meds', 'മരുന്ന്?'], ['meds', 'മരുന്നുകൾ'], ['insulin', 'ഇൻസുലിൻ'],
  ['menstrual', 'ആർത്തവം'], ['pregnant', 'ഗർഭം / മുലയൂട്ടൽ'],
  ['surgery', 'ശസ്ത്രക്രിയ / ആശുപത്രി'], ['allergies', 'അലർജി'], ['labs', 'പരിശോധനാ ഫലങ്ങൾ'],
  ['diet', 'ഭക്ഷണരീതി'], ['exercise', 'വ്യായാമം'], ['sleep', 'ഉറക്കം'], ['stress', 'സമ്മർദ്ദം (1–5)'],
  ['times', 'സൗകര്യപ്രദമായ സമയം'], ['days', 'സൗകര്യപ്രദമായ ദിവസം'], ['meet_ok', 'Google Meet'],
  ['source', 'എങ്ങനെ അറിഞ്ഞു'],
  ['goals', 'ലക്ഷ്യങ്ങൾ'], ['barrier', 'തടസ്സം'], ['expectation', 'പ്രതീക്ഷ'], ['doctor_note', 'ഡോക്ടറോട്'],
  ['fee', 'ഫീസ്'], ['consent', 'സമ്മതം'],
  ['verified', 'ഫീസ് ലഭിച്ചു ✓'], ['added_to_group', 'ഗ്രൂപ്പിൽ ചേർത്തു ✓']
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (!d.name || !d.phone) return json({ ok: false, error: 'missing name or phone' });

    const sheet = getSheet();
    const h = parseFloat(d.height), w = parseFloat(d.weight);
    const bmi = h && w ? Math.round((w / Math.pow(h / 100, 2)) * 10) / 10 : '';

    const row = COLUMNS.map(([k]) => {
      if (k === 'timestamp') return new Date();
      if (k === 'bmi') return bmi;
      if (k === 'consent') return d.consent ? 'സമ്മതിച്ചു' : '';
      if (k === 'verified' || k === 'added_to_group') return false;
      const v = d[k];
      return Array.isArray(v) ? v.join(', ') : (v == null ? '' : String(v));
    });
    sheet.appendRow(row);
    const r = sheet.getLastRow();
    sheet.getRange(r, COLUMNS.length - 1, 1, 2).insertCheckboxes();
    if (d.phone) sheet.getRange(r, 4).setNumberFormat('@').setValue(String(d.phone));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, message: 'Unarv registration endpoint is running' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS.map(c => c[1]));
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#12564A').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor (▶ Run → setup) to create the sheet headers and approve permissions. */
function setup() {
  getSheet();
}
