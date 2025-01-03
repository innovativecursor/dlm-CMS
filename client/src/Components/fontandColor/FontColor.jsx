import React, { useEffect, useState } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import { Button, Input, Select } from "antd";
import { getAxiosCall, updateAxiosCall } from "../../Axios/UniversalAxiosCalls";
import axios from "axios";
import Swal from "sweetalert2";
import { HexColorPicker } from "react-colorful";

function FontColor() {
  const [fonts, setFonts] = useState([]);
  const [currentPack, setCurrentPack] = useState({});
  const [navTextColor, setNavTextColor] = useState("#aabbcc");
  const [navIconsColor, setNavIconsColor] = useState("#aabbcc");
  const [heroMainTextColor, setHeroMainTextColor] = useState("#aabbcc");
  const [heroSubTextColor, setHeroSubTextColor] = useState("#aabbcc");
  const [universalButtonColor, setUniversalButtonColor] = useState("#aabbcc");
  const [universalSelectorTextColor, setUniversalSelectorTextColor] =
    useState("#aabbcc");
  const [universalHeadingTextColor, setUniversalHeadingTextColor] =
    useState("#aabbcc");
  const [universalContentTextColor, setUniversalContentTextColor] =
    useState("#aabbcc");

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
        <div className="grid grid-cols-1 mb-8 sm:grid-cols-2 md:grid-cols-3 gap-6 shadow-lg py-4">
          <div className="Select Font">
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
          <div className="Navbar">
            <div className="">
              <div className="label">Navbar Text Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={navTextColor}
                  onChange={setNavTextColor}
                />
                <Input
                  onChange={(e) => setNavTextColor(e.target.value)}
                  value={navTextColor}
                />
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Navbar_icons">
            <div className="">
              <div className="label">Navbar Icons Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={navIconsColor}
                  onChange={setNavIconsColor}
                />
                <Input
                  onChange={(e) => setNavIconsColor(e.target.value)}
                  value={navIconsColor}
                />
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Hero Section">
            <div className="">
              <div className="label">Hero Section Main Title Text Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={heroMainTextColor}
                  onChange={setHeroMainTextColor}
                />
                <Input
                  onChange={(e) => setHeroMainTextColor(e.target.value)}
                  value={heroMainTextColor}
                />
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Hero Sub Section Subtitle">
            <div className="">
              <div className="label">Hero Section Sub Title Text Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={heroSubTextColor}
                  onChange={setHeroSubTextColor}
                />
                <Input
                  onChange={(e) => setHeroSubTextColor(e.target.value)}
                  value={heroSubTextColor}
                />
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Universal Button Color">
            <div className="">
              <div className="label">Universal Button Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={universalButtonColor}
                  onChange={setUniversalButtonColor}
                />
                <Input
                  onChange={(e) => setUniversalButtonColor(e.target.value)}
                  value={universalButtonColor}
                />
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Universal Selector Secton">
            <div className="">
              <div className="label">Universal Selector Text Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={universalSelectorTextColor}
                  onChange={setUniversalSelectorTextColor}
                />
                <Input
                  onChange={(e) =>
                    setUniversalSelectorTextColor(e.target.value)
                  }
                  value={universalSelectorTextColor}
                />
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Universal Heading Secton">
            <div className="">
              <div className="label">Universal Heading Text Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={universalHeadingTextColor}
                  onChange={setUniversalHeadingTextColor}
                />
                <div className="text">
                  <Input
                    onChange={(e) =>
                      setUniversalHeadingTextColor(e.target.value)
                    }
                    value={universalHeadingTextColor}
                  />
                </div>
                <div className="flex items-center">
                  <Button onClick={updateChanges}>Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Universal Content Secton">
            <div className="">
              <div className="label">Universal Content Text Color</div>
              <div className="Select_color flex flex-col gap-4">
                <HexColorPicker
                  color={universalContentTextColor}
                  onChange={setUniversalContentTextColor}
                />
                <div className="text">
                  <Input
                    onChange={(e) =>
                      setUniversalContentTextColor(e.target.value)
                    }
                    value={universalContentTextColor}
                  />
                </div>
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
