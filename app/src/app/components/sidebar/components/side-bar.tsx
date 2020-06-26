import * as React from 'react';
import './styles.scss';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { faDashcube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { SidebarContainerProps } from '../containers';

export interface INavButton {
  isActive?: boolean;
  text: string;
  icon?: any;
}

export interface ISidebarComponentProps {
  navButtons?: INavButton[];
}
export const SidebarComponent = (props: ISidebarComponentProps & SidebarContainerProps) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const width = collapsed ? 80 : 160;
  return (
    <div style={{ width }} className="sidebar">
      <div>
        <button
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          {collapsed.toString()}
        </button>
        {/* <FontAwesomeIcon size="lg" icon={faTable} /> */}
        {props.navButtons && props.navButtons.map((item, key) => (
          <span key={key}>{item.text}</span>
        ))}
      </div>
    </div>
  );
};
