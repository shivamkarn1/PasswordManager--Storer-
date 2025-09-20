import Loader from './Loader';
import { useTheme } from './ThemeContext';

const LoadingScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500 ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      {/* Background Pattern - Dark Theme */}
      {isDark && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-cyan-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
      )}

      {/* Background Pattern - Light Theme */}
      {!isDark && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/6 w-48 h-48 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className="transform animate-pulse">
          <img 
            src="/bluelogo.png" 
            alt="Shivam's Vault Logo" 
            className={`w-32 h-32 rounded-2xl shadow-2xl border-2 transition-all duration-500 ${
              isDark 
                ? 'shadow-blue-500/30 border-blue-400/30' 
                : 'shadow-blue-500/20 border-blue-300/50 bg-white/80 backdrop-blur-sm'
            }`}
          />
        </div>
        
        {/* Animated Loader */}
        <div className="transform scale-110">
          <Loader />
        </div>
        
        {/* Title and Loading Text */}
        <div className="text-center space-y-3">
          <h1 className={`text-3xl font-bold font-mono tracking-wider transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Shivam's Vault
          </h1>
          <p className={`font-mono text-lg animate-pulse transition-colors duration-500 ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}>
            Initializing secure vault...
          </p>
          
          {/* Loading Bar */}
          <div className={`w-80 h-1 rounded-full overflow-hidden transition-colors duration-500 ${
            isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-blue-400 to-purple-500'
              }`}
              style={{
                animation: 'loadingBar 2.5s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>

        {/* Premium Accent Elements */}
        <div className="flex space-x-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full animate-bounce transition-colors duration-500 ${
                isDark ? 'bg-blue-400' : 'bg-blue-500'
              }`}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Floating Elements for Premium Feel */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-ping transition-colors duration-500 ${
              isDark ? 'bg-blue-400/30' : 'bg-blue-500/20'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          ></div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            transform: translateX(100%);
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;