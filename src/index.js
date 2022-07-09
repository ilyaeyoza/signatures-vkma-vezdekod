import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import StorageProvider from "./hoc/StorageProvider";

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
  <StorageProvider>
    <App />
  </StorageProvider>
, document.getElementById("root"));

// if (process.env.NODE_ENV === "development") {
//   import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
