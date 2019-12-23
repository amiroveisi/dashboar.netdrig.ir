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

const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
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
    return (
        <List>
            {
                props.data.map(item => (
                    <React.Fragment>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar style={{ backgroundColor: pink[300] }}>
                                    {item.Image ? <img src={item.Image} /> : props.defaultImage}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={props.primaryText && props.primaryText(item)}
                                secondary={props.secondaryText && props.secondaryText(item)}
                            />

                            {props.actions && props.actions.map(action => (
                                <ListItemIcon>
                                    <Tooltip title={action.label}>
                                        <IconButton edge="start" aria-label={action.label}
                                            component={Link}
                                            to={action.link(item)}
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
                ))
            }
        </List>
    );
}