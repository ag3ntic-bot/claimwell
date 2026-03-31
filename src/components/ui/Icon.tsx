/**
 * Icon component
 *
 * Wraps MaterialCommunityIcons from @expo/vector-icons with a name mapping
 * from Material Symbols Outlined names to MaterialCommunityIcons equivalents.
 */

import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';
import { colors } from '@/theme';

/**
 * Maps Material Symbols Outlined icon names to MaterialCommunityIcons names.
 * Extend this map as needed when new icons are used in the app.
 */
const ICON_MAP: Record<string, string> = {
  // Navigation
  home: 'home',
  home_filled: 'home',
  menu: 'menu',
  close: 'close',
  arrow_back: 'arrow-left',
  arrow_forward: 'arrow-right',
  chevron_left: 'chevron-left',
  chevron_right: 'chevron-right',
  expand_more: 'chevron-down',
  expand_less: 'chevron-up',

  // Actions
  add: 'plus',
  add_circle: 'plus-circle',
  edit: 'pencil',
  delete: 'delete',
  search: 'magnify',
  filter_list: 'filter-variant',
  sort: 'sort',
  refresh: 'refresh',
  share: 'share-variant',
  copy: 'content-copy',
  check: 'check',
  check_circle: 'check-circle',

  // Communication
  notifications: 'bell',
  notifications_none: 'bell-outline',
  email: 'email',
  chat: 'chat',
  comment: 'comment',

  // Content
  description: 'file-document',
  article: 'newspaper',
  folder: 'folder',
  attachment: 'paperclip',
  upload: 'upload',
  download: 'download',
  image: 'image',
  picture_as_pdf: 'file-pdf-box',

  // Social
  person: 'account',
  person_outline: 'account-outline',
  group: 'account-group',
  settings: 'cog',
  logout: 'logout',

  // Status
  info: 'information',
  warning: 'alert',
  error: 'alert-circle',
  help: 'help-circle',
  schedule: 'clock-outline',
  pending: 'clock-outline',
  verified: 'check-decagram',

  // Health / Claims specific
  medical_services: 'medical-bag',
  local_hospital: 'hospital-building',
  receipt_long: 'receipt',
  policy: 'shield-check',
  gavel: 'gavel',
  analytics: 'chart-bar',
  insights: 'lightbulb-on',
  trending_up: 'trending-up',
  attach_money: 'currency-usd',
  account_balance: 'bank',

  // Misc
  star: 'star',
  star_outline: 'star-outline',
  favorite: 'heart',
  favorite_border: 'heart-outline',
  visibility: 'eye',
  visibility_off: 'eye-off',
  lock: 'lock',
  lock_open: 'lock-open',
  link: 'link',
  calendar_today: 'calendar',
  place: 'map-marker',
  phone: 'phone',
  camera: 'camera',
  flash_on: 'flash',
  security: 'shield-lock',
  psychology: 'head-cog',
  more_vert: 'dots-vertical',
  more_horiz: 'dots-horizontal',
  tune: 'tune',
  empty: 'circle-outline',

  // Claims & Payments
  payments: 'cash-multiple',
  local_shipping: 'truck-delivery',
  build_circle: 'wrench',
  cancel: 'close-circle',
  package_2: 'package-variant-closed',
  priority_high: 'alert-decagram',
  mail: 'email-outline',
  forum: 'forum',
  attach_file: 'paperclip',
  photo_library: 'image-multiple',
};

type MaterialCommunityIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface IconProps {
  /** Material Symbols Outlined name (e.g. "home", "notifications") */
  name: string;
  /** Icon size in dp. Default 24. */
  size?: number;
  /** Icon color. Default onSurface. */
  color?: string;
  /** If true, uses a filled variant when available. */
  filled?: boolean;
  /** Optional style overrides */
  style?: StyleProp<TextStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.onSurface,
  filled = false,
  style,
  accessibilityLabel,
}) => {
  // Try filled variant first if requested
  const filledKey = `${name}_filled`;
  const lookupKey = filled && ICON_MAP[filledKey] ? filledKey : name;
  const mappedName = (ICON_MAP[lookupKey] ?? name) as MaterialCommunityIconName;

  return (
    <MaterialCommunityIcons
      name={mappedName}
      size={size}
      color={color}
      style={style}
      accessibilityLabel={accessibilityLabel ?? name.replace(/_/g, ' ')}
      accessibilityRole="image"
    />
  );
};
