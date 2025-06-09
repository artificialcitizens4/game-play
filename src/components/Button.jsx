import { Button as AntButton } from 'antd';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false,
  icon,
  size = 'large',
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

  return (
    <AntButton 
      type={getButtonType()}
      size={size}
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled}
      icon={icon}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;