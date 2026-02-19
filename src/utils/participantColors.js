/**
 * Colores por participante — hardcoded en JS para que Tailwind nunca los purgue.
 * Se usan inline styles donde se necesita color dinámico.
 *
 * IDs: 1=Sheila, 2=Ale, 3=Agustín, 4=Danner
 */
export const PARTICIPANT_COLORS = {
  1: { // Sheila — violet/lila
    hex:    '#7c3aed', // violet-600
    light:  '#ede9fe', // violet-100
    text:   '#5b21b6', // violet-800
    border: '#c4b5fd', // violet-300
  },
  2: { // Ale — blue
    hex:    '#2563eb', // blue-600
    light:  '#dbeafe', // blue-100
    text:   '#1e40af', // blue-800
    border: '#93c5fd', // blue-300
  },
  3: { // Agustín — emerald
    hex:    '#059669', // emerald-600
    light:  '#d1fae5', // emerald-100
    text:   '#065f46', // emerald-800
    border: '#6ee7b7', // emerald-300
  },
  4: { // Danner — orange
    hex:    '#ea580c', // orange-600
    light:  '#ffedd5', // orange-100
    text:   '#9a3412', // orange-800
    border: '#fdba74', // orange-300
  },
};

export const getColors = (participantId) =>
  PARTICIPANT_COLORS[participantId] ?? PARTICIPANT_COLORS[1];
