export const upperTeeth = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
export const lowerTeeth = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

const labelMap = {
  '16': 'Upper Right First Molar',
  '14': 'Upper Right First Premolar',
  '13': 'Upper Right Canine',
  '11': 'Upper Right Central Incisor',
  '24': 'Upper Left First Premolar',
  '36': 'Lower Left First Molar',
  '41': 'Lower Right Central Incisor',
};

export const getToothType = (toothNumber) => {
  const numeric = Number(toothNumber.slice(1));
  if (numeric >= 6) return 'molar';
  if (numeric >= 4) return 'premolar';
  if (numeric === 3) return 'canine';
  return 'incisor';
};

export const getToothLabel = (toothNumber) => `${labelMap[toothNumber] || 'Tooth'} (#${toothNumber})`;
