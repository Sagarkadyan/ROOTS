// Generate 364 days of mock data
// Recent 60 days: higher activity values (2-4)
// Middle period: medium activity (0-3)  
// Older period: sparse (0-2)
// Values: 0 = empty, 1 = light, 2 = medium, 3 = active, 4 = most active

export const getMockHeatmapData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    let activity = 0;
    if (i < 60) {
      activity = Math.floor(Math.random() * 3) + 2; // 2-4
      if (Math.random() > 0.8) activity = 0; // some empty days
    } else if (i < 180) {
      activity = Math.floor(Math.random() * 4); // 0-3
    } else {
      activity = Math.floor(Math.random() * 3); // 0-2
      if (Math.random() > 0.5) activity = 0;
    }
    
    data.push({
      date: d,
      activity: activity,
      sessions: activity > 0 ? Math.floor(Math.random() * 3) + 1 : 0,
      xp: activity * 35,
    });
  }
  
  return data;
};
