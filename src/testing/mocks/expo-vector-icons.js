const React = require('react');
const { Text } = require('react-native');

function createIconMock(name) {
  const IconComponent = React.forwardRef((props, ref) => {
    return React.createElement(Text, {
      ...props,
      ref,
      testID: props.testID || `icon-${props.name || 'unknown'}`,
      children: props.name || '',
    });
  });
  IconComponent.displayName = name;
  return IconComponent;
}

module.exports = {
  MaterialCommunityIcons: createIconMock('MaterialCommunityIcons'),
  Ionicons: createIconMock('Ionicons'),
  FontAwesome: createIconMock('FontAwesome'),
  AntDesign: createIconMock('AntDesign'),
  Feather: createIconMock('Feather'),
  MaterialIcons: createIconMock('MaterialIcons'),
  createIconSet: () => createIconMock('CustomIcon'),
};
