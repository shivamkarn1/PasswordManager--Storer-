import Footer from "./Footer";
const About = () => {
  const features = [
    { 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Enterprise-Grade Security', 
      description: 'Advanced encryption protocols ensure your passwords remain completely secure and protected.',
      highlights: ['AES-256 Encryption', 'Zero-Knowledge Architecture', 'Secure Storage']
    },
    { 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Intelligent Design System', 
      description: 'Clean, professional interface with intuitive navigation and seamless user experience.',
      highlights: ['Modern UI/UX', 'Responsive Design', 'Accessibility First']
    },
    { 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Seamless Data Management', 
      description: 'Effortlessly manage your password database with advanced import/export capabilities.',
      highlights: ['PDF Export', 'Secure Backup', 'Easy Import']
    },
    { 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Real-Time Synchronization', 
      description: 'Never lose your passwords with automatic saving and real-time updates across devices.',
      highlights: ['Auto-Save', 'Cloud Sync', 'Version Control']
    },
  ];

  const stats = [
    { number: '256', label: 'Bit Encryption', icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )},
    { number: '100%', label: 'Secure', icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    )},
    { number: '24/7', label: 'Available', icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )},
    { number: '∞', label: 'Passwords', icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Main Logo Icon */}
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-3xl shadow-2xl mb-8 animate-fade-in-up">
              <svg className="w-16 h-16 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-7xl font-black mb-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent leading-tight" style={{ fontFamily: "'Libertinus Keyboard', monospace" }}>
              ABOUT THIS VAULT.
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-source-code animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Enterprise-grade password management solution engineered for maximum security, 
              uncompromising performance, and seamless user experience.
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-white dark:text-slate-900 mx-auto">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Libertinus Keyboard', monospace" }}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-source-code">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4" style={{ fontFamily: "'Handlee', cursive" }}>
            Powerful Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-source-code animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Everything you need for secure password management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 transform hover:scale-102 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              <div className="w-16 h-16 bg-slate-900 dark:bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-white dark:text-slate-900">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4" style={{ fontFamily: "'Handlee', cursive" }}>
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 font-source-code leading-relaxed">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((highlight, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium font-source-code border border-slate-200 dark:border-slate-700"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg">
            <svg className="w-10 h-10 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4" style={{ fontFamily: "'Handlee', cursive" }}>
            Built with Modern Technology
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-source-code leading-relaxed">
            Leveraging cutting-edge technologies to deliver exceptional performance and reliability.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {['React', 'Node.js', 'MongoDB', 'Express'].map((tech, index) => (
              <div 
                key={tech}
                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
              >
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-source-code">
                  {tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default About;