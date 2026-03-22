export const getAdminInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('adminInfo') || 'null');
  } catch {
    return null;
  }
};

export const setAdminInfo = (data) => {
  const safeData = {
    _id: data?._id,
    email: data?.email,
    role: data?.role
  };

  localStorage.setItem('adminInfo', JSON.stringify(safeData));
};

export const clearAdminAuth = () => {
  localStorage.removeItem('adminInfo');
};