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
import { pink } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} to='' />
));

export default function SimpleList(props) {
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
    let avatar =  (item) => (<Avatar style={{ backgroundColor: pink[300] }}>
        {item.Image ? <img src={item.Image} /> : props.defaultImage}
    </Avatar>);
    if(props.numberAvatar)
    {
        avatar = (item) => (<Avatar style={{ backgroundColor: pink[300] }}>
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
                                <Avatar style={{ backgroundColor: pink[300] }}>
                                    {props.numberAvatar ? avatar(avatarNumber++) : avatar(item)}
                                </Avatar>
                            </ListItemAvatar>}
                            <ListItemText
                                primary={props.primaryText && props.primaryText(item)}
                                secondary={props.secondaryText && props.secondaryText(item)}
                            />

                            {props.actions && props.actions.map((action, index) => (
                                <ListItemIcon key={index}>
                                    <Tooltip title={action.label}>
                                        <IconButton edge="start" aria-label={action.label}
                                            component={Link}
                                            to={action.link && action.link(item)}
                                            onClick={action.onClick}
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
    avatarNumber : PropTypes.bool
};