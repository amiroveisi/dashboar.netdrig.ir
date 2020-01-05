import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { TableHead, Checkbox } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { prototype } from 'react-window-infinite-loader';

const useStyles1 = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
    const handleFirstPageButtonClick = event => {
        onChangePage(event, 0, rowsPerPage);
    };

    const handleBackButtonClick = event => {
        onChangePage(event, page - 1, rowsPerPage);
    };

    const handleNextButtonClick = event => {
        onChangePage(event, page + 1, rowsPerPage);
    };

    const handleLastPageButtonClick = event => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1), rowsPerPage);
    };

    return (
        <div className={classes.root}>
            <Tooltip title='صفحه اول'>
                <span>
                    <IconButton
                        onClick={handleFirstPageButtonClick}
                        disabled={page === 0}
                        aria-label="صفحه اول"
                    >
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title='صفحه قبل'>
                <span>
                    <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="صفحه قبل">
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title='صفحه بعد'>
                <span>
                    <IconButton
                        onClick={handleNextButtonClick}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        aria-label="صفحه بعد"
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title='صفحه آخر'>
                <span> <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="صفحه آخر"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton></span>
            </Tooltip>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
    tableContainer: {
        maxHeight: '423px'
    }
});
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.grey[700]
        },
    },

}))(TableRow);
export default function PagedTable(props) {
    const classes = useStyles2();
    const { pageLoader, headers, maxHeight, rowsPerPageOptions, selectable, dataIdPropName, selectionChanged } = props;
    const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions ? rowsPerPageOptions[0] : 20);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        handleChangePage(null, page, rowsPerPage);
    }, []);

    const handleChangePage = (event, newPage, numberOfRows) => {
        pageLoader(newPage + 1, numberOfRows).then(result => {
            setRows(result.data);
            setPage(newPage);
            setTotalCount(result.totalCount);
        })
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        handleChangePage(null, 0, parseInt(event.target.value, 10));
    };
    const handleRowClick = (event, id) => {
        const selectedIndex = selectedItems.indexOf(id);
        let newSelecteds = [];
        if (selectedIndex === -1) //currently not selected
        {
            newSelecteds = newSelecteds.concat(selectedItems, id);
        }
        else//already selected
        {
            newSelecteds = newSelecteds.concat(selectedItems.slice(0, selectedIndex),
                selectedItems.slice(selectedIndex + 1));
        }
        setSelectedItems(newSelecteds);
        if (selectionChanged)
            selectionChanged(newSelecteds);
    }
    const isItemSelected = id => selectedItems.indexOf(id) !== -1;
    if (!rows) {
        return (<p>در حال بارگذاری...</p>);
    }
    return (
        <TableContainer component={Paper} style={{ maxHeight: maxHeight }}>
            <Table stickyHeader className={classes.table} aria-label="">
                <TableHead>
                    <TableRow>
                        {selectable && <TableCell padding='checkbox'>
                        </TableCell>}
                        {(headers).map((header, index) => (
                            <StyledTableCell key={index}>
                                {header.title}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>

                    {(rows).map((row, index) => (
                        <TableRow key={index} onClick={event => handleRowClick(event, dataIdPropName ? row[dataIdPropName] : row['id'])}>
                            {selectable && <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected(dataIdPropName ? row[dataIdPropName] : row['id'])}
                                    inputProps={{ 'aria-labelledby': `checkbox-${index}` }}
                                />
                            </TableCell>}
                            {Array.from(headers).map((header, index) => (
                                <StyledTableCell key={index}>
                                    {row[header.value]}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <StyledTableRow>
                        <TablePagination
                            labelRowsPerPage='تعداد ردیف در هر صفحه:'
                            labelDisplayedRows={({ from, to, count }) => `صفحه ${Math.ceil(to / rowsPerPage)} از ${Math.ceil(count / rowsPerPage)}`}
                            rowsPerPageOptions={rowsPerPageOptions}
                            colSpan={3}
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'تعداد رکورد های صفحه' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </StyledTableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
PagedTable.propTypes = {
    pageLoader: PropTypes.func.isRequired,
    headers: PropTypes.array.isRequired,
    maxHeight: PropTypes.string,
    rowsPerPageOptions: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    dataIdPropName: PropTypes.string,
    selectionChanged: PropTypes.func, 
};