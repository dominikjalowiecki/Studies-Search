import { useContext, useState } from 'react';
import serviceStatusContext from "../contexts/serviceStatusContext";

function useServiceStatus()
{
    const [isServiceUnavailable, setServiceUnavailability] = useState(false);

    return {
        isServiceUnavailable,
        setServiceUnavailability
    };
}

export function ServiceStatusProvider({ children })
{
    const serviceStatus = useServiceStatus();

    return (
        <serviceStatusContext.Provider value={ serviceStatus }>
            { children }
        </serviceStatusContext.Provider>
    );
}

export function ServiceStatusConsumer()
{
    return useContext(serviceStatusContext);
}