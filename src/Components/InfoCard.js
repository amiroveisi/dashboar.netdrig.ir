import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
export default function InfoCard(props) {
    return (
        <Paper elevation={props.elevation ? props.elevation : 0}>
            <Grid container alignItems='center' justify='flex-start' style={{ padding: '12px' }} >
                <Grid container>
                    <Grid item style={{ marginLeft: '10px', fontSize: '0px' }}>
                       {props.icon}
                    </Grid>
                    <Grid item>
                        <Typography variant='caption' color='textSecondary'>
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