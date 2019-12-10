import * as React from 'react';
import './styles.scss';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { faDashcube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';

interface ISidebarProps {
  errorMessage?: string;
}
export const SidebarComponent = (props: TextFieldProps & ISidebarProps) => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const maxWidth= collapsed ? 80 : 160;
  return (
    <div style={{ maxWidth, minWidth: maxWidth}} className="sidebar">
      <div>
        <button
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          {collapsed.toString()}
        </button>
        <FontAwesomeIcon size="lg" icon={faTable} />
      </div>
    </div>
  );
};
