import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
export default function InfoCard(props) {
    return (
        <Paper elevation={props.elevation ? props.elevation : 0} style={{background: props.background ? props.background : 'white'}}>
            <Grid container alignItems='center' justify='flex-start' style={{ padding: '12px' }} >
                <Grid container>
                    <Grid item style={{ marginLeft: '10px', fontSize: '0px' }}>
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
                        <Typography variant='subtitle1' color='textPrimary' style={{ fontFamily: 'IranSans' }}>
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