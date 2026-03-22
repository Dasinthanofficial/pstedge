export const getAdminInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('adminInfo') || 'null');
  } catch {
    return null;
  }
};

export const getAdminToken = () => {
  return getAdminInfo()?.token || '';
};

export const setAdminInfo = (data) => {
  localStorage.setItem('adminInfo', JSON.stringify(data));
};

export const clearAdminAuth = () => {
  localStorage.removeItem('adminInfo');
};