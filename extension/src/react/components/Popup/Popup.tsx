import React, { useState } from "react";

const Popup: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState<string>("#ff0000");
  const [textColor, setTextColor] = useState<string>("#000000");

  const handleBackgroundColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newColor = event.target.value;
    setBackgroundColor(newColor);
    sendMessage({ backgroundColor: newColor, textColor });
  };

  const handleTextColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newColor = event.target.value;
    setTextColor(newColor);
    sendMessage({ backgroundColor, textColor: newColor });
  };

  const sendMessage = (data: {
    backgroundColor: string;
    textColor: string;
  }) => {
    chrome.runtime.sendMessage({ type: "updateColors", data });
  };

  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        backgroundColor,
        color: textColor,
      }}
    >
      <form>
        <label htmlFor="background-picker">Select background color:</label>
        <input
          type="color"
          id="background-picker"
          value={backgroundColor}
          onChange={handleBackgroundColorChange}
        />

        <label htmlFor="text-picker">Select text color:</label>
        <input
          type="color"
          id="text-picker"
          value={textColor}
          onChange={handleTextColorChange}
        />
      </form>

      <p>You selected background color: {backgroundColor}</p>
      <p>You selected text color: {textColor}</p>
    </div>
  );
};

export default Popup;
