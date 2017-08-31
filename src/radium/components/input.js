import React from 'react';
import Radium from 'radium';
import styles from '../../styles';

const Input = Radium((props) => <input {...props} style={[styles.input]} />);

export default Input;