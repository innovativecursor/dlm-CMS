import React, { useEffect, useState } from "react";
import GlobalForm from "../GlobalForm/GlobalForm";
import { Button, Input, Menu, Modal, Table } from "antd";
import PageWrapper from "../PageContainer/PageWrapper";
import { deleteAxiosCall, getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SearchOutlined } from "@ant-design/icons";

function ProductTable(props) {
  const [openModal, setopenModal] = useState(false);
  const [inqMessage, setInqMessage] = useState("");
  const inquiry_columns = [
    {
      title: "Inquiry_ID",
      dataIndex: "inquiry_id",
      key: "inquiry_id",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Button
          onClick={() => {
            setopenModal(true), setInqMessage(record?.message);
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Button onClick={() => deleteInquiry(record.inquiry_id)}>Delete</Button>
      ),
    },
  ];
  const columns = [
    {
      title: "Prop ID",
      dataIndex: "prop_id",
      key: "prop_id",
      fixed: "left",
    },
    {
      title: "Property Name",
      dataIndex: "station_number",
      key: "station_number",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
  ];

  const testimonials_col = [
    {
      title: "Testimonial Id",
      dataIndex: "testimonial_id",
      key: "testimonial_id",
      fixed: "left",
    },

    {
      title: "Reviewer Name",
      dataIndex: "reviewer_name",
      key: "reviewer_name",
    },
  ];
  const amenities_col = [
    {
      title: "Amenity Id",
      dataIndex: "amenity_id",
      key: "amenity_id",
      fixed: "left",
    },
    {
      title: "Name of the Menu",
      dataIndex: "menu_name",
      key: "menu_name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Menu Name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90, marginTop: 4 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.menu_name
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Name of the Amenity",
      dataIndex: "amenity_name",
      key: "amenity_name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Amenity Name"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90, marginTop: 4 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.amenity_name
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
  ];

  useEffect(() => {
    if (props?.type === "Amenities") {
      fetchAmenities();
    }
  }, [props]);

  const fetchAmenities = async () => {
    const result = await getAxiosCall("/fetchAmenities");
    let flattenedResult = result?.data?.result?.map((el) => ({
      ...el,
      menu_name: el.Menu.menu_name,
      menu_id: el.Menu.menu_id,
      Menu: undefined, // Remove the Menu object
    }));
    setResult(flattenedResult);
    setFilteredData(flattenedResult); // Initialize filtered data
  };

  const [result, setResult] = useState(null);
  const [switchRoutes, setSwitchRoutes] = useState(false);
  const navigateTo = useNavigate();
  const deleteInquiry = async (id) => {
    try {
      Swal.fire({
        title: "info",
        text: "Are You Sure You want to Delete This Inquiry",
        icon: "info",
        confirmButtonText: "Delete",
        showCancelButton: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAxiosCall("/deleteInquiry", id);
          navigateTo("/inquiries");
          message.success("Inquiry deleted successfully");
        }
      });
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      message.error("Failed to delete inquiry");
    }
  };
  useEffect(() => {
    if (!props.filteredProducts) {
      answer();
    } else {
      setResult(props?.filteredProducts);
    }
  }, [props]);

  const answer = async () => {
    if (props?.type == "Testimonials" && props?.type) {
      const result = await getAxiosCall("/fetchTestimonials");
      setResult(result?.data);
    } else if (props?.type == "Property" && props?.type) {
      const result = await getAxiosCall("/properties");
      setResult(result?.data?.properties);
    } else if (props?.type == "Inquiries" && props?.type) {
      const result = await getAxiosCall("/fetchInquiries");
      setResult(result?.data);
    } else if (props?.type == "Amenities" && props?.type) {
      const result = await getAxiosCall("/fetchAmenities");
      let flattenedResult = result?.data?.result?.map((el) => ({
        ...el,
        menu_name: el.Menu.menu_name,
        menu_id: el.Menu.menu_id,
        Menu: undefined, // Remove the Menu object
      }));
      setResult(flattenedResult);
    }
  };
  const renderTable = () => {
    switch (props.type) {
      case "Property":
        return (
          <PageWrapper title={`${props.pageMode} Properties`}>
            <Table
              columns={columns}
              dataSource={result}
              size="large"
              // style={{
              //   width: "100rem",
              // }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    navigateTo(
                      props.pageMode === "View"
                        ? "/viewinner"
                        : props.pageMode === "Delete"
                        ? "/deleteinner"
                        : "/updateinner",
                      { state: record }
                    );
                  },
                };
              }}
              scroll={{
                x: 1000,
                y: 1500,
              }}
            />
          </PageWrapper>
        );
      case "Amenities":
        return (
          <PageWrapper title={`${props.pageMode} Amenities`}>
            <Table
              columns={amenities_col}
              dataSource={result}
              size="large"
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    navigateTo(
                      props.pageMode === "Delete"
                        ? "/deleteAmenitiesinner"
                        : "/updateAmenitiesinner",
                      { state: record }
                    );
                  },
                };
              }}
              scroll={{
                x: 1000,
                y: 1500,
              }}
            />
          </PageWrapper>
        );
      case "Inquiries":
        return (
          <>
            <PageWrapper title={`${props.type}`}>
              <Table
                columns={inquiry_columns}
                dataSource={result}
                size="large"
                onRow={() => ({})}
                scroll={{ x: 1000, y: 1500 }}
              />
            </PageWrapper>
            <Modal
              open={openModal}
              title="Description"
              centered
              closeIcon
              maskClosable={true} // Ensures that clicking outside closes the modal
              closable={true} // Hides the "X" close button
              footer={null}
              destroyOnClose={true}
              onCancel={() => setopenModal(false)} // Add this line to close the modal when clicking outside
            >
              <p>{inqMessage}</p>
            </Modal>
          </>
        );
      case "Testimonials":
        return (
          <PageWrapper title={`${props.type}`}>
            <Table
              columns={testimonials_col}
              dataSource={result}
              size="large"
              onRow={(record) => ({
                onClick: () => {
                  navigateTo("/deleteTestimonialsinner", { state: record });
                },
              })}
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      case "Users":
        return (
          <PageWrapper title={`${props.pageMode} Users`}>
            <Table
              columns={user_col}
              dataSource={result}
              size="large"
              scroll={{ x: 1000, y: 1500 }}
            />
          </PageWrapper>
        );
      default:
    }
  };
  return <>{renderTable()}</>;
}

export default ProductTable;
