import React, { useState, useEffect } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { getAxiosCall, postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";

function Careers() {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [contactDetails, setContactDetails] = useState({
    contact1: "",
    contact2: "",
  });

  // Fetch data dynamically from an API when the component mounts
  useEffect(async () => {
    // Simulated API response
    const fetchedData = {
      jobOpenings: [
        {
          site: "Royal South Village, Las Pinas",
          workers: [{ designation: "Painter", count: 1 }],
        },
      ],
      contactDetails: { contact1: "0926-0532470", contact2: "0945-2770293" },
    };
    setValues();
  }, []);

  const setValues = async () => {
    const result = await getAxiosCall("/careers");

    const filteredResult = result?.data?.data?.filter((el) => el?.jobOpenings);
    console.log("filteredResult", filteredResult);
    const filteredcontacts = result?.data?.data?.map(
      (el) => el?.contactDetails
    );
    console.log("filteredResult", filteredcontacts);
    // Load fetched data into state
    setJobOpenings(filteredResult ? filteredResult : []);
    setContactDetails(filteredcontacts ? filteredcontacts : {});
  };

  // Add a new job site entry
  const addJobOpening = () => {
    setJobOpenings([
      ...jobOpenings,
      { site: "", workers: [{ designation: "", count: 1 }] },
    ]);
  };

  // Delete a job site entry
  const deleteJobOpening = (index) => {
    setJobOpenings(jobOpenings.filter((_, i) => i !== index));
  };

  // Update job site details
  const updateJobOpening = (index, key, value) => {
    const updatedOpenings = [...jobOpenings];
    updatedOpenings[index][key] = value;
    setJobOpenings(updatedOpenings);
  };

  // Add a worker to a specific job site
  const addWorker = (index) => {
    const updatedOpenings = [...jobOpenings];
    updatedOpenings[index].workers.push({ designation: "", count: 1 }); // Default count is 1
    setJobOpenings(updatedOpenings);
  };

  // Update worker details (prevent worker count from being 0)
  const updateWorker = (siteIndex, workerIndex, key, value) => {
    const updatedOpenings = [...jobOpenings];
    if (key === "count") {
      const updatedValue = Math.max(1, parseInt(value) || 1); // Prevent count from being < 1
      updatedOpenings[siteIndex].workers[workerIndex][key] = updatedValue;
    } else {
      updatedOpenings[siteIndex].workers[workerIndex][key] = value;
    }
    setJobOpenings(updatedOpenings);
  };

  // Delete a worker from a site
  const deleteWorker = (siteIndex, workerIndex) => {
    const updatedOpenings = [...jobOpenings];
    updatedOpenings[siteIndex].workers = updatedOpenings[
      siteIndex
    ].workers.filter((_, i) => i !== workerIndex);
    setJobOpenings(updatedOpenings);
  };

  // Save data (Simulated API call)
  const saveData = async () => {
    const payload = {
      jobOpenings,
      contactDetails,
    };
    console.log("Saved Data: ", payload);
    const result = await postAxiosCall("/careers", payload);
    if (result) {
      Swal.fire({
        title: "Success",
        text: updatedResult?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload(true);
      });
    }
  };

  return (
    <PageWrapper title="Job Postings">
      <div className="container mx-auto p-4 text-lg">
        <h1 className="text-2xl font-bold mb-4">Manage Job Openings</h1>

        {/* Contact Details Section */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Contact Details:</label>
          <div className="flex space-x-4">
            <input
              type="text"
              required
              placeholder="Contact 1"
              value={contactDetails?.contact1}
              onChange={(e) =>
                setContactDetails({
                  ...contactDetails,
                  contact1: e.target.value,
                })
              }
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              required
              placeholder="Contact 2"
              value={contactDetails?.contact2}
              onChange={(e) =>
                setContactDetails({
                  ...contactDetails,
                  contact2: e.target.value,
                })
              }
              className="flex-1 p-2 border rounded"
            />
          </div>
        </div>

        {/* Job Openings Section */}
        {jobOpenings?.map((opening, siteIndex) => (
          <div
            key={siteIndex}
            className="border p-4 mb-4 rounded-lg bg-gray-50 shadow-md"
          >
            {/* Site Location */}
            <label className="block mb-2">
              <span className="font-semibold">Site Location:</span>
              <input
                type="text"
                required
                placeholder="Enter site location"
                value={opening.site}
                onChange={(e) =>
                  updateJobOpening(siteIndex, "site", e.target.value)
                }
                className="w-full mt-1 p-2 border rounded"
              />
            </label>

            {/* Workers Section */}
            <div className="mt-2">
              <h3 className="font-semibold mb-2">Workers:</h3>
              {opening?.workers?.map((worker, workerIndex) => (
                <div
                  key={workerIndex}
                  className="flex space-x-4 mb-2 items-center"
                >
                  <input
                    type="text"
                    required
                    placeholder="Designation (e.g., Welder)"
                    value={worker.designation}
                    onChange={(e) =>
                      updateWorker(
                        siteIndex,
                        workerIndex,
                        "designation",
                        e.target.value
                      )
                    }
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Count"
                    min="1"
                    value={worker.count}
                    onChange={(e) =>
                      updateWorker(
                        siteIndex,
                        workerIndex,
                        "count",
                        e.target.value
                      )
                    }
                    className="w-24 p-2 border rounded"
                  />
                  <button
                    onClick={() => deleteWorker(siteIndex, workerIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={() => addWorker(siteIndex)}
                className="text-blue-500 underline mt-2"
              >
                + Add Worker
              </button>
            </div>

            {/* Delete Job Site */}
            <button
              onClick={() => deleteJobOpening(siteIndex)}
              className="text-red-500 underline mt-2"
            >
              Delete Job Site
            </button>
          </div>
        ))}

        {/* Add New Site */}
        <button
          onClick={addJobOpening}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add New Site
        </button>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={saveData}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Job Openings
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Careers;
