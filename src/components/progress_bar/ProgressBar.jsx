import { useEffect } from "react";
import useStorage from "../../utilities/hooks/useStorage";

import "./progressBar.css";

const ProgressBar = ({ file, setFile, setUrl, part }) => {
  const { url, progress } = useStorage(file, part);

  useEffect(() => {
    if (url) {
      setFile(null);
      setUrl(url);
    }
  }, [url, setFile, setUrl]);
  return <div className="progress-bar" style={{ width: progress + "%" }}></div>;
};

export default ProgressBar;
