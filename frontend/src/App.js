import './App.css';

import { QueryClient, QueryClientProvider } from 'react-query';
import Caisse from './Caisse';


const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Caisse />
    </QueryClientProvider>
  );
}

export default App;
