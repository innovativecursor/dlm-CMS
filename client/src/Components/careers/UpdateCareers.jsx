import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Button, Form, Input, InputNumber } from "antd";
import {
  getAxiosCall,
  postAxiosCall,
  updateAxiosCall,
} from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateCareers(props) {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [contactDetails1, setContactDetails1] = useState("");
  const [contactDetails2, setContactDetails2] = useState("");
  const location = useLocation();
  const [record, setRecord] = useState(location.state);

  const NavigateTo = useNavigate();

  useEffect(() => {
    if (location?.state) {
      let asd = { ...location.state };
      setRecord(asd);
    }
    addSite();
  }, []);

  // Add a new site with default structure
  const addSite = async () => {
    const result = await getAxiosCall("/careers");
    setJobOpenings(record?.jobOpenings || []);
  };

  // Add a worker record to a specific site
  const addRecord = (index) => {
    const updatedJobOpenings = [...jobOpenings];
    updatedJobOpenings[index].workers.push({ designation: "", count: 1 });
    setJobOpenings(updatedJobOpenings);
  };

  // Delete a site
  const deleteSite = (index) => {
    if (jobOpenings?.length !== 1) {
      const updatedJobOpenings = jobOpenings.filter((_, i) => i !== index);
      setJobOpenings(updatedJobOpenings);
    }
  };

  // Delete a worker record
  const deleteRow = (siteIndex, workerIndex) => {
    if (jobOpenings[siteIndex]?.workers?.length !== 1) {
      const updatedJobOpenings = [...jobOpenings];
      updatedJobOpenings[siteIndex].workers.splice(workerIndex, 1);
      setJobOpenings(updatedJobOpenings);
    }
  };

  // Handle input changes for site name
  const handleSiteChange = (index, value) => {
    const updatedJobOpenings = [...jobOpenings];
    updatedJobOpenings[index].site = value;
    setJobOpenings(updatedJobOpenings);
  };

  // Handle input changes for worker designation or count
  const handleWorkerChange = (siteIndex, workerIndex, field, value) => {
    const updatedJobOpenings = [...jobOpenings];
    updatedJobOpenings[siteIndex].workers[workerIndex][field] = value;
    setJobOpenings(updatedJobOpenings);
  };

  // Sending Data
  const sendData = async () => {
    const payload = {
      jobOpenings,
    };
    try {
      const result = await updateAxiosCall(
        "/careers",
        record?.career_id,
        payload
      );
      if (result) {
        Swal.fire({
          title: "Success",
          text: result?.message,
          icon: "success",
          confirmButtonText: "Great!",
          allowOutsideClick: false,
        }).then(() => {
          NavigateTo("/UpdateCareers");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failure",
        text: error?.message,
        icon: "error",
        confirmButtonText: "Try Again",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <PageWrapper title="Job Postings">
      <div className="container mx-auto p-4 text-lg">
        <Form onFinish={sendData}>
          <div className="container mx-auto shadow-2xl p-8">
            {jobOpenings?.map((site, siteIndex) => (
              <div key={siteIndex} className="innerSite p-4 shadow-lg">
                <div>
                  <label>Enter Site</label>
                  <Input
                    required
                    name="site"
                    size="large"
                    onChange={(e) =>
                      handleSiteChange(siteIndex, e.target.value)
                    }
                    value={site?.site}
                  />
                </div>
                {site?.workers?.map((worker, workerIndex) => (
                  <div
                    key={workerIndex}
                    className="flex my-4 gap-x-4 items-end"
                  >
                    <div>
                      <label>Workers</label>
                      <Input
                        required
                        name="workers"
                        size="medium"
                        onChange={(e) =>
                          handleWorkerChange(
                            siteIndex,
                            workerIndex,
                            "designation",
                            e.target.value
                          )
                        }
                        value={worker?.designation}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label>Count</label>
                      <InputNumber
                        required
                        name="count"
                        size="medium"
                        min={1}
                        onChange={(value) =>
                          handleWorkerChange(
                            siteIndex,
                            workerIndex,
                            "count",
                            value
                          )
                        }
                        value={worker.count}
                      />
                    </div>
                    <Button onClick={() => deleteRow(siteIndex, workerIndex)}>
                      Delete Row
                    </Button>
                  </div>
                ))}
                <Button onClick={() => addRecord(siteIndex)}>Add Worker</Button>
              </div>
            ))}
          </div>

          <div className="acitonButtons w-full mt-4 flex justify-center">
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out items-center justify-center"
              onClick={sendData}
            >
              Update Data
            </button>
          </div>
        </Form>
      </div>
    </PageWrapper>
  );
}

export default UpdateCareers;
