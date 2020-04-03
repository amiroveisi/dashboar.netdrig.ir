import React from 'react';
import Button from '@material-ui/core/Button';
import { useGradientBtnStyles } from '@mui-treasury/styles/button/gradient';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';
import { useBlogCardContentStyles } from '@mui-treasury/styles/cardContent/blog';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { withStyles, makeStyles } from '@material-ui/core';
import useNetDrugStyles from '../Styles';


const GradientBtn = () => {
  const useStyles = makeStyles(themes => ({
    button: {
      backgroundImage: 'linear-gradient(147deg, #ff9a9e  0%, #fad0c4 74%)',
      boxShadow: '0px 4px 32px rgba(252, 56, 56, 0.4)',
      borderRadius: 100,
      paddingLeft: 24,
      paddingRight: 24,
      color: '#ffffff'
    }
  }));
  const classes = useNetDrugStyles();
  const gutterStyles = usePushingGutterStyles({ cssProp: 'marginBottom', space: 2 });
  return (
    <div className={gutterStyles.parent} style={{ marginTop: '50px' }}>
      <div>
        <Button className={classes.gradientButtonPrimary}>Default</Button>
      </div>
      <div>
        <Button>Chubby</Button>
      </div>
    </div>
  );
};

// hide-start
// GradientBtn.metadata = {
//   title: 'Gradient',
//   path: 'button/gradient',
//   creators: [require('constants/creators').siriwatknp],
//   files: [{ pkg: 'mui-styles', path: 'button/gradient/gradientBtn.styles.js' }],
// };
// hide-end

export default GradientBtn;