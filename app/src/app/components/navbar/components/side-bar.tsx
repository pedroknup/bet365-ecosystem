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
import { RouteComponentProps } from 'react-router';
import { SidebarContainerProps } from 'app/components/sidebar';
const Logo = require('../../../../assets/logo.png');

export interface INavbarComponentProps {}
const NavbarComponent = (
  props: INavbarComponentProps & SidebarContainerProps & RouteComponentProps
) => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="navbar">
      <div>
        <div className="navbar-icon">
          <FontAwesomeIcon onClick={() => {}} size="lg" icon={collapsed ? faHamburger : faCross} />
        </div>

        <span className="navbar-title">Home</span>
      </div>
      <div className="navbar-end">
        <div className="navbar-icon user">
          <FontAwesomeIcon onClick={() => {}} size="lg" icon={faSearch} />
        </div>
        <div className="navbar-icon user">
          <FontAwesomeIcon onClick={() => {}} size="lg" icon={faBell} />
        </div>
        <div className="navbar-icon user">
          <img src={Logo} />
        </div>
      </div>
    </div>
  );
};

export { NavbarComponent };
