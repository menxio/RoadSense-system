import React, { useEffect, useState } from 'react';
import api from './utils/api';

const App = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('/example-endpoint')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>Data from Backend</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default App;