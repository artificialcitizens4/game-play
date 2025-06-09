import { useEffect } from 'react';

const ParticleBackground = () => {
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.getElementById('particles');
      if (!particlesContainer) return;

      // Clear existing particles
      particlesContainer.innerHTML = '';

      // Create fewer, more gentle particles
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        
        // Vary particle sizes for a more organic feel
        const size = Math.random() * 6 + 3; // 3-9px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random pastel colors for particles
        const colors = ['#FFB3BA', '#BFEFFF', '#B5EAD7', '#FFDFBA', '#C7CEEA', '#FFD1DC'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Add subtle border for Studio Ghibli feel
        particle.style.border = '1px solid rgba(139, 115, 85, 0.3)';
        
        particle.style.animationDelay = Math.random() * 12 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 10) + 's'; // Slower, more gentle
        
        // Add some particles with different shapes
        if (Math.random() > 0.7) {
          particle.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%'; // Organic shape
        }
        
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();

    // Recreate particles less frequently for a calmer effect
    const interval = setInterval(createParticles, 15000);

    return () => clearInterval(interval);
  }, []);

  return <div className="particles" id="particles"></div>;
};

export default ParticleBackground;