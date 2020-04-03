import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { Link as RouterLink } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import IconButton from '@material-ui/core/IconButton';
import { pink, grey } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import useNetDrugStyles from './Styles';
import {Typography} from '@material-ui/core';

const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));

export default function SimpleList(props) {
    const netDrugStyles = useNetDrugStyles();
    if (!props.data) {
        return (
            <List>
                {Array.from(new Array(10)).map((item, index) => (
                    <ListItem id={index}>
                        <ListItemAvatar>
                            <Skeleton variant="circle" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Skeleton variant="text" width={'30%'} />}
                            secondary={<Skeleton variant="text" width={'50%'} />}
                        >
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        );
    }
    let avatar =  (item) => (<Avatar style={{ backgroundColor: '#A1DFFB', borderWidth:'0px' }}>
        {item.Image ? <img src={item.Image} /> : props.defaultImage}
    </Avatar>);
    if(props.numberAvatar)
    {
        avatar = (item) => (<Avatar style={{ backgroundColor: '#A1DFFB', borderWidth:'0px' }}>
            {item}
        </Avatar>);
    }
    let avatarNumber = 1;
    return (
        <List>
            {
                props.data.map((item, index) => {
                    
                    return (
                    <React.Fragment key={`fragment${index}`}>
                        <ListItem key={index}>
                            {(props.defaultImage || item.Image || props.numberAvatar) && <ListItemAvatar>
                                <Avatar style={{ backgroundColor: '#A1DFFB' }}>
                                    {props.numberAvatar ? avatar(avatarNumber++) : avatar(item)}
                                </Avatar>
                            </ListItemAvatar>}
                            <ListItemText
                                primary={<Typography variant='subtitle2'>
                                    {props.primaryText && props.primaryText(item)}
                                </Typography>}
                                secondary={<Typography variant='caption' style={{color:grey[600]}}>
                                    {props.secondaryText && props.secondaryText(item)}
                                </Typography>}
                            />

                            {props.actions && props.actions.map((action, index) => (
                                <ListItemIcon key={index}>
                                    <Tooltip title={action.label}>
                                        <IconButton edge="start" aria-label={action.label}
                                            component={Link}
                                            style={action.customClass}
                                            to={action.link ? action.link(item) : '#'}
                                            onClick={event => action.onClick ? action.onClick(item) : null}
                                            color={action.color}
                                            {...action.otherProps}>
                                            {action.icon}

                                        </IconButton>
                                    </Tooltip>
                                </ListItemIcon>
                            ))}


                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                )})
            }
        </List>
    );
}

SimpleList.prototype = {
    data: PropTypes.array.isRequired,
    defaultImage: PropTypes.object,
    primaryText: PropTypes.object,
    secondaryText: PropTypes.object,
    actions: PropTypes.array,
    avatarNumber : PropTypes.bool,
    customClass: PropTypes.object
};