import React, { useState, useEffect } from "react";
import PagedTable from "../Components/PagedTable";
import { useSnackbar } from 'notistack';
import * as ConstantValues from '../Helpers/ConstantValues';
import { Grid } from "@material-ui/core";

export default function TableTest() {
    const [data, setData] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    
    useEffect(() => {

    }, []);
    const loadData = async function (page, rowsInPage) {
        try {

            const response = await fetch(`http://www.netdrug.ir/api/crawler/drug/getpaged?pagenumber=${page}&rowsinpage=${rowsInPage}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6Ijg2NzgzMTNkLTVmOTgtNDAyYi04YWJjLTg0M2Q5YjVjNGIwMiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOlsiMDkzODk2Mzk2ODgiLCIwOTM4OTYzOTY4OCJdLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL2FjY2Vzc2NvbnRyb2xzZXJ2aWNlLzIwMTAvMDcvY2xhaW1zL2lkZW50aXR5cHJvdmlkZXIiOiJBU1AuTkVUIElkZW50aXR5IiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiIzZDk4MTljMi1mMjJjLTQ2ZDItOWRlYy1kN2IxMGY1NTBkODEiLCJzdWIiOiIwOTM4OTYzOTY4OCIsIm5iZiI6MTU3NzgxODUwMCwiZXhwIjoxNjA5MzU0NTAwLCJpc3MiOiJodHRwOi8vbmV0ZHJ1Zy5pciIsImF1ZCI6IkFueSJ9._g0PhKwoK5gbqaDf6Dj-Q_zH2Z51khpOzh9KrSxKKNo`
                    }
                });
            if (!response) {
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else if (response.status === 401) {
                enqueueSnackbar("شما وارد حساب کاربری خود نشده اید یا دسترسی به این بخش ندارید", { variant: 'error' });

            }
            else {
                try {
                    const serverData = await response.json();
                    if (serverData && serverData.Data && serverData.Code === '0') {
                        return Promise.resolve({ data: serverData.Data.CurrentPageData, totalCount: serverData.Data.TotalRows });
                    }
                    else {
                        enqueueSnackbar("خطا در دریافت اطلاعات داروخانه. لطفا صفحه را مجددا بارگذاری نمایید", { variant: 'warning' });
                    }

                } catch (error) {
                    enqueueSnackbar("خطا در دریافت اطلاعات از سرور", { variant: 'error' });
                }
            }

        } catch (error) {
            console.log(error);
            if (error == 'TypeError: Failed to fetch') {
                enqueueSnackbar('خطا در برقراری ارتباط با سرور. لطفا ارتباط اینترنتی خود را بررسی کنید', { variant: 'error' });
            }
        }
    }
    return (
        <Grid container justify="center">
            <Grid item xs={10}>
                <PagedTable
                    dataIdPropName='Id'
                    selectable={true}
                    selectionChanged={(items=>console.log('selecteds: ', items))}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    headers={[
                        {
                            title: 'نام فارسی',
                            value: 'GenericNameFarsi'
                        },
                        {
                            title: 'نام لاتین',
                            value: 'GenericNameEnglish'
                        }
                    ]}
                    pageLoader={loadData}
                ></PagedTable>
            </Grid>
        </Grid>
    );
}