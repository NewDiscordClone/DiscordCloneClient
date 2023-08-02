import { FC, ReactElement, useState } from 'react';
import { Client, TestDto } from '../../api/api';

const apiClient = new Client('https://localhost:7060');



const TestAuth: FC<{}> = (): ReactElement => {

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
