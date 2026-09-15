import { useEffect } from "react";
import salamLogo from "../assets/images/Salam-CI.jpg";
import "../styles/SplashScreen.css";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">

        <img
          src={salamLogo}
          alt="SALAM-CI"
          className="splash-logo"
        />

        <div className="splash-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p className="splash-loading">
          Chargement...
        </p>

      </div>
    </div>
  );
}

export default SplashScreen;