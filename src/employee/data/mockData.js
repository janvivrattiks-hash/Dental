export const employeeStats = [
  { label: 'Total Cases', value: 42 },
  { label: 'Completed', value: 21 },
  { label: 'In Progress', value: 16 },
  { label: 'Plan', value: 'Pro' },
];

export const recentCases = [
  { id: 'PF-7732', patient: 'Neha Patel', age: 36, teeth: '14, 15', date: '2026-04-12', status: 'In Progress' },
  { id: 'PF-7701', patient: 'Raj Shah', age: 41, teeth: '24', date: '2026-04-11', status: 'Completed' },
  { id: 'PF-7688', patient: 'Aarav Mehta', age: 52, teeth: '36, 37', date: '2026-04-09', status: 'Pending' },
];

export const adminAnalogLibrary = [
  { id: 'sb-1', name: 'Nobel Uni Scan Body 3.5mm', brand: 'Nobel', size: '3.5mm' },
  { id: 'sb-2', name: 'Straumann Mono 4.0mm', brand: 'Straumann', size: '4.0mm' },
  { id: 'sb-3', name: 'Dio Scan Marker 3.8mm', brand: 'Dio', size: '3.8mm' },
  { id: 'sb-4', name: 'Osstem Transfer Body 4.5mm', brand: 'Osstem', size: '4.5mm' },
];

export const scanBodies = adminAnalogLibrary;

export const adminReferenceFiles = [
  { id: 'out-angle', name: 'Reference Output Angle File' },
  { id: 'rot-index', name: 'Rotational Index File' },
];

export const subscriptionPlans = [
  { name: 'Free', limit: 5, price: '$0', highlight: false },
  { name: 'Pro', limit: 50, price: '$199', highlight: true },
  { name: 'Clinic', limit: 'Unlimited', price: '$499', highlight: false },
];
