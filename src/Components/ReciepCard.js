import React from 'react';
import { Grid, Paper, Typography, Card } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import useNetDrugStyles from './Styles';
import TripOrigin from '@material-ui/icons/TripOrigin';
import ShoppingBasketRoundedIcon from '@material-ui/icons/ShoppingBasketRounded';
export default function ReciepCard(props) {
    const classes = useNetDrugStyles();
    return (
        <Card className={classes.reciepCard} elevation={1}
            //className={classes.dottedBorderHorizontal}
            style={
                {
                    //background: props.background ? props.background : 'white',
                    // background:  'linear-gradient(to right, #42a5f599, #4fc3f7aa)',
                    // boxShadow: '0px 2px 12px #42a5f566'

                }
            }>
            <CardContent>
                <TripOrigin className={classes.reciepCardHole} />
                <ShoppingBasketRoundedIcon
                    fontSize="inherit"
                    style={{ fontSize: '83px', margin: 'auto', width: '100%' }}
                ></ShoppingBasketRoundedIcon>
                <Typography align="center" gutterBottom>
                    {props.title}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="body2"
                    align="center"
                    component="p"
                >
                    {props.data}
                </Typography>

            </CardContent>

        </Card>

    );
}

ReciepCard.propTypes = {
    elevation: PropTypes.number,
    icon: PropTypes.object,
    title: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    background: PropTypes.string,
    titleColor: PropTypes.string
};