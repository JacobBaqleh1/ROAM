import * as SecureStore from 'expo-secure-store';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { router } from 'expo-router';

const TOKEN_KEY = 'id_token';

interface ExtendedJwt extends JwtPayload {
  data: {
    username: string;
    email: string;
    id: string;
  };
}

class AuthService {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }

  async loggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded?.exp && decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async getProfile(): Promise<ExtendedJwt | null> {
    const token = await this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<ExtendedJwt>(token);
    } catch {
      return null;
    }
  }

  async login(idToken: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, idToken);
    router.replace('/');
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    router.replace('/login');
  }
}

export default new AuthService();
