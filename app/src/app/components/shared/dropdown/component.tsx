import * as React from 'react';
import './styles.scss';

interface IDropdownItem {
  content?: JSX.Element | string;
  onClick?: () => void;
  isDivider?: boolean;
}

interface IDropdownProps {
  children: any;
  items: IDropdownItem[];
}
export const DropdownComponent = (props: IDropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="dropdown">
      <div
        className="dropdown-content"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {props.children}
      </div>
      <div className={`dropdown-tooltip ${isOpen ? 'open' : ''}`}>
        {props.items.map((item, key) => (
          <span
            onClick={() => {
              item.onClick && item.onClick();
            }}
            key={key}
            className={item.isDivider ? 'divider' : !item.onClick ? 'disabled' : 'item'}
          >
            {item.content}
          </span>
        ))}
      </div>
    </div>
  );
};
