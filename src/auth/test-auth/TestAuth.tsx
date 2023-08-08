import { ReactElement, useState } from 'react';
import { GetServerData, TestDto} from '../../api/GetServerData';

const apiClient = new GetServerData('https://localhost:7060');



const TestAuth = () => {

  const [responce, setResponce] = useState<TestDto | undefined>(undefined);
  async function testAuth() {
    const responce = await apiClient.testAuth();
    setResponce(responce);
  }

  const handleKeyDown = () => {
    testAuth();
  }

  return (
    <div>
      <button onClick={handleKeyDown}>Send</button>
      {responce ?
        <div>
          <p>UserName: {responce.userName}</p>
          <p>Number: {responce.number}</p>
        </div>
        : <p>Click "Send" to send request</p>}

    </div>
  );
}
export default TestAuth;