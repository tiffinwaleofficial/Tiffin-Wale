import React from 'react';
import { ViewStyle } from 'react-native';
import { 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Camera, 
  Image as ImageIcon, 
  Upload, 
  Trash, 
  AlertCircle, 
  Info, 
  Shield, 
  Clock, 
  Mail, 
  Smartphone, 
  Phone,
  Loading,
  CheckCircle,
  Restaurant,
  Cloud,
  ChefHat,
  Home,
  ArrowLeft
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const iconMap = {
  check: Check,
  x: X,
  eye: Eye,
  'eye-off': EyeOff,
  camera: Camera,
  image: ImageIcon,
  upload: Upload,
  trash: Trash,
  'alert-circle': AlertCircle,
  info: Info,
  shield: Shield,
  clock: Clock,
  mail: Mail,
  smartphone: Smartphone,
  phone: Phone,
  loading: Loading,
  'check-circle': CheckCircle,
  restaurant: Restaurant,
  cloud: Cloud,
  'chef-hat': ChefHat,
  home: Home,
  back: ArrowLeft,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
}) => {
  const { theme } = useTheme();
  
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color || theme.colors.text}
      style={style}
    />
  );
};

export default Icon;