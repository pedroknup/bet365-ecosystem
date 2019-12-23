import * as React from 'react';
import './styles.scss';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { faDashcube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTable,
  faHome,
  faQuestion,
  faQuestionCircle,
  faSignOutAlt,
  faTools,
  faUser,
  faHamburger,
  faSearch,
  faCross,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { SidebarContainerProps } from '../containers';
import { RouteComponentProps } from 'react-router';
const Logo = require('../../../../assets/logo.png');
export interface INavButton {
  isActive?: boolean;
  text: string;
  icon?: any;
}

export interface ISidebarComponentProps {
  navButtons?: INavButton[];
}
const SidebarComponent = (
  props: ISidebarComponentProps & SidebarContainerProps & RouteComponentProps
) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const width = collapsed ? 60 : 200;
  return (
    <div style={{ width }} className="sidebar">
      {/* <FontAwesomeIcon size="lg" icon={faTable} /> */}
      {/* {props.navButtons &&
          props.navButtons.map((item, key) => <span key={key}>{item.text}</span>)} */}
      {/* <span className="sidebar-item user">
        <FontAwesomeIcon size="sm" icon={faUser} />
        {
          <span style={{ opacity: collapsed ? 0 : 1 }}>{`${props.loggedUser &&
            props.loggedUser.email}`}</span>
        }
      </span> */}
      <span className="sidebar-item logo">
        <img src={Logo} />
        {<span style={{ opacity: collapsed ? 0 : 1 }}>PK Boilerplate</span>}
      </span>
      <span className="sidebar-item active">
        <FontAwesomeIcon size="sm" icon={faHome} />
        {<span style={{ opacity: collapsed ? 0 : 1 }}>Home</span>}
      </span>
      <span className="sidebar-item">
        <FontAwesomeIcon size="sm" icon={faQuestionCircle} />
        {<span style={{ opacity: collapsed ? 0 : 1 }}>About</span>}
      </span>
      <span className="sidebar-item">
        <FontAwesomeIcon size="sm" icon={faTools} />
        {<span style={{ opacity: collapsed ? 0 : 1 }}>Settings</span>}
      </span>
      <span className="sidebar-item">
        <FontAwesomeIcon size="sm" icon={faSignOutAlt} />
        {<span style={{ opacity: collapsed ? 0 : 1 }}>Sign out</span>}
      </span>
    </div>
  );
};

export { SidebarComponent };
