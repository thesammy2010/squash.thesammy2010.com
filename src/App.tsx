import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import NotFound from './pages/NotFound';

export default function App() {
	return (
		<div id="page-container">
			<div id="router">
				<Routes>
                    <Route path="/" element={<HomePage />} />
				</Routes>
			</div>
		</div>
	);
}
