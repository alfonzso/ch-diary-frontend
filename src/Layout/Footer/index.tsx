import { appVersion } from "../../Components/App";

function Footer() {
  return (
    <div className="footer">
      <h4>Version: {appVersion}</h4>
    </div>
  );
}

export default Footer;