// Simple navigation service for API interceptors
class NavigationService {
  private static instance: NavigationService;
  private listeners: Array<(data: { route: string; replace: boolean }) => void> = [];

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  // Add listener for navigation events
  on(event: string, listener: (data: { route: string; replace: boolean }) => void) {
    if (event === 'navigate') {
      this.listeners.push(listener);
    }
  }

  // Remove listener
  off(event: string, listener: (data: { route: string; replace: boolean }) => void) {
    if (event === 'navigate') {
      this.listeners = this.listeners.filter(l => l !== listener);
    }
  }

  // Emit navigation events
  navigateToLogin() {
    this.listeners.forEach(listener => {
      listener({ route: '/(auth)/login', replace: true });
    });
  }

  navigateToDashboard() {
    this.listeners.forEach(listener => {
      listener({ route: '/(tabs)/dashboard', replace: true });
    });
  }

  // For web platform direct navigation
  navigateToLoginWeb() {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

export default NavigationService.getInstance();
