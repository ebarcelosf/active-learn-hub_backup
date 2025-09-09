export function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem('ALH_users')) || [];
  } catch (err) {
    console.warn('getStoredUsers error', err);
    return [];
  }
}

export function saveStoredUsers(users) {
  try {
    localStorage.setItem('ALH_users', JSON.stringify(users));
  } catch (err) {
    console.warn('saveStoredUsers error', err);
  }
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('ALH_user')) || null;
  } catch (err) {
    console.warn('getCurrentUser error', err);
    return null;
  }
}

export function setCurrentUser(user) {
  try {
    if (user) localStorage.setItem('ALH_user', JSON.stringify(user));
    else localStorage.removeItem('ALH_user');
  } catch (err) {
    console.warn('setCurrentUser error', err);
  }
}

// NOTE: this is a prototype helper; in production you must never store plaintext passwords.
