import { MantineProvider } from '@mantine/core';
import UserProvider from './UserProvider';
import DataProvider from './DataProvider';
import { DirtyProvider } from './components/DirtyContext';

const Providers = ({ children }) => {

    return (
        <MantineProvider>
            <UserProvider>
                <DataProvider>
                    <DirtyProvider>
                        {children}
                    </DirtyProvider>
                </DataProvider>
            </UserProvider>
        </MantineProvider>
    );
};

export default Providers;