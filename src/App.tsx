// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import RoutesConfig from './routes/Routes';

// function App() {
//   return (
//     <RoutesConfig />
//   );
// }

// export default App;


import { BrowserRouter, HashRouter } from 'react-router-dom';
import RoutesConfig from './routes/Routes';

function App() {
  return (
    <HashRouter>
      <RoutesConfig />
    </HashRouter>
  );
}

export default App;