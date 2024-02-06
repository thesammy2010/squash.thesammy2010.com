import React from "react"
import { Routes, Route } from "react-router-dom"

import HomePage from "./pages/Home"

export default function App() {
    return (
        <div id="page-container">
            <div id="router">
                <Routes>
                    <Route path="/">
                        <Route index element={<HomePage />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )
}