import { useEffect } from 'react';

const ParticleBackground = () => {
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.getElementById('particles');
      if (!particlesContainer) return;

      // Clear existing particles
      particlesContainer.innerHTML = '';

      // Create minimal, abstract particles for observer atmosphere
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        
        // Small, subtle particles
        const size = Math.random() * 3 + 1; // 1-4px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Minimal color palette - teal and electric blue
        const colors = ['#3B8C91', '#45B1E3'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Some particles as small geometric shapes
        if (Math.random() > 0.6) {
          particle.style.borderRadius = '0'; // Square particles
          particle.style.transform = 'rotate(45deg)'; // Diamond shape
        }
        
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's'; // Very slow, contemplative
        
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();

    // Recreate particles very infrequently for minimal distraction
    const interval = setInterval(createParticles, 25000);

    return () => clearInterval(interval);
  }, []);

  return <div className="particles" id="particles"></div>;
};

export default ParticleBackground;