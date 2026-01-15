// dashboardTheme.ts

// Theme configuration for dark mode and light mode

const theme = {
  dark: {
    colors: {
      background: 'rgb(18, 18, 18)', // Dark background color
      primary: 'rgb(255, 255, 255)', // Primary text color
      secondary: 'rgb(200, 200, 200)', // Secondary text color
    },
    gradients: {
      background: 'linear-gradient(90deg, rgba(18, 18, 18, 1) 0%, rgba(40, 40, 40, 1) 100%)',
    },
    shadows: {
      default: '0 4px 8px rgba(0, 0, 0, 0.5)',
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px',
    },
    animations: {
      fadeIn: 'opacity: 0; transition: opacity 0.5s ease-in-out; opacity: 1;'
    }
  },
  light: {
    colors: {
      background: 'rgb(255, 255, 255)', // Light background color
      primary: 'rgb(0, 0, 0)', // Primary text color
      secondary: 'rgb(100, 100, 100)', // Secondary text color
    },
    gradients: {
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(230, 230, 230, 1) 100%)',
    },
    shadows: {
      default: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px',
    },
    animations: {
      fadeIn: 'opacity: 0; transition: opacity 0.5s ease-in-out; opacity: 1;'
    }
  },
};

export default theme;
