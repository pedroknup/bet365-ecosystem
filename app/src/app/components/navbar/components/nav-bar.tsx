import * as React from 'react';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { INavbarContainerProps } from '../containers';
import { DropdownComponent } from 'app/components/shared/dropdown';

const Logo = require('../../../../assets/logo.png');

export interface INavbarComponentProps {}
const NavbarComponent = (props: INavbarComponentProps & INavbarContainerProps) => {
  return (
    <div className="navbar">
      <div>
        <div className="navbar-icon">
          <FontAwesomeIcon
            onClick={() => {
              props.toggleSidebar && props.toggleSidebar();
            }}
            size="lg"
            icon={faBars}
          />
        </div>

        <span className="navbar-title">Home</span>
        {props.loggedUser && props.loggedUser.firstName}
      </div>
      <div className="navbar-end">
        <div className="navbar-icon user">
          <FontAwesomeIcon onClick={() => {}} size="lg" icon={faSearch} />
        </div>
        <div className="navbar-icon user">
          <FontAwesomeIcon onClick={() => {}} size="lg" icon={faBell} />
        </div>
        <div className="navbar-icon user">
          <DropdownComponent
            items={[
              { content: (props.loggedUser && props.loggedUser.email) || '' },
              {
                content: 'My Profile',
                onClick: () => {
                  console.log('My profile click');
                }
              },
              { isDivider: true },
              {
                content: 'Sign out',
                onClick: () => {
                  console.log('Signout click');
                }
              }
            ]}
          >
            <img src={Logo} />
          </DropdownComponent>
        </div>
      </div>
    </div>
  );
};

export { NavbarComponent };
