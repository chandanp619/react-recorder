import React from "react";
import "./App.scss";
import Recorder from "./components/Recorder";
import Piano from "./components/Piano";

export default function App() {
    return (
        <div>
            <Recorder />
            <Piano />
        </div>
    );
}