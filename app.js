/* GURPS 4e Interactive Character Sheet - JavaScript Engine */

// GURPS 4e Damage Lookup Table by ST
const GURPS_DAMAGE_TABLE = {
  1:  { gdp: "1d-6", bal: "1d-5" },
  2:  { gdp: "1d-6", bal: "1d-5" },
  3:  { gdp: "1d-5", bal: "1d-4" },
  4:  { gdp: "1d-5", bal: "1d-4" },
  5:  { gdp: "1d-4", bal: "1d-3" },
  6:  { gdp: "1d-4", bal: "1d-3" },
  7:  { gdp: "1d-3", bal: "1d-2" },
  8:  { gdp: "1d-3", bal: "1d-2" },
  9:  { gdp: "1d-2", bal: "1d-1" },
  10: { gdp: "1d-2", bal: "1d" },
  11: { gdp: "1d-1", bal: "1d+1" },
  12: { gdp: "1d-1", bal: "1d+2" },
  13: { gdp: "1d",   bal: "2d-1" },
  14: { gdp: "1d",   bal: "2d" },
  15: { gdp: "1d+1", bal: "2d+1" },
  16: { gdp: "1d+1", bal: "2d+2" },
  17: { gdp: "1d+2", bal: "3d-1" },
  18: { gdp: "1d+2", bal: "3d" },
  19: { gdp: "2d-1", bal: "3d+1" },
  20: { gdp: "2d-1", bal: "3d+2" },
  21: { gdp: "2d",   bal: "4d-1" },
  22: { gdp: "2d",   bal: "4d" },
  23: { gdp: "2d+1", bal: "4d+1" },
  24: { gdp: "2d+1", bal: "4d+2" },
  25: { gdp: "2d+2", bal: "5d-1" },
  26: { gdp: "2d+2", bal: "5d" },
  27: { gdp: "3d-1", bal: "5d+1" },
  28: { gdp: "3d-1", bal: "5d+2" },
  29: { gdp: "3d",   bal: "6d-1" },
  30: { gdp: "3d",   bal: "6d" }
};

let autoCalcEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadLocalDraft();
  calculateAllStats();
});

function setupEventListeners() {
  // Input change triggers recalculation
  document.addEventListener('input', (e) => {
    if (e.target.matches('.calc-trigger')) {
      calculateAllStats();
    }
    if (e.target.matches('.equip-calc')) {
      calculateEquipmentTotals();
    }
    if (e.target.matches('.xp-calc')) {
      calculatePointTotals();
    }
    saveLocalDraft();
  });

  // Toggle Auto-Calc
  const autoCalcToggle = document.getElementById('autoCalcToggle');
  if (autoCalcToggle) {
    autoCalcToggle.addEventListener('change', (e) => {
      autoCalcEnabled = e.target.checked;
      if (autoCalcEnabled) calculateAllStats();
    });
  }

  // Silhouette Toggle
  const silhouetteSelect = document.getElementById('silhouetteSelect');
  if (silhouetteSelect) {
    silhouetteSelect.addEventListener('change', (e) => {
      const img = document.getElementById('silhouetteImg');
      if (e.target.value === 'female') {
        img.src = 'assets/female_body.svg';
      } else if (e.target.value === 'male') {
        img.src = 'assets/male_body.svg';
      }
    });
  }

  // Custom Avatar Upload
  const avatarUpload = document.getElementById('avatarUpload');
  if (avatarUpload) {
    avatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          document.getElementById('silhouetteImg').src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Trackers (Circles) Toggle
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tracker-dot')) {
      e.target.classList.toggle('active');
    }
  });
}

