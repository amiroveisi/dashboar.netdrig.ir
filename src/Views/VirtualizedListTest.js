import React, { createRef, useState, Fragment, PureComponent } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const LOADING = 1;
const LOADED = 2;
let itemStatusMap = {};
let cachedItems = {};
const url = 'http://www.netdrug.ir/api/crawler/drug/getpaged?pagenumber=1&rowsinpage=50';
const isItemLoaded = index => itemStatusMap[index];



class Row extends PureComponent {
  render() {
    const { index, style, data } = this.props;
    console.log('data: ', data);
    let label;
    if (itemStatusMap[index] === LOADED) {
      label = `Row ${index} - ${(cachedItems[index] && cachedItems[index].GenericNameEnglish) || 'N/A'}`;
    } else {
      label = "Loading...";
    }
    return (
      <div className="ListItem" style={style}>
        {label}
      </div>
    );
  }
}

export default function VirtualizedListTest(props) {
  const [serverData, setServerData] = useState(null);
  const {url} = props;
  const loadMoreItems = (startIndex, stopIndex) => {
    for (let index = startIndex; index <= stopIndex; index++) {
      itemStatusMap[index] = LOADING;
    }
    stopIndex = startIndex + 50;
    let shouldLoad = false;
    for (let index = startIndex; index <= stopIndex; index++) {
      if(itemStatusMap[index] !== LOADED && !cachedItems[index]){
        shouldLoad = true;
        break;
      }
    }
   if(shouldLoad){
    return new Promise(resolve =>
      {
        let page = Math.ceil(startIndex/50) + 1;
        console.log('start index: ', startIndex);
        console.log('end index: ', stopIndex);
        console.log('page: ', page);
        fetch(`http://www.netdrug.ir/api/crawler/drug/getpaged?pagenumber=${page}&rowsinpage=50`,{
          method : 'GET',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6Ijg2NzgzMTNkLTVmOTgtNDAyYi04YWJjLTg0M2Q5YjVjNGIwMiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOlsiMDkzODk2Mzk2ODgiLCIwOTM4OTYzOTY4OCJdLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL2FjY2Vzc2NvbnRyb2xzZXJ2aWNlLzIwMTAvMDcvY2xhaW1zL2lkZW50aXR5cHJvdmlkZXIiOiJBU1AuTkVUIElkZW50aXR5IiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiIzZDk4MTljMi1mMjJjLTQ2ZDItOWRlYy1kN2IxMGY1NTBkODEiLCJzdWIiOiIwOTM4OTYzOTY4OCIsIm5iZiI6MTU3NzgxODUwMCwiZXhwIjoxNjA5MzU0NTAwLCJpc3MiOiJodHRwOi8vbmV0ZHJ1Zy5pciIsImF1ZCI6IkFueSJ9._g0PhKwoK5gbqaDf6Dj-Q_zH2Z51khpOzh9KrSxKKNo`
          }
         
        }).then(response => {
          if(!response.ok)
          {
            console.log('response failed');
          }
          else{
            console.log('response ok');
            return response.json();
          }
        })
        .then(text => {
          //let currentData = serverData;
          //let newData = Array.from(currentData);
          console.log('current data: ', text);
          setServerData(text.Data.CurrentPageData);
          for (let index = startIndex; index <= stopIndex; index++) {
            itemStatusMap[index] = LOADED;
            cachedItems[index] = text.Data.CurrentPageData[index % 50];
          }
         
        }).catch(err => {
          if (typeof err.text === 'function') {
            err.text().then(errorMessage => {
              console.log('error: ', errorMessage);
            });
          } else {
               console.log('error2: ', err);
          }
            })
         
        
       
       resolve();
      }
    );
   }
   return new Promise(resolve => resolve());
  };
  return (
    <Fragment>
     
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={824}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            className="List"
            height={600}
            itemCount={824}
            itemSize={30}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width={800}
            itemData = {serverData}
          >
              {Row}
          </List>
        )}
      </InfiniteLoader>
     
    </Fragment>
  );
}
