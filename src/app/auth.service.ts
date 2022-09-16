export class AuthService {
  static readonly JWT_TOKEN_KEY = "jwt";

  static getToken() {
    return localStorage.getItem(AuthService.JWT_TOKEN_KEY);
  }

  static saveToken(token: string) {
    localStorage.setItem(AuthService.JWT_TOKEN_KEY, token);
  }

  static clearToken() {
    localStorage.removeItem(AuthService.JWT_TOKEN_KEY);
  }
}
