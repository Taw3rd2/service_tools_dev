import { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import {
  db,
  projectStorage,
  updateDocument,
} from "../../firebase/firestore.utils";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const useStorage = (file, part) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const storageRef = ref(projectStorage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => {
        setError(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            setUrl(downloadUrl);
          })
          .then(() => {
            updateDocument(doc(db, "parts", part.id), { url });
          });
      }
    );

    // storageRef.put(file).on('state_changed', (snap) => {
    //     let percentage = (snap.bytesTransfered / snap.totalBytes) * 100
    //     setProgress(percentage)
    // }, (err) => {
    //     setError(err)
    // }, async () => {
    //     const url = await storageRef.getDownloadURL()
    //     console.log('part: ', part.id)
    //     collection("parts").doc(`${part.id}`).update({ url })
    //     setUrl(url)
    // })
  }, [file, part.id, url]);
  return { progress, url, error };
};

export default useStorage;
