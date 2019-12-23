import * as React from 'react';
import './styles.scss';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { faDashcube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faQuestionCircle,
  faSignOutAlt,
  faTools,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { SidebarContainerProps } from '../containers';
import { RouteComponentProps } from 'react-router';
const Logo = require('../../../../assets/logo.png');

export interface ISidebarComponentProps {}
export const SidebarComponent = (
  props: ISidebarComponentProps & RouteComponentProps & SidebarContainerProps
  // props: ISidebarComponentProps
) => {
  const [internalExpanded, setInternalExpanded] = React.useState(props.isExpanded);
  const sidebarClasses = `sidebar ${props.isOpened ? 'open' : ''} ${
    internalExpanded ? 'expanded' : ''
  }`;
  const sidebarContainerClasses = `sidebar-container ${props.isOpened ? 'open' : ''} ${
    internalExpanded ? 'expanded' : ''
  }`;
  React.useEffect(
    () => {
      setInternalExpanded(props.isExpanded);
    },
    [props.isExpanded]
  );

  return (
    <div // onMouseEnter={() => {
      //   if (!props.isExpanded) setInternalExpanded(true);
      // }}
      // onMouseLeave={() => {
      //   if (!props.isExpanded) setInternalExpanded(false);
      // }}
      className={sidebarContainerClasses}
    >
      <div className={sidebarClasses}>
        <span className="sidebar-item logo">
          <img src={Logo} />
          {<span>PK Boilerplate</span>}

          <FontAwesomeIcon
            onClick={() => {
              props.toggleSidebarOpened && props.toggleSidebarOpened();
            }}
            className="close-sidebar"
            size="sm"
            icon={faTimes}
          />
        </span>
        <span className="sidebar-item active">
          <FontAwesomeIcon size="sm" icon={faHome} />
          {<span>Home</span>}
        </span>
        <span className="sidebar-item">
          <FontAwesomeIcon size="sm" icon={faTools} />
          {<span>Settings</span>}
        </span>
        <span className="sidebar-item">
          <FontAwesomeIcon size="sm" icon={faQuestionCircle} />
          {<span>About</span>}
        </span>
        <span className="sidebar-item">
          <FontAwesomeIcon size="sm" icon={faSignOutAlt} />
          {<span>Sign out</span>}
        </span>
      </div>
    </div>
  );
};
