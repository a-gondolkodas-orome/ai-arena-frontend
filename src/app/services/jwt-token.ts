export class JwtToken {
  static readonly TOKEN_KEY = "ai-arena-jwt-token";

  static get() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static set(token: string) {
    return localStorage.setItem(this.TOKEN_KEY, token);
  }

  static clear() {
    return localStorage.removeItem(this.TOKEN_KEY);
  }
}
