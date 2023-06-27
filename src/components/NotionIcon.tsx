import { Avatar } from '@mui/material';
import { IconProp, IconType } from '../utils/types';

interface NotionIconProps {
  iconProp: IconProp | null;
}

export default function NotionIcon(props: NotionIconProps) {
  const renderIconFragment = () => {
    if (!props.iconProp) return <Avatar sx={{ backgroundColor: 'transparent' }}>📄</Avatar>;
    switch (props.iconProp.type) {
      case IconType.emoji:
        return <Avatar sx={{ backgroundColor: 'transparent' }}>{props.iconProp.emoji}</Avatar>;
      case IconType.external:
        return <Avatar src={props.iconProp.external?.url} />;
    }
  };

  return <>{renderIconFragment()}</>;
}
