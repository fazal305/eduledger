export function computeGrade(obtainedMarks, maxMarks) {
  const percentage = (obtainedMarks / maxMarks) * 100
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 60) return 'C'
  if (percentage >= 50) return 'D'
  return 'F'
}
