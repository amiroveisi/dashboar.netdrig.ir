import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useNetDrugStyles from './Styles';
export default function InfoCard(props) {
    const classes = useNetDrugStyles();
    return (
        <Paper elevation={props.elevation ? props.elevation : 0}
        //className={classes.dottedBorderHorizontal}
        style={
            {
                //background: props.background ? props.background : 'white',
                // background:  'linear-gradient(to right, #42a5f599, #4fc3f7aa)',
                // boxShadow: '0px 2px 12px #42a5f566'
                
            }
            }>
            <Grid container alignItems='center' justify='center' style={{ padding: '12px' }} >
                <Grid container>
                    <Grid item style={{ marginLeft: '5px', fontSize: '0px' }}>
                       {props.icon}
                    </Grid>
                    <Grid item>
                        <Typography variant='caption' color={props.titleColor || 'textSecondary'}
                        style={{color:props.titleColor}}>
                            {props.title}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justify='flex-end'>
                    <Grid item >
                        <Typography variant='caption' color='textPrimary' style={{ fontFamily: 'IranSans'}}>
                            {props.data} 
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>

    );
}

InfoCard.propTypes={
    elevation : PropTypes.number,
    icon : PropTypes.object,
    title : PropTypes.string.isRequired,
    data : PropTypes.string.isRequired,
    background : PropTypes.string,
    titleColor : PropTypes.string
};