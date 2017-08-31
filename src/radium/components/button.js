import React from 'React';
import Radium from 'radium';
import styles from '../../styles';

const Button = Radium(({children}) => <div style={[styles.button]}>{children}</div>);

export default Button;