import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PharmacyIcon from '@material-ui/icons/LocalPharmacy';
import EditIcon from '@material-ui/icons/Edit';
import { Link as RouterLink } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import IconButton from '@material-ui/core/IconButton';
import {pink} from '@material-ui/core/colors'

const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));

export default function GeneralList(props) {
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
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar style={{backgroundColor: pink[300]}}>
                                {item.Image ? <img src={item.Image} /> : <PharmacyIcon  />}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={item.Title}
                            secondary={item.Address}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="ویرایش" component={Link} to={'/drugstore/edit/' + item.Id}>
                                <EditIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
        </List>
    );
}