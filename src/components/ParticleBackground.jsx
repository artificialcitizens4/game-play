import { useEffect } from 'react';

const ParticleBackground = () => {
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.getElementById('particles');
      if (!particlesContainer) return;

      // Clear existing particles
      particlesContainer.innerHTML = '';

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();

    // Recreate particles periodically for continuous effect
    const interval = setInterval(createParticles, 10000);

    return () => clearInterval(interval);
  }, []);

  return <div className="particles" id="particles"></div>;
};

export default ParticleBackground;