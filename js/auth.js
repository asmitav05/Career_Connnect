/**
 * CareerConnect Client Authentication Service
 * Manages user registration, login, Google Sign-In (GIS), session persistence,
 * password resets, and user profile synchronization.
 */

const AUTH_STORAGE_KEYS = {
  TOKEN: 'careerconnect_auth_token',
  USER: 'careerconnect_user',
  REMEMBER_ME: 'careerconnect_remember_me'
};

/**
 * Safely parses API responses, ensuring non-JSON or HTML error responses
 * (like Vercel 404/500/502 pages) do not crash the client with SyntaxError: Unexpected token.
 */
async function safeJson(response, defaultErrorMessage = 'Request failed.') {
  const contentType = response.headers ? (response.headers.get('content-type') || '') : '';
  let data = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  } else {
    // Non-JSON response (e.g. HTML error page or plain text)
    try {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = null;
      }
    } catch (e) {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMsg = (data && data.error)
      ? data.error
      : (data && data.message)
        ? data.message
        : (response.status === 404)
          ? 'The requested authentication service was not found (404). Please check the backend deployment.'
          : `${defaultErrorMessage} (HTTP ${response.status})`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    if (data && data.isGoogleAccount) {
      err.isGoogleAccount = true;
    }
    throw err;
  }

  if (!data) {
    throw new Error('Unexpected response format received from server.');
  }

  return data;
}

export const AuthService = {
  // Configurable Google Client ID - Replace with your Google Cloud Console Client ID
  GOOGLE_CLIENT_ID: '918382749281-careerconnect.apps.googleusercontent.com',

  getToken() {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  getUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER) || sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
    }

    // Fallback: check legacy demo session if real account not found
    try {
      const demo = localStorage.getItem('careerpath_demo_session');
      if (demo) {
        const d = JSON.parse(demo);
        if (d && d.name) {
          return {
            id: 'usr_demo',
            name: d.name,
            email: d.email || 'student@careerconnect.local',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(d.name)}&backgroundColor=4f46e5`,
            isDemo: true
          };
        }
      }
    } catch (e) {}

    return null;
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return Boolean(token && user);
  },

  setSession(token, user, rememberMe = true) {
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, 'true');
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
      sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
    }

    // Sync user name with student profile if student profile exists
    try {
      const currentProfile = JSON.parse(localStorage.getItem('careerpath_student_profile') || '{}');
      currentProfile.name = user.name;
      currentProfile.email = user.email;
      localStorage.setItem('careerpath_student_profile', JSON.stringify(currentProfile));
    } catch (e) {}

    // Dispatch global event
    window.dispatchEvent(new CustomEvent('careerpath:authChanged', { detail: { user, token } }));
  },

  clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);

    // Also clear demo session to avoid confusion
    localStorage.removeItem('careerpath_demo_session');

    window.dispatchEvent(new CustomEvent('careerpath:authChanged', { detail: { user: null, token: null } }));
  },

  async register(name, email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: (name || '').trim(), email: normalizedEmail, password })
    });

    const data = await safeJson(response, 'Failed to create account.');
    this.setSession(data.token, data.user, true);
    return data.user;
  },

  async login(email, password, rememberMe = true) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password, rememberMe })
    });

    const data = await safeJson(response, 'Login failed. Please check your credentials.');
    this.setSession(data.token, data.user, rememberMe);
    return data.user;
  },

  async loginWithGoogle(credentialOrPayload) {
    let payload = {};
    if (typeof credentialOrPayload === 'string') {
      payload = { credential: credentialOrPayload };
    } else {
      payload = credentialOrPayload;
    }

    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await safeJson(response, 'Google authentication failed.');
    this.setSession(data.token, data.user, true);
    return data.user;
  },

  async forgotPassword(email) {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    return await safeJson(response, 'Unable to process password reset request.');
  },

  async resetPassword(token, newPassword) {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    return await safeJson(response, 'Password reset failed.');
  },

  async fetchCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearSession();
        }
        return null;
      }

      const data = await safeJson(response, 'Failed to fetch current user.');
      if (data && data.user) {
        const rememberMe = localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === 'true';
        this.setSession(token, data.user, rememberMe);
        return data.user;
      }
    } catch (err) {
      console.warn('Error fetching current user:', err);
    }
    return this.getUser();
  },

  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.warn('Logout server request failed:', err);
      }
    }
    this.clearSession();
  },

  /**
   * Initializes Google Identity Services (GIS) button or prompt
   */
  initGoogleAuth(containerId, onSuccess, onError) {
    const clientId = this.GOOGLE_CLIENT_ID;

    const renderGIS = () => {
      if (typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            if (response.credential) {
              const user = await this.loginWithGoogle(response.credential);
              if (onSuccess) onSuccess(user);
            }
          } catch (err) {
            if (onError) onError(err);
          }
        },
        auto_select: false
      });

      const container = document.getElementById(containerId);
      if (container) {
        window.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center'
        });
      }
    };

    if (typeof window.google !== 'undefined' && window.google.accounts) {
      renderGIS();
    } else {
      // Dynamic load GIS script
      const scriptId = 'google-gis-sdk';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => renderGIS();
        document.head.appendChild(script);
      }
    }
  }
};
