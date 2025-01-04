import { Authenticator } from "@aws-amplify/ui-react";
import "@popperjs/core/dist/umd/popper.min";
import { Amplify } from "aws-amplify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "jquery/dist/jquery.slim.min";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import config from "./aws-exports";
import "./index.css";
import { store } from "./store/store.ts";
config.oauth.redirectSignIn = `${window.location.origin}/`;
config.oauth.redirectSignOut = `${window.location.origin}/`;
Amplify.configure(config);

// Import Google Font using <style> tag
const style = document.createElement("style");
style.appendChild(
  document.createTextNode(`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Teko:wght@300;400;500;600;700&display=swap');

  /* Apply the font in your styles */
  body {
    font-family: 'Poppins', sans-serif !important;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Teko', sans-serif !important;
  }
`)
);
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Authenticator.Provider>
    <Provider store={store}>
      <App />
    </Provider>
  </Authenticator.Provider>
  // {/* </React.StrictMode> */}
);
