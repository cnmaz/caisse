import './App.css';

import { QueryClient, QueryClientProvider } from 'react-query';
import Caisse from './Caisse';
import { BrowserRouter } from "react-router-dom";


const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Caisse />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
