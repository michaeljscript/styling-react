import React from 'react';
import Radium from 'radium';
import styles from '../../styles';

const Label = Radium(({children}) => <span style={[styles.label]}>{children}</span>);

export default Label;