// Calculate Stats according to GURPS 4e Rules
function calculateAllStats() {
  if (!autoCalcEnabled) return;

  const getNum = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  const st = getNum('st_val');
  const dx = getNum('dx_val');
  const iq = getNum('iq_val');
  const ht = getNum('ht_val');

  // Secondary Stats Defaults
  const pvMod = getNum('pv_mod');
  const pvVal = st + pvMod;
  setVal('pv_val', pvVal);
  setVal('pv_metade', Math.floor(pvVal / 2));
  setVal('pv_terco', Math.floor(pvVal / 3));

  const perMod = getNum('per_mod');
  setVal('per_val', iq + perMod);

  const vonMod = getNum('von_mod');
  setVal('von_val', iq + vonMod);

  const fadMod = getNum('fad_mod');
  setVal('fad_val', ht + fadMod);

  // Terciary Stats
  const velMod = getNum('vel_mod');
  const velBasica = (ht + dx) / 4 + velMod;
  setVal('vel_basica', velBasica.toFixed(2));

  const deslMod = getNum('desl_mod');
  const deslBasico = Math.floor(velBasica) + deslMod;
  setVal('desl_basico', deslBasico);

  // Base de Carga: (ST * ST) / 10 kg
  const baseCarga = Math.round((st * st) / 10 * 10) / 10;
  setVal('base_carga', baseCarga);
  setVal('st_levantar', baseCarga * 8);

  // GDP / BAL Damage Lookup
  const stClamped = Math.max(1, Math.min(30, Math.round(st)));
  if (GURPS_DAMAGE_TABLE[stClamped]) {
    setVal('gdp_val', GURPS_DAMAGE_TABLE[stClamped].gdp);
    setVal('bal_val', GURPS_DAMAGE_TABLE[stClamped].bal);
  }

  // Active Defenses: Esquiva = floor(Velocidade Básica) + 3
  const esquiva = Math.floor(velBasica) + 3;
  setVal('esquiva_val', esquiva);

  // Update Fatigue & Encumbrance Table
  setVal('bc_nula', `${baseCarga} kg`);
  setVal('bc_leve', `${baseCarga * 2} kg`);
  setVal('bc_media', `${baseCarga * 3} kg`);
  setVal('bc_pesada', `${baseCarga * 6} kg`);
  setVal('bc_mtpesada', `${baseCarga * 10} kg`);

  setVal('esq_nula', esquiva);
  setVal('esq_leve', esquiva - 1);
  setVal('esq_media', esquiva - 2);
  setVal('esq_pesada', esquiva - 3);
  setVal('esq_mtpesada', esquiva - 4);

  calculateEquipmentTotals();
  calculatePointTotals();
}

// Equipment Totals Calculation
function calculateEquipmentTotals() {
  const rows = document.querySelectorAll('#equipTable tbody tr');
  let totalCost = 0;
  let totalWeight = 0;

  rows.forEach(row => {
    const quant = parseFloat(row.querySelector('.eq-quant')?.value) || 0;
    const cost = parseFloat(row.querySelector('.eq-cost')?.value) || 0;
    const weight = parseFloat(row.querySelector('.eq-weight')?.value) || 0;

    totalCost += quant * cost;
    totalWeight += quant * weight;
  });

  const costEl = document.getElementById('total_equip_cost');
  const weightEl = document.getElementById('total_equip_weight');
  if (costEl) costEl.textContent = `$ ${totalCost.toFixed(2)}`;
  if (weightEl) weightEl.textContent = `${totalWeight.toFixed(2)} kg`;
}

