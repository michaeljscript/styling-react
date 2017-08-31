import React from 'react';
import Radium from 'radium';
import styles from '../../styles';

const Title = Radium(({children}) => <div style={[styles.title]}>{children}</div>);

export default Title;