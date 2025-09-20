import Loader from './Loader';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className="transform animate-pulse">
          <img 
            src="/bluelogo.png" 
            alt="Shivam's Vault Logo" 
            className="w-32 h-32 rounded-2xl shadow-2xl shadow-blue-500/30 border-2 border-blue-400/30"
          />
        </div>
        
        {/* Animated Loader */}
        <div className="transform scale-110">
          <Loader />
        </div>
        
        {/* Title and Loading Text */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white font-mono tracking-wider">
            Shivam's Vault
          </h1>
          <p className="text-blue-300 font-mono text-lg animate-pulse">
            Initializing secure vault...
          </p>
          
          {/* Loading Bar */}
          <div className="w-80 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
              style={{
                animation: 'loadingBar 2.5s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>
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