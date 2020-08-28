import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
} from "@coreui/react";

import { Spin, Skeleton, DatePicker } from "antd";
import { format } from "date-fns";

import { fetchOrders } from "../../redux/orderRedux/actions";

const Orders = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { RangePicker } = DatePicker;

  const { fetching, data } = useSelector((state) => state.order);

  const [pageSize, setPageSize] = useState(10);

  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");

  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);

  const [page, setPage] = useState(currentPage);

  const pageChange = (newPage) => {
    if (newPage) {
      currentPage !== newPage && history.push(`/orders?page=${newPage}`);
    }
  };

  const onChange = (e) => {
    if (e) {
      const fromDate = new Date(e[0]);
      const toDate = new Date(e[1]);
      dispatch(
        fetchOrders({
          pageIndex: page,
          pageSize,
          fromDate: formatDateTime(fromDate),
          toDate: formatDateTime(toDate),
        })
      );
    } else {
      dispatch(fetchOrders({ pageIndex: page, pageSize }));
    }
  };

  const formatDateTime = (date) => {
    const theTime = new Date(date);
    const day = theTime.getDate();
    const month = theTime.getMonth() + 1;
    const year = theTime.getFullYear();
    return `${("0" + month).slice(-2)}-${("0" + day).slice(-2)}-${year}`;
  };

  const paginationChange = (pageSize) => {
    setPageSize(pageSize);
    dispatch(fetchOrders({ pageIndex: page, pageSize }));
  };

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
    dispatch(fetchOrders({ pageIndex: page, pageSize }));
  }, [currentPage, pageSize, page, dispatch, history]);

  return (
    <CRow>
      <CCol xl={12}>
        <Spin tip="Loading..." size="large" spinning={fetching}>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol lg="9">Orders</CCol>
                <CCol lg="3">
                  <RangePicker
                    format="DD-MM-YYYY HH:mm"
                    onChange={onChange}
                    activePage={data?.pageIndex}
                  />
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <Skeleton loading={!data}>
                <CDataTable
                  items={data?.sources}
                  fields={[
                    { key: "customerName", _classes: "font-weight-bold" },
                    "customerPhone",
                    "totalPrice",
                    "status",
                    "createdOn",
                  ]}
                  hover
                  striped
                  itemsPerPageSelect={{
                    label: "Item/ 1 Page",
                    values: [10, 20, 50, 100, 200, 500],
                  }}
                  itemsPerPage={pageSize}
                  onPaginationChange={paginationChange}
                  clickableRows
                  sorter
                  tableFilter={{
                    label: "Search",
                    placeholder: "Type anything to search",
                  }}
                  columnFilter
                  onRowClick={(item) => history.push(`/orders/${item.id}`)}
                  scopedSlots={{
                    createdOn: (item) => (
                      <td>
                        {format(new Date(item.createdOn), "dd-MM-yyyy H:mm")}
                      </td>
                    ),
                  }}
                />
                <CRow>
                  <CCol lg="9">Tổng : {data?.totalCount}</CCol>
                  <CCol lg="3">
                    <CPagination
                      activePage={data?.pageIndex}
                      onActivePageChange={pageChange}
                      pages={data?.totalPages}
                      doubleArrows
                    />
                  </CCol>
                </CRow>
              </Skeleton>
            </CCardBody>
          </CCard>
        </Spin>
      </CCol>
    </CRow>
  );
};

export default Orders;
