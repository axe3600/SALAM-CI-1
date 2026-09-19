import { useEffect } from "react";
import salamLogo from "../assets/images/Salam-CI.jpg";
import "../styles/SplashScreen.css";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    let finished = false;

    const MIN_SPLASH_TIME = 800;
    const startTime = Date.now();

    const finishSplash = () => {
      if (finished) return;

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(
        0,
        MIN_SPLASH_TIME - elapsed
      );

      setTimeout(() => {
        if (!finished) {
          finished = true;
          onFinish();
        }
      }, remainingTime);
    };

    // Le navigateur a terminé le chargement initial
    if (document.readyState === "complete") {
      finishSplash();
    } else {
      window.addEventListener(
        "load",
        finishSplash,
        { once: true }
      );
    }

    return () => {
      finished = true;

      window.removeEventListener(
        "load",
        finishSplash
      );
    };
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