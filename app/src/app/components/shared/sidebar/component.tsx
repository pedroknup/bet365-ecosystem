import * as React from 'react';
import './styles.scss';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';

interface ISidebarProps {
  errorMessage?: string;
}
export const SidebarComponent = (props: TextFieldProps & ISidebarProps) => {
  return (
    <div className="sidebar">
     SIDEBAR
    </div>
  );
};
