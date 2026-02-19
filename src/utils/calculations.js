/**
 * Calcula la multa (Bs) según el porcentaje de cumplimiento.
 * @param {number} percentage - 0 a 100
 * @returns {number} multa en Bs
 */
export const calculateFine = (percentage) => {
  if (percentage === 100) return 0;
  if (percentage >= 90) return 10;
  if (percentage >= 80) return 20;
  if (percentage >= 70) return 30;
  if (percentage >= 60) return 40;
  if (percentage >= 50) return 50;
  if (percentage >= 40) return 60;
  if (percentage >= 30) return 70;
  if (percentage >= 20) return 80;
  if (percentage >= 10) return 90;
  return 100;
};

/**
 * Calcula el porcentaje de cumplimiento de un participante dado sus goals.
 * @param {Array} goals - array de goals con .current y .total
 * @returns {number} porcentaje redondeado (0-100)
 */
export const getPercentage = (goals) => {
  const totalPoints = goals.reduce((acc, goal) => acc + goal.total, 0);
  const earnedPoints = goals.reduce((acc, goal) => acc + goal.current, 0);
  return totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
};