// Resumo dos Pontos (XP Total)
function calculatePointTotals() {
  const getNum = (id) => parseFloat(document.getElementById(id)?.value) || 0;

  const xpPrimary = (getNum('st_xp') + getNum('dx_xp') + getNum('iq_xp') + getNum('ht_xp'));
  const xpSecondary = (getNum('pv_xp') + getNum('per_xp') + getNum('von_xp') + getNum('fad_xp'));
  const xpTerciary = (getNum('vel_xp') + getNum('desl_xp') + getNum('gdp_xp') + getNum('carga_xp'));

  let xpSkills = 0;
  document.querySelectorAll('.skill-xp').forEach(el => xpSkills += parseFloat(el.value) || 0);

  let xpAdv = 0;
  document.querySelectorAll('.adv-xp').forEach(el => xpAdv += parseFloat(el.value) || 0);

  let xpDisadv = 0;
  document.querySelectorAll('.disadv-xp').forEach(el => xpDisadv += parseFloat(el.value) || 0);

  const totalXP = xpPrimary + xpSecondary + xpTerciary + xpSkills + xpAdv + xpDisadv;

  const setSummary = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setSummary('sum_primarios', xpPrimary);
  setSummary('sum_secundarios', xpSecondary);
  setSummary('sum_terciarios', xpTerciary);
  setSummary('sum_pericias', xpSkills);
  setSummary('sum_vantagens', xpAdv);
  setSummary('sum_desvantagens', xpDisadv);
  setSummary('sum_total', totalXP);

  const xpTotalField = document.getElementById('xp_total_header');
  if (xpTotalField) xpTotalField.value = totalXP;
}

// Add Rows to Tables dynamically
function addTableRow(tableId, htmlTemplate) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  const newRow = document.createElement('tr');
  newRow.innerHTML = htmlTemplate;
  tbody.appendChild(newRow);
  calculateAllStats();
}

function removeTableRow(btn) {
  const row = btn.closest('tr');
  if (row) {
    row.remove();
    calculateAllStats();
  }
}

// Save Character to JSON file
function exportCharacterJSON() {
  const data = {};
  document.querySelectorAll('input[id], textarea[id], select[id]').forEach(el => {
    if (el.type === 'checkbox') {
      data[el.id] = el.checked;
    } else {
      data[el.id] = el.value;
    }
  });

  // Trackers
  const trackers = [];
  document.querySelectorAll('.tracker-dot').forEach((dot, idx) => {
    if (dot.classList.contains('active')) trackers.push(idx);
  });
  data['_trackers'] = trackers;

  const charName = document.getElementById('personagem_nome')?.value || 'personagem_gurps';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${charName.toLowerCase().replace(/\s+/g, '_')}_ficha.json`;
  a.click();
}

// Import Character from JSON file
function importCharacterJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(key => {
        if (key === '_trackers') {
          document.querySelectorAll('.tracker-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', data[key].includes(idx));
          });
          return;
        }
        const el = document.getElementById(key);
        if (el) {
          if (el.type === 'checkbox') {
            el.checked = data[key];
          } else {
            el.value = data[key];
          }
        }
      });
      calculateAllStats();
      alert('Ficha carregada com sucesso!');
    } catch (err) {
      alert('Erro ao carregar o arquivo JSON. Verifique se o arquivo é uma ficha válida.');
    }
  };
  reader.readAsText(file);
}

// Print / Export to PDF
function printSheet() {
  window.print();
}

// Auto-Save Draft to LocalStorage
function saveLocalDraft() {
  const data = {};
  document.querySelectorAll('input[id], textarea[id], select[id]').forEach(el => {
    if (el.type === 'checkbox') {
      data[el.id] = el.checked;
    } else {
      data[el.id] = el.value;
    }
  });
  const trackers = [];
  document.querySelectorAll('.tracker-dot').forEach((dot, idx) => {
    if (dot.classList.contains('active')) trackers.push(idx);
  });
  data['_trackers'] = trackers;

  localStorage.setItem('gurps_character_draft', JSON.stringify(data));
}

// Load Draft from LocalStorage
function loadLocalDraft() {
  const saved = localStorage.getItem('gurps_character_draft');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    Object.keys(data).forEach(key => {
      if (key === '_trackers') {
        document.querySelectorAll('.tracker-dot').forEach((dot, idx) => {
          dot.classList.toggle('active', data[key].includes(idx));
        });
        return;
      }
      const el = document.getElementById(key);
      if (el) {
        if (el.type === 'checkbox') {
          el.checked = data[key];
        } else {
          el.value = data[key];
        }
      }
    });
  } catch (e) {}
}

