import { makeStyles } from '@material-ui/core';
const space = 24;
const useStyles = makeStyles(themes => ({
  // gradientButtonPrimary: {
  //   background: 'linear-gradient(to right, #42a5f5, #4fc3f7)',
  //   '&:hover': {
  //     background: 'linear-gradient(to right, #42a5f5ee, #4fc3f7ee)'
  //   },
  //   border: '1px solid #4fc3f7',
  //   boxShadow: '0px 4px 32px #42a5f566',
  //   borderRadius: 100,
  //   paddingLeft: 24,
  //   paddingRight: 24,
  //   color: '#ffffff'
  // },
  gradientButtonPrimary: {
    background: 'linear-gradient(to right, #00E676, #69F0AE)',
    '&:hover': {
      background: 'linear-gradient(to right, #00E676ee, #69F0AEee)'
    },
    border: '1px solid #69F0AE',
    boxShadow: '0px 4px 32px #69F0AE66',
    borderRadius: 100,
    paddingLeft: 24,
    paddingRight: 24,
    color: '#ffffff'
  },
  gradientCircleButtonPrimary: {
    background: 'linear-gradient(to right, #42a5f5bb, #42a5f588)',
    '&:hover': {
      background: 'linear-gradient(to right, #42a5f5aa, #42a5f577)'
    },
    border: '1px solid #42a5f522',
    boxShadow: '0px 4px 32px #42a5f555',
    borderRadius: '50%',
    minWidth: 40,
    widht: 40,
    height: 40,
    padding: 4,
    color: '#ffffff'
  },
  gradientButtonPrimaryOutlined: {
    background: 'ffffffff',
    '&:hover': {
      background: '#42a5f522'
    },
    border: '1px solid #42a5f5',
    // boxShadow: '0px 4px 12px #42a5f555',
    borderRadius: 100,
    paddingLeft: 24,
    paddingRight: 24,
    color: '#42a5f5'
  },
  gradientButtonPrimary2: {
    background: 'linear-gradient(to right, #42a5f5bb, #42a5f588)',
    '&:hover': {
      background: 'linear-gradient(to right, #42a5f5aa, #42a5f577)'
    },
    border: '1px solid #42a5f522',
    boxShadow: '0px 4px 32px #42a5f555',
    borderRadius: 100,

    paddingLeft: 24,
    paddingRight: 24,
    fontFamily: 'IranSans',
    color: '#ffffff'
  },
  gradientButtonPrimaryFlat: {
    background: 'ffffffff',
    '&:hover': {
      background: '#42a5f522'
    },

    // boxShadow: '0px 4px 12px #42a5f555',
    borderRadius: 100,
    paddingLeft: 24,
    paddingRight: 24,
    color: '#42a5f5'
  },
  primaryFlat: {
    background: 'ffffffff',
    color: 'ff0000 !important',
    '&:hover': {
      background: '#42a5f522'
    }
  },
  secondaryFlat: {
    background: 'ffffffff',
    '&:hover': {
      background: '#ec407a22'
    }
  },
  gradientButtonSecondaryOutlined: {
    background: 'ffffffff',
    '&:hover': {
      background: '#ec407a22'
    },
    border: '1px solid #ec407a',
    // boxShadow: '0px 4px 12px #ec407a55',
    borderRadius: 100,
    paddingLeft: 24,
    paddingRight: 24,
    color: '#ec407a'
  },
  dottedBorderHorizontal: {
    'background-image': 'linear-gradient(to left, #42a5f5 50%, #ffffff 0%, #ffffffff 0%)',
    'background-position': 'bottom',
    'background-size': '8px 1px',
    'background-repeat': 'repeat-x',
    position: 'absolute',
    left: '0',
    right: '0'
  },
  dottedBorderVertical: {
    'background-image': 'linear-gradient( #42a5f5 33%, #4fc3f7 0%)',
    'background-position': 'right',
    'background-size': '1px 3px',
    'background-repeat': 'repeat-y',
  },
  reciepCard: {
    height: '400px',
    margin: '20px 0 0 0',
    display: 'flex',
    background: 'white',
    position: 'relative',
    overflow: 'visible',
    '&::before': {

      boxSizing: 'border-box',
      content: "' '",
      width: '100%',
      'border-bottom': `30px solid white`,
      'border-left': ' 20px solid transparent',
      'border-right': '20px solid transparent',
      position: 'absolute',
      top: '-30px',
    },
  },
  reciepCardHole: {
    position: 'absolute',
    top: '-20px',
    margin: 'auto',
    width: '100%',
    left: 0,
    boxShadow: '2px #00000022'
  },
  filler: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    'border-bottom': '1px dashed #eeeeee',
    height: '50%',
  }

}));
export default function useNetDrugStyles() {
  const classes = useStyles();
  return classes;
}