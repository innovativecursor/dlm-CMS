import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Button, Select } from "antd";
import { getAxiosCall, updateAxiosCall } from "../../Axios/UniversalAxiosCalls";
import axios from "axios";
import Swal from "sweetalert2";

function FontColor() {
  const [fonts, setFonts] = useState([]);
  const [currentPack, setCurrentPack] = useState({});

  useEffect(() => {
    font();
    fetchCurrentFont();

    // Add the iframe onload logic
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.onload = () => {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          const style = iframeDoc.createElement("style");
          style.innerHTML = `
            body {
              font-family: 'Arial', sans-serif !important;
            }
          `;
          iframeDoc.head.appendChild(style);
        }
      };
    }
  }, []);

  const fetchCurrentFont = async () => {
    const getCurrentFontColor = await getAxiosCall("/getFontColor");
    setCurrentPack({
      value: getCurrentFontColor?.data?.font_name,
      label: getCurrentFontColor?.data?.font_name,
    });
  };

  const font = async () => {
    const response = await axios.get(
      `https://webfonts.googleapis.com/v1/webfonts?key=${process.env.FONT_KEY}`
    );
    const filteredRes = response?.data?.items?.map((el) => {
      return { value: el?.family, label: el?.family };
    });
    setFonts([...filteredRes]);
  };

  const updateChanges = async () => {
    debugger;
    const updatedRes = await updateAxiosCall(
      "/updateFontColor",
      currentPack?.value
    );
    if (updatedRes) {
      Swal.fire({
        title: "Success",
        text: updatedRes?.message,
        icon: "success",
        confirmButtonText: "Great!",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <PageWrapper title="Font Style & Color">
      <div className="container mx-auto p-4 text-xl">
        <div className="grid grid-cols-1 my-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="my-4">
            <div className="">
              <div className="label">Select Font</div>
              <div className="Select Fonts flex gap-4">
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  optionFilterProp="label"
                  placeholder="Search to find Fonts"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={fonts}
                  onChange={(e) => {
                    setCurrentPack({
                      label: e,
                      value: e,
                    });
                  }}
                  value={currentPack}
                />
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: "100%", height: "100vh", border: "none" }}>
          <iframe
            src={`http://localhost:3000?font=${currentPack?.value}`}
            title="DLM Realty and Construction"
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </PageWrapper>
  );
}

export default FontColor;
