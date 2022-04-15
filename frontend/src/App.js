import './App.css';

import {QueryClient, QueryClientProvider} from 'react-query';
import Caisse from './Caisse';


const queryClient = new QueryClient()

function App() {
  return (
    <div className="caisse">
      <QueryClientProvider client={queryClient}>
        <Caisse />
      </QueryClientProvider>
    </div>
  );
}

export default App;
