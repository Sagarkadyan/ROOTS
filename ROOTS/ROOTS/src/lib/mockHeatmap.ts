// Generate 364 days of mock data - all zeroed out
export const getMockHeatmapData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    data.push({
      date: d,
      activity: 0,
      sessions: 0,
      xp: 0,
    });
  }
  
  return data;
};
