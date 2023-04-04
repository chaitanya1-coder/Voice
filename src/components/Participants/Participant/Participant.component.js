import React, { useRef, useEffect } from "react";
import Card from "../../Shared/Card/Card.component";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Participant.css";

import * as tf from "@tensorflow/tfjs";
import { drawRect } from "./utilities";
import Webcam from "react-webcam";

export const Participant = (props) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json
    // https://tensorflowmodelforgmeet.s3.us-east.cloud-object-storage.appdomain.cloud/model.json
    // https://tensorflowmodelformeet.s3.us-east.cloud-object-storage.appdomain.cloud/model.json
    // https://tensorflowmahesh.s3.us-east.cloud-object-storage.appdomain.cloud/model.json

    // const net = await tf.loadGraphModel('https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json')
    // const net = await tf.loadGraphModel('https://tensorflowmodelforgmeet.s3.us-east.cloud-object-storage.appdomain.cloud/model.json')
    const net = await tf.loadGraphModel(
      "https://tensorflowmodelformeet.s3.us-east.cloud-object-storage.appdomain.cloud/model.json"
    );
    // const net = await tf.loadGraphModel('https://tensorflowmahesh.s3.us-east.cloud-object-storage.appdomain.cloud/model.json')

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);
      console.log(obj)

      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)
      requestAnimationFrame(() => {
        drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.8,
          videoWidth,
          videoHeight,
          ctx
        );
      });

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  const {
    curentIndex,
    currentParticipant,
    hideVideo,
    videoRef,
    showAvatar,
    currentUser,
  } = props;
  if (!currentParticipant) return <></>;
  return (
    <div className={`participant ${hideVideo ? "hide" : ""}`}>
      <Card>
        <video
          ref={videoRef}
          className="video"
          id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
          style={{
            display: "none",
            opacity: "0"
          }}
        ></video>

        <Webcam
          ref={webcamRef}
          muted={true}
          autoPlay
          playsInline
          className="video"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "100%",
            height: "100%",
          }}
          id={`participantVideo${curentIndex}`}
        />


        <canvas
          ref={canvasRef}
          style={{
            // display: "none",
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: "100%",
            height: "100%",
          }}
        />

        {!currentParticipant.audio && (
          <FontAwesomeIcon
            className="muted"
            icon={faMicrophoneSlash}
            title="Muted"
          />
        )}
        {showAvatar && (
          <div
            style={{ background: currentParticipant.avatarColor }}
            className="avatar"
          >
            {currentParticipant.name[0]}
          </div>
        )}
        <div className="name">
          {currentParticipant.name}
          {currentUser ? "(You)" : ""}
        </div>
      </Card>
    </div>
  );
};
