import { Button as AntButton } from 'antd';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false,
  icon,
  size = 'large',
  soundEffect = 'buttonClick',
  ...props
}) => {
  const getButtonType = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'save':
        return 'primary';
      case 'launch':
        return 'primary';
      default:
        return 'primary';
    }
  };

  const getButtonClass = () => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    return `${baseClass} ${variantClass} ${className}`.trim();
  };

  const handleClick = (e) => {
    // Play sound effect
    if (window.playWarSound && soundEffect) {
      // Different sounds for different button types
      let sound = 'buttonClick';
      if (variant === 'launch') {
        sound = 'warStart';
      } else if (variant === 'save') {
        sound = 'saveCharacter';
      } else if (className.includes('character') || className.includes('experience')) {
        sound = 'characterSelect';
      }
      
      window.playWarSound(sound);
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <AntButton 
      type={getButtonType()}
      size={size}
      className={getButtonClass()}
      onClick={handleClick}
      disabled={disabled}
      icon={icon}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;