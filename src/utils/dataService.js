// Service for managing website data
let websiteData = null;

export const loadData = async () => {
  try {
    const response = await fetch('/src/data/data.json');
    websiteData = await response.json();
    return websiteData;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const getData = () => {
  return websiteData;
};

export const updateData = (path, value) => {
  if (!websiteData) return false;
  
  const keys = path.split('.');
  let current = websiteData;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  return true;
};

export const saveData = async () => {
  // In a real app, this would send to a backend API
  // For now, we'll simulate saving by storing in localStorage
  try {
    localStorage.setItem('usMechanicalData', JSON.stringify(websiteData));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

export const loadSavedData = () => {
  try {
    const saved = localStorage.getItem('usMechanicalData');
    if (saved) {
      websiteData = JSON.parse(saved);
      return websiteData;
    }
  } catch (error) {
    console.error('Error loading saved data:', error);
  }
  return null;
};

