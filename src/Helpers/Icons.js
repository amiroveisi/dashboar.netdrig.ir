import React from 'react';
import ShareRoundedIcon from '@material-ui/icons/ShareRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';

export const icons = {
    shareRoundedIcon: <ShareRoundedIcon />,
    favoriteRoundedIcon: <FavoriteRoundedIcon />,
    closeRoundedIcon: <CloseRoundedIcon />,
    visibilityOffIcon,
    visibilityRoundedIcon
}
function visibilityOffIcon(color) { return <VisibilityOffIcon style={{ color: color }} /> }
function visibilityRoundedIcon(color) { return <VisibilityRoundedIcon style={{ color: color }} /> }