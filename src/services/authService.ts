// GitHub OAuth Authentication Service
import axios from 'axios';

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  token: string | null;
}

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = 'your-github-client-id'; // This should be configured in environment
const GITHUB_REDIRECT_URI = `${window.location.origin}/auth/callback`;
const GITHUB_SCOPES = 'user:email,read:user';

class AuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };

  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    // Check for existing authentication on initialization
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = localStorage.getItem('github_token');
    const userStr = localStorage.getItem('github_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState = {
          isAuthenticated: true,
          user,
          token
        };
        this.notifyListeners();
        
        // Verify token is still valid
        this.verifyToken();
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  // Get current auth state
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Initiate GitHub OAuth login
  initiateLogin() {
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${GITHUB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(GITHUB_SCOPES)}&` +
      `state=${this.generateState()}`;
    
    // Store state for verification
    sessionStorage.setItem('oauth_state', this.generateState());
    
    // For development, we'll simulate login with a demo user
    // In production, uncomment the next line:
    // window.location.href = authUrl;
    
    // Demo login for development
    this.simulateDemoLogin();
  }

  // Simulate demo login for development purposes
  private simulateDemoLogin() {
    const demoUser: GitHubUser = {
      id: 123456,
      login: 'mulkymalikuldhrs',
      name: 'Mulky Malikul Dhaher',
      email: 'mulky@example.com',
      avatar_url: 'https://github.com/mulkymalikuldhrs.png',
      bio: 'Indonesian Developer | Trading Terminal Creator',
      location: 'Indonesia',
      public_repos: 42,
      followers: 128,
      following: 89
    };

    const demoToken = 'demo_token_' + Date.now();

    this.authState = {
      isAuthenticated: true,
      user: demoUser,
      token: demoToken
    };

    // Store in localStorage
    localStorage.setItem('github_token', demoToken);
    localStorage.setItem('github_user', JSON.stringify(demoUser));

    this.notifyListeners();
  }

  // Handle OAuth callback
  async handleCallback(code: string, state: string): Promise<boolean> {
    try {
      const storedState = sessionStorage.getItem('oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for access token
      const tokenResponse = await this.exchangeCodeForToken(code);
      const accessToken = tokenResponse.access_token;

      // Get user info
      const user = await this.fetchUserInfo(accessToken);

      this.authState = {
        isAuthenticated: true,
        user,
        token: accessToken
      };

      // Store in localStorage
      localStorage.setItem('github_token', accessToken);
      localStorage.setItem('github_user', JSON.stringify(user));

      // Clean up
      sessionStorage.removeItem('oauth_state');
      
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  // Exchange authorization code for access token
  private async exchangeCodeForToken(code: string) {
    // Note: In production, this should be done on your backend for security
    // This is a simplified implementation for demo purposes
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET, // Should be on backend
      code,
      redirect_uri: GITHUB_REDIRECT_URI
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });

    return response.data;
  }

  // Fetch user information from GitHub API
  private async fetchUserInfo(token: string): Promise<GitHubUser> {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    return response.data;
  }

  // Verify token is still valid
  private async verifyToken() {
    if (!this.authState.token) return;

    try {
      await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${this.authState.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
    } catch (error) {
      console.warn('Token verification failed, logging out');
      this.logout();
    }
  }

  // Logout user
  logout() {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null
    };

    // Clear stored data
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    sessionStorage.removeItem('oauth_state');

    this.notifyListeners();
  }

  // Generate random state for OAuth security
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Get user's GitHub repositories (example API call)
  async getUserRepos(): Promise<any[]> {
    if (!this.authState.token) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `Bearer ${this.authState.token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          sort: 'updated',
          per_page: 10
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching repos:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
