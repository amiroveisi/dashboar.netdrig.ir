import React from 'react';
import { Grid, Typography, Divider } from "@material-ui/core";
import Brightness1RoundedIcon from '@material-ui/icons/Brightness1Rounded';

export default function TextDetail(props) {
    const { text, caption, textStyle, captionStyle } = props;
    return (
        <Grid item container direction='column' alignItems='flex-start' style={{ margin: '20px' }}>
            <Grid item >
                <Grid container item>
                    <Grid item style={{marginLeft : '5px'}}>
                        <Brightness1RoundedIcon style={{width:'16px', color:'#bbdefb'}}/>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle2' color='textPrimary'>{caption}</Typography>
                    </Grid>
                </Grid>
                <Divider  />
            </Grid>
            <Grid item style={{ marginTop: '5px' }}>
                <Typography variant='body2' color='textSecondary'>{text}</Typography>
            </Grid>
        </Grid>
    );
}